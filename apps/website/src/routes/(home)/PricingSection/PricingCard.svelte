<script lang="ts">
	import { Button } from '@webselect-ai/ui';

	interface Props {
		description: string;
		oldPrice?: string;
		note: string;
		period?: string;
		price: string;
		title: string;
	}

	let { description, oldPrice, note, period, price, title }: Props = $props();
</script>

<div class="pricing-card">
	<h3 class="title">{title}</h3>

	<div class="prices">
		<div class="prices-values">
			<span class="price">{price}</span>
			<span class="price old-price"> {oldPrice}</span>

			{#if period}
				<span class="period">/ {period}</span>
			{/if}
		</div>
		<span class="trial-info">after a free 7 day trial</span>
	</div>

	<p class="description">{description}</p>

	<div class="cta">
		<Button
			href="https://chromewebstore.google.com/detail/webselect/ggfejamdpmmmicibglgeldllgihkciie"
			target="_blank"
		>
			Try 7 days for free
		</Button>

		<span class="note">{note}</span>
	</div>
</div>

<style>
	.pricing-card {
		background: var(--bg-surface-1);
		padding: 2.5rem;
		border: 1px solid var(--color-border);
		border-radius: 1rem;
		display: grid;
		gap: 1rem;
		text-align: center;
	}

	.title {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1.25rem;
	}

	.description {
		font-size: 0.875rem;
		max-width: 16rem;
		margin: auto;
	}

	.prices-values {
		justify-content: center;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.price {
		font-size: 1.625rem;

		&:not(.old-price) {
			font-weight: 700;
		}
	}

	.old-price {
		opacity: 0.5;
		text-decoration: line-through;
	}

	h3,
	p {
		margin: 0;
	}

	.cta {
		display: grid;
		gap: 0.5rem;
		place-items: center;
		text-align: center;
		margin-top: 1rem;

		span {
			font-size: 0.875rem;
		}
	}

	.trial-info {
		display: inline-block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--c-text-light);
		padding-block: 0.5rem;
		width: 100%;
	}
</style>
