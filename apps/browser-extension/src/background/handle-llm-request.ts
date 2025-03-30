import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

let baseURL: string;

export default async function handleLlmRequest(): Promise<void> {
	chrome.runtime.onMessage.addListener(
		(request: SendPromptRequest, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
			if (request.action === 'sendPrompt') {
				handlePrompt(request, sender, sendResponse).catch((error) => {
					console.error('Error in handleLlmRequest:', error);
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true; // Keep the message channel open for async response
			}
			return false;
		}
	);
}

async function handlePrompt(
	request: SendPromptRequest,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response: any) => void
) {
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
			baseURL = 'http://localhost:11434';

			const ollamaRequest: OllamaChatRequest = {
				model: model.replace('ollama-', ''),
				messages: request.messages.map((msg) => ({
					role: msg.role,
					content: msg.content
				})),
				stream: true,
				options: {
					num_ctx: 128000
				}
			};

			const response = await fetch(`${baseURL}/api/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(ollamaRequest)
			});

			if (!response.ok) {
				throw new Error(`Ollama API error: ${response.statusText}`);
			}

			const reader = response.body?.getReader();
			if (!reader) throw new Error('No response body');

			chrome.tabs.sendMessage(sender.tab!.id!, {
				action: 'streamStart'
			});

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = new TextDecoder().decode(value);
				const lines = chunk.split('\n').filter(Boolean);

				for (const line of lines) {
					const data = JSON.parse(line) as OllamaChatResponse;
					if (data.message?.content) {
						chrome.tabs.sendMessage(sender.tab!.id!, {
							action: 'streamUpdate',
							chunk: data.message.content
						} as StreamMessage);
					}
				}
			}

			chrome.tabs.sendMessage(sender.tab!.id!, {
				action: 'streamComplete'
			});
		} else if (provider === 'anthropic') {
			const anthropic = new Anthropic({
				apiKey: apiKey,
				dangerouslyAllowBrowser: true
			});

			// Extract system message if present
			const systemMessage = request.messages.find((msg) => msg.role === 'system');
			const nonSystemMessages = request.messages.filter((msg) => msg.role !== 'system');

			const stream = await anthropic.messages.create({
				model: model,
				max_tokens: 8192,
				system: systemMessage?.content,
				messages: nonSystemMessages.map((msg) => ({
					role: msg.role as 'user' | 'assistant',
					content: msg.content
				})),
				stream: true
			});

			chrome.tabs.sendMessage(sender.tab!.id!, {
				action: 'streamStart'
			});

			for await (const messageStreamEvent of stream) {
				if (messageStreamEvent.type === 'content_block_delta') {
					chrome.tabs.sendMessage(sender.tab!.id!, {
						action: 'streamUpdate',
						chunk: messageStreamEvent.delta.text
					} as StreamMessage);
				}
			}

			chrome.tabs.sendMessage(sender.tab!.id!, {
				action: 'streamComplete'
			});
		} else {
			baseURL =
				provider === 'google'
					? import.meta.env.VITE_GOOGLE_AI_STUDIO_API_URL
					: provider === 'openai'
						? import.meta.env.VITE_OPENAI_API_URL
						: import.meta.env.VITE_ANTHROPIC_API_URL;

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
		}
	} catch (error) {
		console.error('Error in handlePrompt:', error);
		chrome.tabs.sendMessage(sender.tab!.id!, {
			action: 'streamError',
			error: error instanceof Error ? error.message : String(error)
		} as StreamMessage);
		sendResponse({ error: error instanceof Error ? error.message : String(error) });
	}
}
