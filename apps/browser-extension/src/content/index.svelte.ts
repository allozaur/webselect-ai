import PromptForm from '$lib/components/PromptForm.svelte';
import showNotification from '$lib/show-notification';
import { mount, unmount } from 'svelte';

interface PromptFormProps {
	onSubmit: (prompt: string) => Promise<void>;
	response: string;
}

(() => {
	let activeFormatting = false;
	let formComponent: unknown = null;
	let formContainer: HTMLDivElement | null = null;
	let highlightOverlay: HTMLDivElement | null = null;
	let responseState = $state('');
	let selectedText: string | null = null;
	// eslint-disable-next-line prefer-const
	let promptFormProps: PromptFormProps = $state({ onSubmit: handleFormat, response: '' });

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

	async function handleFormat(prompt: string): Promise<void> {
		if (!selectedText) {
			showNotification('No text selected', 'warning');
			return;
		}

		if (activeFormatting) {
			showNotification('Formatting already in progress', 'info');
			return;
		}

		activeFormatting = true;
		responseState = ''; // Reset response before starting new formatting

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
		// Ignore selection events when form is focused
		if (isFormFocused()) {
			return;
		}

		const selection = window.getSelection();

		if (!selection || !selection.toString().trim()) {
			if (!isFormFocused()) {
				if (shouldCleanup()) {
					cleanup();
				}
			}
			return;
		}

		// Only reset if there's no existing response or user confirms
		if (shouldCleanup()) {
			resetResponse();
		} else {
			return; // Keep existing state if user cancels
		}

		const range = selection.getRangeAt(0);
		selectedText = selection.toString();

		if (!highlightOverlay) {
			createHighlightOverlay(range);
		} else {
			// Update existing highlight position
			const rect = range.getBoundingClientRect();
			highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
			highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
			highlightOverlay.style.width = `${rect.width}px`;
			highlightOverlay.style.height = `${rect.height}px`;
		}

		if (!formContainer) {
			formContainer = document.createElement('div');
			document.body.appendChild(formContainer);

			// Create the PromptForm component with $derived for response
			formComponent = mount(PromptForm, {
				target: formContainer,
				props: promptFormProps
			});
		}

		updateFormPosition(selection);
	}

	function isFormFocused(): boolean {
		return formContainer?.contains(document.activeElement) ?? false;
	}

	function resetResponse() {
		activeFormatting = false;
		promptFormProps.response = '';
		responseState = '';
	}

	function shouldCleanup(): boolean {
		// Only show confirmation if there's a response
		if (responseState.trim()) {
			return window.confirm('Are you sure you want to clear the response and start over?');
		}
		return true;
	}

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

	function updateFormPosition(selection: Selection) {
		if (!formContainer) return;

		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		formContainer.style.position = 'absolute';
		formContainer.style.left = `${rect.left + window.scrollX}px`;
		formContainer.style.top = `${rect.bottom + window.scrollY + 10}px`;
	}

	chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
		if (!activeFormatting) return;

		switch (message.action) {
			case 'streamUpdate':
				if (message.chunk) {
					responseState = responseState + message.chunk;
					promptFormProps.response = responseState;
				}
				break;

			case 'streamComplete':
				activeFormatting = false;
				break;

			case 'streamError':
				console.error('Stream error:', message.error);
				showNotification('Error: ' + (message.error || 'Unknown error'), 'error');
				resetResponse();
				break;
		}
	});

	document.addEventListener('selectionchange', handleSelection);

	// Modify click outside handler
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

	// Add these event listeners
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

	// Add window resize handler
	window.addEventListener('resize', () => {
		if (highlightOverlay && selectedText && formContainer) {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				// Update highlight overlay position
				highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
				highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
				highlightOverlay.style.width = `${rect.width}px`;
				highlightOverlay.style.height = `${rect.height}px`;

				// Update form position
				formContainer.style.left = `${rect.left + window.scrollX}px`;
				formContainer.style.top = `${rect.bottom + window.scrollY + 10}px`;
			}
		}
	});
})();
