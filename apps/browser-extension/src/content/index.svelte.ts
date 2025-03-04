import PromptForm from '$lib/components/PromptForm.svelte';
import { mount, unmount } from 'svelte';
import isFormFocused from './is-form-focused.svelte';
import showNotification from './show-notification.svelte';
import updateFormPosition from './update-form-position.svelte';

(() => {
	let formComponent: unknown = null;
	let formContainer: HTMLDivElement | null = $state(null);
	let highlightOverlay: HTMLDivElement | null = $state(null);
	let isStreamingResponse = $state(false);
	// eslint-disable-next-line prefer-const
	let promptFormProps = $state({ onSubmit: handleSubmit, response: '' });
	let responseState = $state('');
	let selectedText: string | null = $state(null);

	function cleanup() {
		resetResponse();

		if (formComponent) {
			unmount(formComponent);
			formComponent = null;
		}

		if (formContainer) {
			formContainer.remove();
			formContainer = null;
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

		document.body.appendChild(highlightOverlay);
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

		if (isStreamingResponse) {
			showNotification('Responding in progress', 'info');
			return;
		}

		isStreamingResponse = true;
		responseState = '';

		try {
			await sendMessage({
				action: 'sendPrompt',
				systemPrompt: `This is a text which i want you to use for my further instruction: ${selectedText}`,
				userPrompt: prompt
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

		if (!selection || !selection.toString().trim()) {
			if (!isFormFocused(formContainer)) {
				if (shouldCleanup()) {
					cleanup();
				}
			}
			return;
		}

		if (shouldCleanup()) {
			resetResponse();
		} else {
			return;
		}

		const range = selection.getRangeAt(0);
		selectedText = selection.toString();

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
		promptFormProps.response = '';
		responseState = '';
	}

	function shouldCleanup(): boolean {
		if (responseState.trim()) {
			return window.confirm('Are you sure you want to clear the response and start over?');
		}
		return true;
	}

	chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
		if (!isStreamingResponse) return;

		switch (message.action) {
			case 'streamUpdate':
				if (message.chunk) {
					responseState = responseState + message.chunk;
					promptFormProps.response = responseState;
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

	document.addEventListener('selectionchange', handleSelection);

	document.addEventListener('mousedown', (e) => {
		if (
			formContainer &&
			!formContainer.contains(e.target as Node) &&
			!highlightOverlay?.contains(e.target as Node)
		) {
			if (shouldCleanup()) {
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
