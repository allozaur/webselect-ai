import { browser } from '$app/environment';
import { page } from '$app/state';
import { supabase } from '$lib/supabase';
// import type { AuthSession } from '@supabase/supabase-js';

// async function updateAuthState(session: AuthSession | null) {
// 	await chrome.storage.local.set({
// 		session,
// 		isAuthenticated: typeof session !== undefined && session !== null
// 	});
// }

async function initializeExtensionAuth(provider: 'github' | 'google') {
	try {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				skipBrowserRedirect: true,
				redirectTo: `${page.url.origin}/index.html`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});

		if (error) throw error;

		if (!data.url) throw new Error('No auth URL generated');

		await chrome.tabs.create({ url: data.url });

		if (error) throw error;

		return null;
	} catch (error) {
		console.error('Error initializing extension auth:', error);

		return error;
	}
}

export async function signInWithGoogle() {
	try {
		if (browser && chrome?.runtime?.id) {
			const session = await initializeExtensionAuth('google');
			if (!session) throw new Error('Authentication failed');
			// await updateAuthState(session);
		} else {
			const {
				// data,
				error
			} = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: page.url.origin
				}
			});
			if (error) throw error;
			// await updateAuthState(data.session);
		}
	} catch (error) {
		console.error('Google auth error:', error);
		if (error instanceof Error) {
			alert(error.message);
		}
	}
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error('Sign out error:', error);
		if (error instanceof Error) {
			alert(error.message);
		}
	}

	await chrome.storage.local.remove(['session', 'isAuthenticated']);
}
