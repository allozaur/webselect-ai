<script>
	import { Button } from '@webselect-ai/ui';
	import PricingCard from './PricingCard.svelte';
</script>

<section>
	<div class="pricing">
		<div class="description">
			<h2>Straightforward Pricing Options</h2>
			<p><strong>Special launch pricing</strong> available for a limited time!</p>
		</div>

		<div class="pricing-cards">
			<PricingCard
				title="Monthly Subscription"
				price="$5"
				period="month"
				description="Flexible monthly billing"
				note="Cancel anytime."
			/>

			<PricingCard
				title="Annual Subscription"
				price="$19"
				oldPrice="$49"
				period="year"
				description="Save 61% with special offer"
				note="One payment for full year access."
			/>

			<PricingCard
				title="Lifetime License"
				price="$59"
				oldPrice="$129"
				description="Launch Special: 40% discount for first 100 users"
				note="Permanent access to all features."
			/>
		</div>
	</div>
</section>

<style>
	.pricing {
		display: grid;
		gap: 2rem;
	}

	.pricing-cards {
		display: grid;
		gap: 2rem;

		@media (width > 768px) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.description {
		display: grid;
		gap: 1rem;
		place-content: center;
		max-width: 32rem;
		margin: auto;
		padding-block: 2rem;
		text-align: center;

		h2,
		p {
			margin: 0;
		}

		strong {
			color: var(--hex-primary);
			background: var(--bg-highlight);
			padding-inline: 0.125rem;
		}
	}
</style>
