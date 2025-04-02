<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import customer from '$lib/stores/stripe-customer';
	import { getStripeCheckoutURL } from '$lib/stripe';
	import { stripeProducts } from '@webselect-ai/config';
	import { Button, PricingCard } from '@webselect-ai/ui';

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

<div class="select-license">
	<h1>Select a license to get started</h1>

	{#each stripeProducts as product}
		<PricingCard
			title={product.name}
			description={product.description}
			price={product.price}
			discountPrice={product.discountPrice}
			period={product.period}
			note={product.note}
		>
			{#snippet ctaButton()}
				<Button onclick={() => handleSubscriptionClick(product.id, product.paymentType)}>
					Try 7 days for free
				</Button>
			{/snippet}
		</PricingCard>
	{/each}
</div>

<style>
	.select-license {
		display: grid;
		gap: 2rem;
		max-width: 80rem;
		margin: auto;
		padding: 2rem;
	}

	h1 {
		text-align: center;
		font-size: 1.5rem;
		line-height: 1.5;
	}
</style>
