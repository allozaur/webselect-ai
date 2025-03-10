import handleLlmRequest from './handle-llm-request';

chrome.runtime.onMessage.addListener(
	(request: SendPromptRequest, sender: chrome.runtime.MessageSender) => {
		if (request.action === 'sendPrompt') {
			handleLlmRequest(request.messages, sender);
			return true; // Keep the message channel open
		}
		return false;
	}
);
