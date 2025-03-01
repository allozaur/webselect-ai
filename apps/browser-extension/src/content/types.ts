export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface FormatTextMessage {
	action: 'formatText';
	text: string;
}

export interface StreamUpdateMessage {
	action: 'streamUpdate';
	chunk: string;
}

export interface StreamCompleteMessage {
	action: 'streamComplete';
}

export interface StreamErrorMessage {
	action: 'streamError';
	error?: string;
}

export type ChromeMessage =
	| FormatTextMessage
	| StreamUpdateMessage
	| StreamCompleteMessage
	| StreamErrorMessage;
