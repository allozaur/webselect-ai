import handleSignInCallback from './handle-signin-callback';
import handleLlmRequest from './handle-llm-request';

handleLlmRequest();
handleSignInCallback();

chrome.runtime.onMessage.addListener((message, sender) => {
	if (message.action === 'openSideWebSelectPanel' && sender.tab) {
		chrome.sidePanel.open({ windowId: sender.tab.windowId });
	}
});

// chrome.sidePanel
// 	.setPanelBehavior({ openPanelOnActionClick: true })
// 	.catch((error) => console.error(error));
