import OpenAI from 'openai';

let baseURL: string;

export default async function handleLlmRequest(
	systemPrompt: string,
	text: string,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	try {
		const { apiKey, model, provider } = await new Promise<{
			apiKey: string;
			model: string;
			provider: string;
		}>((resolve, reject) => {
			chrome.storage.local.get('llm_config', (result) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				}
				if (!result.llm_config) {
					reject(new Error('OpenAI base URL not set'));
				}
				resolve(result.llm_config);
			});
		});

		if (provider === 'ollama') {
			baseURL = import.meta.env.VITE_OLLAMA_API_URL;
		} else if (provider === 'google') {
			baseURL = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_URL;
		} else if (provider === 'openai') {
			baseURL = import.meta.env.VITE_OPENAI_API_URL;
		} else if (provider === 'anthropic') {
			baseURL = import.meta.env.VITE_ANTHROPIC_API_URL;
		}

		if (!baseURL) {
			throw new Error('OpenAI base URL not set');
		} else if (provider !== 'ollama' && !apiKey) {
			throw new Error('API key not set');
		}

		const openai = new OpenAI({
			apiKey: apiKey ?? 'ollama',
			baseURL: baseURL,
			defaultHeaders: {
				'anthropic-dangerous-direct-browser-access': 'true'
			}
		});

		const completion = await openai.chat.completions.create({
			model: model,
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
		console.error('Error in handleLlmRequest:', error);
		throw error;
	}
}
