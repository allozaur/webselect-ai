import type { NotificationType, ChromeMessage } from './types';

(() => {
	// Track textareas that have already been processed
	const processedTextareas = new Set<HTMLTextAreaElement>();
	let activeFormatter: HTMLTextAreaElement | null = null;

	function init(): void {
		findAndProcessTextareas();

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes && mutation.addedNodes.length > 0) {
					findAndProcessTextareas();
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
				addFormatButton(textarea);
				processedTextareas.add(textarea);
			}
		});
	}

	function addFormatButton(textarea: HTMLTextAreaElement): void {
		const container = document.createElement('div');
		container.className = 'markmaster-btn-container';

		const button = document.createElement('button');
		button.className = 'markmaster-btn';
		button.innerHTML = 'MD';
		button.title = 'Format to Markdown';

		button.addEventListener('click', () => {
			formatTextarea(textarea);
		});

		container.appendChild(button);

		positionContainer(container, textarea);
		document.body.appendChild(container);

		window.addEventListener('resize', () => {
			positionContainer(container, textarea);
		});

		document.addEventListener(
			'scroll',
			() => {
				positionContainer(container, textarea);
			},
			true
		);

		const resizeObserver = new ResizeObserver(() => {
			positionContainer(container, textarea);
		});

		resizeObserver.observe(textarea);

		const elementObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList' && mutation.removedNodes) {
					mutation.removedNodes.forEach((node) => {
						if (node === textarea || (node instanceof Node && node.contains(textarea))) {
							container.remove();
							elementObserver.disconnect();
							resizeObserver.disconnect();
							processedTextareas.delete(textarea);
						}
					});
				}
			});
		});

		elementObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	function positionContainer(container: HTMLDivElement, textarea: HTMLTextAreaElement): void {
		const rect = textarea.getBoundingClientRect();
		container.style.position = 'absolute';
		container.style.top = `${window.scrollY + rect.top + 5}px`;
		container.style.left = `${window.scrollX + rect.right - 30}px`;
		container.style.zIndex = '9999';
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

	chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
		if (!activeFormatter) return;

		switch (message.action) {
			case 'streamUpdate':
				activeFormatter.value += message.chunk;
				activeFormatter.scrollTop = activeFormatter.scrollHeight;
				break;

			case 'streamComplete':
				showNotification('Formatting complete!', 'success');
				cleanup();
				break;

			case 'streamError':
				showNotification(message.error || 'Formatting failed', 'error');
				cleanup();
				break;
		}
	});

	function cleanup(): void {
		if (activeFormatter) {
			activeFormatter.classList.remove('markmaster-formatting');
			activeFormatter.dispatchEvent(new Event('input', { bubbles: true }));
			activeFormatter = null;
		}

		const progressIndicator = document.querySelector('.markmaster-progress');
		if (progressIndicator) {
			progressIndicator.remove();
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

	function showNotification(message: string, type: NotificationType = 'info'): void {
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

	init();
})();
