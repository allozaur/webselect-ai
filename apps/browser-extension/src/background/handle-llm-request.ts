import OpenAI from 'openai';

let baseURL: string;

export default async function handleLlmRequest(): Promise<void> {
	chrome.runtime.onMessage.addListener(
		async (request: SendPromptRequest, sender: chrome.runtime.MessageSender) => {
			if (request.action === 'sendPrompt') {
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
								reject(new Error('LLM configuration not set'));
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
						dangerouslyAllowBrowser: true,
						defaultHeaders: {
							'anthropic-dangerous-direct-browser-access': 'true'
						}
					});

					const completion = await openai.chat.completions.create({
						max_tokens: provider === 'anthropic' ? 8192 : undefined,
						messages: request.messages,
						model: model,
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

					chrome.tabs.sendMessage(sender.tab!.id!, {
						action: 'streamComplete'
					});
				} catch (error) {
					console.error('Error in handleLlmRequest:', error);

					chrome.tabs.sendMessage(sender.tab!.id!, {
						action: 'streamError',
						error: error instanceof Error ? error.message : String(error)
					} as StreamMessage);
				}

				return true;
			}

			return false;
		}
	);
}
