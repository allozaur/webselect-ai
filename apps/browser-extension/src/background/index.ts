interface OllamaMessage {
	role: 'system' | 'user';
	content: string;
}

interface OllamaRequest {
	model: string;
	messages: OllamaMessage[];
	stream: boolean;
}

interface OllamaResponse {
	message?: {
		content: string;
	};
}

interface FormatTextRequest {
	action: 'formatText';
	text: string;
}

interface StreamMessage {
	action: 'streamUpdate' | 'streamComplete' | 'streamError';
	chunk?: string;
	error?: string;
}

import systemPrompt from '$lib/system-prompt';

async function formatWithOllama(text: string, sender: chrome.runtime.MessageSender): Promise<void> {
	try {
		const response = await fetch('http://localhost:11434/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'qwen2.5-coder:32b',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: text }
				],
				stream: true
			} as OllamaRequest)
		});

		if (!response.ok) {
			throw new Error(`Ollama API error: ${response.status}, ${response.statusText}`);
		}

		const reader = response.body!.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			const lines = buffer.split('\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (line.trim()) {
					try {
						const chunk = JSON.parse(line) as OllamaResponse;
						if (chunk.message?.content) {
							chrome.tabs.sendMessage(sender.tab!.id!, {
								action: 'streamUpdate',
								chunk: chunk.message.content
							} as StreamMessage);
						}
					} catch (e) {
						console.warn('Error parsing chunk:', e);
					}
				}
			}
		}

		chrome.tabs.sendMessage(sender.tab!.id!, {
			action: 'streamComplete'
		} as StreamMessage);
	} catch (error) {
		console.error('Error in formatWithOllama:', error);
		throw error;
	}
}

chrome.runtime.onMessage.addListener(
	(request: FormatTextRequest, sender: chrome.runtime.MessageSender, sendResponse: () => void) => {
		if (request.action === 'formatText') {
			formatWithOllama(request.text, sender).catch((error) => {
				chrome.tabs.sendMessage(sender.tab!.id!, {
					action: 'streamError',
					error: error.message
				} as StreamMessage);
			});
			return true;
		}
		return false;
	}
);
