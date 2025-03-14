import handleSignInCallback from './handle-signin-callback';
import handleLlmRequest from './handle-llm-request';

handleLlmRequest();
handleSignInCallback();

chrome.runtime.onMessage.addListener((request) => {
	if (request.action === 'openWebSelectPopup') {
		chrome.action.openPopup();
	}
});
