<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import customer from '$lib/stores/stripe-customer';
	import isLoading from '$lib/stores/is-loading';
	import SelectLicense from '$lib/components/SelectLicense.svelte';

	let llmConfig = $state({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' });

	onMount(() => {
		chrome.storage.local.get('llm_config', async (result) => {
			llmConfig = result.llm_config ?? {
				apiKey: '',
				hosting: '',
				model: '',
				provider: ''
			};

			if (!llmConfig.model) {
				goto('/settings');
			}
		});
	});
</script>

<main>
	{#if $isLoading}
		<p>Loading...</p>
	{:else if $customer?.customer}
		{#if $customer?.activeSubscription?.isActive}
			<h1>Select any content on the page and start chatting with AI!</h1>
		{:else}
			<SelectLicense />
		{/if}
	{:else}
		<p>No customer found</p>
	{/if}
</main>

<style>
	main {
		padding: 1rem;
		display: grid;
		gap: 1.5rem;
	}

	h1 {
		margin: 0;
	}
</style>
