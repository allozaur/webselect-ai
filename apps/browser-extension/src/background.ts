import handleLlmRequest from '$lib/handle-llm-request';

chrome.runtime.onMessage.addListener(
	(request: SendPromptRequest, sender: chrome.runtime.MessageSender) => {
		if (request.action === 'sendPrompt') {
			handleLlmRequest(request.systemPrompt, request.userPrompt, sender)
				.then(() => {
					chrome.tabs.sendMessage(sender.tab!.id!, {
						action: 'streamComplete'
					} as StreamMessage);
				})
				.catch((error) => {
					chrome.tabs.sendMessage(sender.tab!.id!, {
						action: 'streamError',
						error: error.message
					} as StreamMessage);
				});

			return true;
		}

		return false;
	}
);
