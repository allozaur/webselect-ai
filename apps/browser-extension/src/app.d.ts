declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Chrome extension message types

	interface DownloadStatus {
		status: string;
		digest?: string;
		total?: number;
		completed?: number;
	}

	interface LlmMessage {
		role: 'assistant' | 'system' | 'user';
		content: string;
	}

	interface ModelInfo {
		license: string;
		modelfile: string;
		parameters: string;
		template: string;
		size: number;
		digest: string;
	}

	interface ChromeMessage {
		action: 'streamUpdate' | 'streamComplete' | 'streamError' | 'streamStart' | 'sendPrompt';
		messages: Message[];
		chunk?: string;
		error?: string;
	}

	interface SendPromptRequest {
		action: 'sendPrompt';
		systemPrompt: string;
		userPrompt: string;
		messages: Message[];
	}

	interface OpenAiMessage {
		role: 'system' | 'user';
		content: string;
	}

	interface OpenAIRequest {
		model: string;
		messages: OpenAiMessage[];
		stream: boolean;
	}

	interface StreamMessage {
		action: 'streamUpdate' | 'streamComplete' | 'streamError';
		chunk?: string;
		error?: string;
	}
}

export {};
