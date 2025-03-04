import OpenAI from 'openai';

export default async function handleLlmRequest(
	systemPrompt: string,
	text: string,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	try {
		const openai = new OpenAI({
			apiKey: import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY,
			baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
		});

		const completion = await openai.chat.completions.create({
			model: 'gemini-2.0-flash',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: text }
			],
			stream: true
		});

		chrome.tabs.sendMessage(sender.tab!.id!, {
			action: 'streamStart'
		});

		for await (const chunk of completion) {
			if (chunk.choices[0]?.delta?.content) {
				chrome.tabs.sendMessage(sender.tab!.id!, {
					action: 'streamUpdate',
					chunk: chunk.choices[0].delta.content
				} as StreamMessage);
			}
		}
	} catch (error) {
		console.error('Error in formatWithLlm:', error);
		throw error;
	}
}
