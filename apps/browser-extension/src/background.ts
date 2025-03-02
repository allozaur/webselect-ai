import formatWithLlm from '$lib/format-with-llm';

chrome.runtime.onMessage.addListener(
	(request: FormatTextRequest, sender: chrome.runtime.MessageSender) => {
		if (request.action === 'formatText') {
			formatWithLlm(request.systemPrompt, request.userPrompt, sender).catch((error) => {
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
