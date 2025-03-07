/* eslint-disable prefer-const */
import { mount, unmount } from 'svelte';

import LlmMessage from '$lib/components/LlmMessage.svelte';
import PromptForm from '$lib/components/PromptForm.svelte';
import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';

import isFormFocused from './is-form-focused.svelte';
import updateFormPosition from './update-form-position.svelte';

export default function contentScript() {
	let llmMessageComponent: unknown = null;
	let llmMessageContainer: HTMLDivElement | null = $state(null);
	let llmMessageProps = $state({ content: '' });

	let promptFormComponent: unknown = null;
	let promptFormContainer: HTMLDivElement | null = $state(null);
	let promptFormProps = $state({ isLoading: false, prompt: '', selectedText: '' });

	let selectionOverlayComponent: unknown = null;
	let selectionOverlayContainer: HTMLDivElement | null = $state(null);
	let selectionOverlayProps = $state({
		rect: null as DOMRect | null,
		textLength: 0
	});

	function cleanup() {
		promptFormProps.isLoading = false;
		promptFormProps.prompt = '';
		llmMessageProps.content = '';

		const components = [
			{ component: promptFormComponent, container: promptFormContainer },
			{ component: llmMessageComponent, container: llmMessageContainer },
			{ component: selectionOverlayComponent, container: selectionOverlayContainer }
		];

		for (const { component, container } of components) {
			if (component) {
				unmount(component);
			}
			if (container) {
				container.remove();
			}
		}

		promptFormComponent = llmMessageComponent = selectionOverlayComponent = null;
		promptFormContainer = llmMessageContainer = selectionOverlayContainer = null;

		promptFormProps.selectedText = '';
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
			alert('Selection exceeds 128k character limit');
			return;
		}

		const range = selection.getRangeAt(0);
		promptFormProps.selectedText = selectedContent;
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

	// Remove handleSubmit function as it's now in PromptForm

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

	function updateSelectionOverlay(range: Range) {
		const rect = range.getBoundingClientRect();
		selectionOverlayProps.rect = rect;
		selectionOverlayProps.textLength = promptFormProps.selectedText?.length || 0;

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
		switch (message.action) {
			case 'streamStart':
				mountLlmMessage();
				break;
			case 'streamUpdate':
				if (message.chunk) {
					llmMessageProps.content = llmMessageProps.content + message.chunk;
				}
				break;

			case 'streamComplete':
				promptFormProps.isLoading = false;
				promptFormProps.prompt = '';
				break;

			case 'streamError':
				console.error('Stream error:', message.error);
				promptFormProps.isLoading = false;
				promptFormProps.prompt = '';
				break;
		}
	});

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
		if (promptFormProps.selectedText) {
			const selection = window.getSelection();

			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				updateSelectionOverlay(range);
			}
		}
	});

	document.addEventListener('selectionchange', handleSelection);

	window.addEventListener('resize', () => {
		if (promptFormProps.selectedText && promptFormContainer) {
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
}
