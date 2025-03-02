import systemPrompt from './system-prompt';

export default async function formatWithLlm(
	text: string,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	try {
		const response = await fetch(
			'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: 'gemini-2.0-flash',
					messages: [
						{ role: 'system', content: systemPrompt },
						{ role: 'user', content: text }
					],
					stream: true
				} as OpenAIRequest)
			}
		);

		if (!response.ok) {
			throw new Error(`API error: ${response.status}, ${response.statusText}`);
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
				if (line.startsWith('data: ')) {
					try {
						if (line.includes('[DONE]')) continue;

						const jsonStr = line.replace('data: ', '');
						const parsed = JSON.parse(jsonStr);

						if (parsed.choices[0].delta?.content) {
							chrome.tabs.sendMessage(sender.tab!.id!, {
								action: 'streamUpdate',
								chunk: parsed.choices[0].delta.content
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
		console.error('Error in formatWithLlm:', error);
		throw error;
	}
}
