import { supabase } from '$lib/supabase';

export default function handleSignInCallback() {
	chrome.runtime.onMessage.addListener(async (message, sender) => {
		if (message.type === 'AUTH_SUCCESS') {
			const { originTabId } = await chrome.storage.local.get('originTabId');

			if (originTabId) {
				// Focus the original tab
				await chrome.tabs.update(originTabId, { active: true });

				// Close the auth tab
				if (sender.tab?.id) {
					await chrome.tabs.remove(sender.tab.id);
				}

				// Update storage to trigger content script
				const { data } = await supabase.auth.getSession();
				await chrome.storage.local.set({
					session: data.session,
					isAuthenticated: !!data.session
				});

				// Reopen the popup
				await chrome.action.openPopup();

				// Clean up
				await chrome.storage.local.remove('originTabId');
			}
		}
	});
}
