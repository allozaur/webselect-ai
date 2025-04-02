<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import customer from '$lib/stores/stripe-customer';
	import isLoading from '$lib/stores/is-loading';
	import { getStripeCheckoutURL } from '$lib/stripe';
	import { PRICE_IDS } from '$lib/config/price-ids';
	import { formatDateAndTimeToString, daysLeftToDate } from '@webselect-ai/utils';

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

	const handleSubscriptionClick = async (
		productId: string,
		paymentType: 'subscription' | 'one-time'
	) => {
		if (!$customer?.customer) {
			return;
		}

		try {
			await getStripeCheckoutURL($customer.customer.id, productId, paymentType);
		} catch (error) {
			// TODO: Handle error
			console.error(error);
		}
	};
</script>

<main>
	{#if $isLoading}
		<!-- TODO: Put some nice animation here? -->
		<p>Loading...</p>
	{:else if $customer?.customer}
		{#if $customer?.activeSubscription?.isActive}
			<h1>Select any content on the page and start chatting with AI!</h1>
			<p>
				Subscription type: {$customer?.activeSubscription?.subscriptionType}
				{$customer?.activeSubscription?.isTrial ? `(Trial)` : ``}
			</p>
			{#if $customer?.activeSubscription?.period}
				{#if $customer?.activeSubscription?.isTrial}
					<p>Trial ends on {formatDateAndTimeToString($customer.activeSubscription.period.end)}</p>
					<p>Days left: {daysLeftToDate($customer.activeSubscription.period.end)}</p>
				{:else}
					<p>
						Subscription ends on {formatDateAndTimeToString(
							$customer.activeSubscription.period.end
						)}
					</p>
					<p>Days left: {daysLeftToDate($customer.activeSubscription.period.end)}</p>
				{/if}
			{/if}
			{#if $customer?.activeSubscription?.url}
				<a href={$customer?.activeSubscription?.url} target="_blank">Manage subscription</a>
			{/if}
		{:else}
			<h1>Select a subscription or lifetime license to get started</h1>
			{#each PRICE_IDS as product}
				<ul>
					<li>
						<button onclick={() => handleSubscriptionClick(product.id, product.paymentType)}>
							{product.name}
						</button>
					</li>
				</ul>
			{/each}
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
