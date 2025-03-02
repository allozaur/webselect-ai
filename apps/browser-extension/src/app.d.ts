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
		action: 'streamUpdate' | 'streamComplete' | 'streamError' | 'formatText';
		systemPrompt?: string;
		userPrompt?: string;
		chunk?: string;
		error?: string;
	}

	interface FormatTextRequest {
		action: 'formatText';
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
