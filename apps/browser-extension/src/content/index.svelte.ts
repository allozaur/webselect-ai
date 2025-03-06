/* eslint-disable prefer-const */
import { mount, unmount } from 'svelte';

import LlmMessage from '$lib/components/LlmMessage.svelte';
import PromptForm from '$lib/components/PromptForm.svelte';
import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';

import injectFontLinks from './inject-font-links';
import isFormFocused from './is-form-focused.svelte';
import showNotification from './show-notification.svelte';
import updateFormPosition from './update-form-position.svelte';

(() => injectFontLinks())();

(() => {
	let isStreamingActive = $state(false);

	let llmMessageComponent: unknown = null;
	let llmMessageContainer: HTMLDivElement | null = $state(null);
	let llmMessageProps = $state({ content: '' });

	let promptFormComponent: unknown = null;
	let promptFormContainer: HTMLDivElement | null = $state(null);
	let promptFormProps = $state({ onSubmit: handleSubmit });

	let selectionOverlayComponent: unknown = null;
	let selectionOverlayContainer: HTMLDivElement | null = $state(null);
	let selectionOverlayProps = $state({
		rect: null as DOMRect | null,
		textLength: 0
	});

	let selectedText: string | null = $state(null);

	function cleanup() {
		isStreamingActive = false;
		llmMessageProps.content = '';

		if (promptFormComponent) {
			unmount(promptFormComponent);
			promptFormComponent = null;
		}

		if (llmMessageComponent) {
			unmount(llmMessageComponent);
			llmMessageComponent = null;
		}

		if (selectionOverlayComponent) {
			unmount(selectionOverlayComponent);
			selectionOverlayComponent = null;
		}

		if (promptFormContainer) {
			promptFormContainer.remove();
			promptFormContainer = null;
		}

		if (llmMessageContainer) {
			llmMessageContainer.remove();
			llmMessageContainer = null;
		}

		if (selectionOverlayContainer) {
			selectionOverlayContainer.remove();
			selectionOverlayContainer = null;
		}

		selectedText = null;
	}

	function handleSelection() {
		if (isFormFocused(promptFormContainer)) {
			return;
		}

		const selection = window.getSelection();

		if (selection && llmMessageContainer?.contains(selection.anchorNode)) {
			return;
		}

		if (!selection || !selection.toString().trim()) {
			if (selectionOverlayComponent) {
				cleanup();
			}
			return;
		}

		const selectedContent = selection.toString();

		if (selectedContent.length > 128000) {
			showNotification('Selection exceeds 128k character limit', 'warning');
			return;
		}

		const range = selection.getRangeAt(0);
		selectedText = selectedContent;
		updateSelectionOverlay(range);

		if (!promptFormContainer) {
			promptFormContainer = document.createElement('div');
			document.body.appendChild(promptFormContainer);

			promptFormComponent = mount(PromptForm, {
				target: promptFormContainer,
				props: promptFormProps
			});
		}

		updateFormPosition(selection, promptFormContainer);
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

		if (isStreamingActive) {
			showNotification('Responding in progress', 'info');
			return;
		}

		isStreamingActive = true;

		try {
			await sendMessage({
				action: 'sendPrompt',
				systemPrompt: `You are a helpful assistant`,
				userPrompt: `This is a text which i want you to use for my further instruction: ${selectedText}. Now this is my prompt: ${prompt}`
			});
		} catch (error) {
			console.error('Error initiating LLM message:', error);
			showNotification('Connection error', 'error');
			cleanup();
		}
	}

	function updateSelectionOverlay(range: Range) {
		const rect = range.getBoundingClientRect();
		selectionOverlayProps.rect = rect;
		selectionOverlayProps.textLength = selectedText?.length || 0;

		if (!selectionOverlayContainer) {
			selectionOverlayContainer = document.createElement('div');
			document.body.appendChild(selectionOverlayContainer);

			selectionOverlayComponent = mount(SelectionOverlay, {
				target: selectionOverlayContainer,
				props: selectionOverlayProps
			});
		}
	}

	chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
		if (!isStreamingActive) return;

		switch (message.action) {
			case 'streamStart':
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

				break;
			case 'streamUpdate':
				if (message.chunk) {
					llmMessageProps.content = llmMessageProps.content + message.chunk;
				}
				break;

			case 'streamComplete':
				isStreamingActive = false;
				break;

			case 'streamError':
				console.error('Stream error:', message.error);
				showNotification('Error: ' + (message.error || 'Unknown error'), 'error');
				isStreamingActive = false;
				llmMessageProps.content = '';
				break;
		}
	});

	document.addEventListener('selectionchange', handleSelection);

	document.addEventListener('mousedown', (e) => {
		if (
			promptFormContainer &&
			!promptFormContainer.contains(e.target as Node) &&
			!selectionOverlayContainer?.contains(e.target as Node) &&
			!llmMessageContainer?.contains(e.target as Node)
		) {
			if (
				!llmMessageProps.content.trim() ||
				(llmMessageProps?.content.trim().length > 0 &&
					window.confirm('Are you sure you want to clear the response and start over?'))
			) {
				cleanup();
			}
		}
	});

	document.addEventListener('scroll', () => {
		if (selectedText) {
			const selection = window.getSelection();

			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				updateSelectionOverlay(range);
			}
		}
	});

	window.addEventListener('resize', () => {
		if (selectedText && promptFormContainer) {
			const selection = window.getSelection();

			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				updateSelectionOverlay(range);

				const rect = range.getBoundingClientRect();
				promptFormContainer.style.left = `${rect.left + window.scrollX}px`;
				promptFormContainer.style.top = `${rect.bottom + window.scrollY + 10}px`;
			}
		}
	});
})();
