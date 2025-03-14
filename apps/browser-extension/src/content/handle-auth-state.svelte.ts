import type { AuthSession } from '@supabase/supabase-js';

let isAuthenticated = $state(false);
let session: AuthSession | null = $state(null);

export default function handleAuthState() {
	chrome.storage.local.get(['isAuthenticated', 'session'], (result) => {
		isAuthenticated = result.isAuthenticated ?? false;
		session = result.session;
	});

	chrome.storage.onChanged.addListener((changes) => {
		if (changes.isAuthenticated) {
			isAuthenticated = changes.isAuthenticated.newValue;
		}

		if (changes.session) {
			session = changes.session.newValue;
		}
	});

	return { isAuthenticated, session };
}
