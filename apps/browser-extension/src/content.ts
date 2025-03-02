import FormatButton from '$lib/components/FormatButton.svelte';
import { mount, unmount } from 'svelte';

(() => {
	let activeFormatter: HTMLTextAreaElement | null = null;
	const processedTextareas = new Map<HTMLTextAreaElement, unknown>();

	function init(): void {
		findAndProcessTextareas();

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes && mutation.addedNodes.length > 0) {
					findAndProcessTextareas();
				}

				if (mutation.removedNodes && mutation.removedNodes.length > 0) {
					mutation.removedNodes.forEach((node) => {
						if (node instanceof HTMLTextAreaElement) {
							const component = processedTextareas.get(node);

							if (component) {
								unmount(component);
								processedTextareas.delete(node);
							}
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	function findAndProcessTextareas(): void {
		const textareas = document.querySelectorAll<HTMLTextAreaElement>('textarea');

		textareas.forEach((textarea) => {
			if (!processedTextareas.has(textarea)) {
				const container = document.createElement('div');
				document.body.appendChild(container);

				const component = mount(FormatButton, {
					target: container,
					props: { textarea, onClick: () => formatTextarea(textarea) }
				});

				processedTextareas.set(textarea, component);
			}
		});
	}

	function cleanup() {
		if (activeFormatter) {
			activeFormatter = null;
		}
	}

	async function formatTextarea(textarea: HTMLTextAreaElement): Promise<void> {
		if (!textarea.value.trim()) {
			showNotification('Textarea is empty', 'warning');
			return;
		}

		if (activeFormatter) {
			showNotification('Formatting already in progress', 'info');
			return;
		}

		activeFormatter = textarea;
		textarea.classList.add('markmaster-formatting');

		const progressIndicator = document.createElement('div');
		progressIndicator.className = 'markmaster-progress';
		progressIndicator.innerHTML = '<div class="markmaster-spinner"></div>';
		document.body.appendChild(progressIndicator);

		const originalContent = textarea.value;
		textarea.value = '';

		try {
			await sendMessagePromise({
				// @ts-expect-error - lel
				action: 'formatText',
				text: originalContent
			});
		} catch (error) {
			console.error('Error initiating formatting:', error);
			textarea.value = originalContent;
			showNotification('Connection error', 'error');
			cleanup();
		}
	}

	function sendMessagePromise<T = unknown>(message: ChromeMessage): Promise<T> {
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

	function showNotification(message: string, type = 'info'): void {
		const notification = document.createElement('div');
		notification.className = `markmaster-notification markmaster-${type}`;
		notification.textContent = message;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.classList.add('markmaster-fade-out');
			setTimeout(() => {
				notification.remove();
			}, 500);
		}, 3000);
	}

	chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
		if (!activeFormatter) return;

		switch (message.action) {
			case 'streamUpdate':
				if (message.chunk) {
					activeFormatter.value += message.chunk;
					activeFormatter.scrollTop = activeFormatter.scrollHeight;
				}
				break;

			case 'streamComplete':
				cleanup();
				break;

			case 'streamError':
				console.error('Stream error:', message.error);
				cleanup();
				break;
		}
	});

	window.addEventListener('formatRequest', ((event: Event) => {
		const customEvent = event as CustomEvent<{ textarea: HTMLTextAreaElement }>;
		if (customEvent.detail?.textarea) {
			activeFormatter = customEvent.detail.textarea;
		}
	}) as EventListener);

	init();
})();
