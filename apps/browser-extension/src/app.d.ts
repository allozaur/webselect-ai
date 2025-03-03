declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Chrome extension message types
	interface ChromeMessage {
		action: 'streamUpdate' | 'streamComplete' | 'streamError' | 'sendPrompt';
		systemPrompt?: string;
		userPrompt?: string;
		chunk?: string;
		error?: string;
	}

	interface SendPromptRequest {
		action: 'sendPrompt';
		systemPrompt: string;
		userPrompt: string;
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
