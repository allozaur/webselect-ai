<script lang="ts">
	import '@webselect-ai/ui/styles/index.css';
	import AuthBox from '$lib/components/AuthBox.svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import WebSelectLogo from '$lib/components/WebSelectLogo.svelte';
	import { Button } from '@webselect-ai/ui';
	import { page } from '$app/state';
	import { getStripeCustomer } from '$lib/stripe';
	import customer from '$lib/stores/stripe-customer';

	let { children } = $props();

	let isAuthenticated = $state(false);
	let session: AuthSession | null = $state(null);

	onMount(async () => {
		const { data } = await supabase.auth.getSession();

		isAuthenticated = typeof data.session !== undefined && data.session !== null;
		session = data.session;

		chrome.storage.local.set({ session, isAuthenticated });

		if (isAuthenticated && chrome?.runtime?.id) {
			chrome.runtime.sendMessage({ type: 'AUTH_SUCCESS' });
		}

		supabase.auth.onAuthStateChange(async (_event, _session) => {
			chrome.storage.local.set({
				session: _session,
				isAuthenticated: typeof _session !== undefined && _session !== null
			});

			if (_session?.user?.id) {
				try {
					$customer = await getStripeCustomer(_session?.user?.email);
					console.log($customer);
				} catch (error) {
					// TODO: Handle error
					console.error(error);
				}
			}
		});

		if (!isAuthenticated) {
			goto('/');
		}
	});
</script>

<div class="webselect-popup">
	{#if !isAuthenticated}
		<AuthBox />
	{:else}
		<header>
			<WebSelectLogo --height="2.5rem" />

			{#if page.url.pathname === '/settings'}
				<Button kind="secondary" href="/">Close</Button>
			{:else}
				<Button kind="secondary" href="/settings">Settings</Button>
			{/if}
		</header>

		{@render children()}
	{/if}
</div>

<style>
	:global(body) {
		background: var(--bg-body);
		margin: 0;
		padding: 0;
		min-width: 36rem;
	}
	.webselect-popup {
		color-scheme: light dark;
		background-color: var(--bg-body);
		box-sizing: border-box;
		color: var(--c-text);
		font-family: var(--ff);
		font-optical-sizing: auto;
		letter-spacing: -0.01em;
		margin: 0;
		padding: 0;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
	}
</style>
