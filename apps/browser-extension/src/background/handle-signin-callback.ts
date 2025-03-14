import { supabase } from '$lib/supabase';

export default async function handleSignInCallback() {
	chrome.runtime.onMessage.addListener((request) => {
		if (request.action === 'openWebSelectPopup') {
			chrome.action.openPopup();
		}
	});

	chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
		const { data } = supabase.auth.onAuthStateChange(async (_event) => {
			setTimeout(
				async () => {
					if (changeInfo.url?.startsWith('chrome-extension://')) {
						if (_event === 'INITIAL_SESSION') {
							if (typeof tabId === 'number') {
								chrome.tabs.get(tabId, async (tab) => {
									if (chrome.runtime.lastError || !tab) {
										console.log('Tab does not exist.');
										return;
									}

									await chrome.tabs.remove(tabId);
									await chrome.action
										.openPopup
										// todo - add window id
										();
								});
							}
						}

						data.subscription.unsubscribe();
					}
				},
				Number(import.meta.env.VITE_AUTH_STATE_SYNC_DELAY_MS)
			);
		});
	});
}
