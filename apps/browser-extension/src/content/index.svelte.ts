import PromptForm from '$lib/components/PromptForm.svelte';
import { mount, unmount } from 'svelte';
import isFormFocused from './is-form-focused.svelte';
import showNotification from './show-notification.svelte';
import updateFormPosition from './update-form-position.svelte';
import LlmMessage from '$lib/components/LlmMessage.svelte';

(() => {
	function injectFontLinks() {
		const links = [
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap'
			}
		];

		links.forEach((linkProps) => {
			const link = document.createElement('link');
			Object.entries(linkProps).forEach(([key, value]) => {
				link.setAttribute(key, value);
			});
			document.head.appendChild(link);
		});
	}

	let formComponent: unknown = null;
	let llmMessageComponent: unknown = null;
	let llmMessageContainer: HTMLDivElement | null = $state(null);
	let formContainer: HTMLDivElement | null = $state(null);
	let highlightOverlay: HTMLDivElement | null = $state(null);
	let tokenCounter: HTMLSpanElement | null = $state(null);
	let isStreamingResponse = $state(false);
	// eslint-disable-next-line prefer-const
	let promptFormProps = $state({ onSubmit: handleSubmit });
	// eslint-disable-next-line prefer-const
	let llmMessageProps = $state({ content: '' });
	let responseState = $state('');
	let selectedText: string | null = $state(null);

	function cleanup() {
		resetResponse();

		if (tokenCounter) {
			tokenCounter = null;
		}

		if (formComponent) {
			unmount(formComponent);
			formComponent = null;
		}

		if (llmMessageComponent) {
			unmount(llmMessageComponent);
			llmMessageComponent = null;
		}

		if (formContainer) {
			formContainer.remove();
			formContainer = null;
		}

		if (llmMessageContainer) {
			llmMessageContainer.remove();
			llmMessageContainer = null;
		}

		if (highlightOverlay) {
			highlightOverlay.remove();
			highlightOverlay = null;
		}

		selectedText = null;
	}

	function createHighlightOverlay(range: Range) {
		const rect = range.getBoundingClientRect();

		highlightOverlay = document.createElement('div');
		highlightOverlay.style.borderRadius = '0.5rem';
		highlightOverlay.style.position = 'absolute';
		highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
		highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
		highlightOverlay.style.width = `${rect.width}px`;
		highlightOverlay.style.height = `${rect.height}px`;
		highlightOverlay.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
		highlightOverlay.style.pointerEvents = 'none';
		highlightOverlay.style.zIndex = '9999';

		// Add token counter
		tokenCounter = document.createElement('span');
		tokenCounter.style.position = 'absolute';
		tokenCounter.style.right = '0';
		tokenCounter.style.bottom = '-20px';
		tokenCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
		tokenCounter.style.color = 'white';
		tokenCounter.style.padding = '2px 6px';
		tokenCounter.style.borderRadius = '4px';
		tokenCounter.style.fontSize = '12px';
		tokenCounter.style.fontFamily = 'Space Grotesk, sans-serif';
		highlightOverlay.appendChild(tokenCounter);

		document.body.appendChild(highlightOverlay);
	}

	function updateTokenCount(text: string) {
		if (tokenCounter) {
			const charCount = text.length;
			const isOverLimit = charCount > 128000;
			tokenCounter.textContent = `${charCount.toLocaleString()} chars`;
			tokenCounter.style.backgroundColor = isOverLimit
				? 'rgba(255, 0, 0, 0.7)'
				: 'rgba(0, 0, 0, 0.7)';
			return !isOverLimit;
		}
		return true;
	}

	async function handleSubmit(prompt: string): Promise<void> {
		function sendMessage<T = unknown>(message: ChromeMessage): Promise<T> {
			return new Promise((resolve, reject) => {
				chrome.runtime.sendMessage(message, (response) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve(response);
					}
				});
			});
		}

		if (!selectedText) {
			showNotification('No text selected', 'warning');
			return;
		}

		if (selectedText.length > 128000) {
			showNotification('Selection exceeds 128k character limit', 'warning');
			return;
		}

		if (isStreamingResponse) {
			showNotification('Responding in progress', 'info');
			return;
		}

		isStreamingResponse = true;
		responseState = '';

		try {
			await sendMessage({
				action: 'sendPrompt',
				systemPrompt: `You are a helpful assistant`,
				userPrompt: `This is a text which i want you to use for my further instruction: ${selectedText}. Now this is my prompt: ${prompt}`
			});
		} catch (error) {
			console.error('Error initiating formatting:', error);
			showNotification('Connection error', 'error');
			cleanup();
		}
	}

	function handleSelection() {
		if (isFormFocused(formContainer)) {
			return;
		}

		const selection = window.getSelection();

		// Ignore selections inside LLM message
		if (selection && llmMessageContainer?.contains(selection.anchorNode)) {
			return;
		}

		if (!selection || !selection.toString().trim()) {
			return;
		}

		const selectedContent = selection.toString();
		if (!updateTokenCount(selectedContent)) {
			showNotification('Selection exceeds 128k character limit', 'warning');
			return;
		}

		const range = selection.getRangeAt(0);
		selectedText = selectedContent;

		if (!highlightOverlay) {
			createHighlightOverlay(range);
		} else {
			const rect = range.getBoundingClientRect();
			highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
			highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
			highlightOverlay.style.width = `${rect.width}px`;
			highlightOverlay.style.height = `${rect.height}px`;
		}

		if (!formContainer) {
			formContainer = document.createElement('div');
			document.body.appendChild(formContainer);

			formComponent = mount(PromptForm, {
				target: formContainer,
				props: promptFormProps
			});
		}

		updateFormPosition(selection, formContainer);
	}

	function resetResponse() {
		isStreamingResponse = false;
		llmMessageProps.content = '';
		responseState = '';
	}

	function shouldCleanup(): boolean {
		// Only prompt for cleanup if there's a response and we're not interacting with the LLM message
		if (responseState.trim() && !llmMessageContainer?.contains(document.activeElement)) {
			return window.confirm('Are you sure you want to clear the response and start over?');
		}
		// Don't cleanup if we have an active response
		if (responseState.trim()) {
			return false;
		}
		return true;
	}

	function mountLlmMessage() {
		if (!llmMessageContainer) {
			llmMessageContainer = document.createElement('div');
			llmMessageContainer.style.position = 'fixed';
			llmMessageContainer.style.top = '1rem';
			llmMessageContainer.style.right = '1rem';
			llmMessageContainer.style.zIndex = '10000';
			document.body.appendChild(llmMessageContainer);

			llmMessageComponent = mount(LlmMessage, {
				target: llmMessageContainer,
				props: llmMessageProps
			});
		}
	}

	chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
		if (!isStreamingResponse) return;

		switch (message.action) {
			case 'streamStart':
				mountLlmMessage();

				break;
			case 'streamUpdate':
				if (message.chunk) {
					responseState = responseState + message.chunk;
					llmMessageProps.content = responseState;
				}
				break;

			case 'streamComplete':
				isStreamingResponse = false;
				break;

			case 'streamError':
				console.error('Stream error:', message.error);
				showNotification('Error: ' + (message.error || 'Unknown error'), 'error');
				resetResponse();
				break;
		}
	});

	// Call the function to inject font links
	injectFontLinks();

	document.addEventListener('selectionchange', handleSelection);

	document.addEventListener('mousedown', (e) => {
		if (
			formContainer &&
			!formContainer.contains(e.target as Node) &&
			!highlightOverlay?.contains(e.target as Node) &&
			!llmMessageContainer?.contains(e.target as Node)
		) {
			// Only cleanup if we're clicking outside of all UI elements
			// and there's no active response
			if (!responseState.trim() || shouldCleanup()) {
				cleanup();
			}
		}
	});

	document.addEventListener('scroll', () => {
		if (highlightOverlay && selectedText) {
			const selection = window.getSelection();

			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();
				highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
				highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
			}
		}
	});

	window.addEventListener('resize', () => {
		if (highlightOverlay && selectedText && formContainer) {
			const selection = window.getSelection();

			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
				highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
				highlightOverlay.style.width = `${rect.width}px`;
				highlightOverlay.style.height = `${rect.height}px`;

				formContainer.style.left = `${rect.left + window.scrollX}px`;
				formContainer.style.top = `${rect.bottom + window.scrollY + 10}px`;
			}
		}
	});
})();
