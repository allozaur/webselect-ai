<script>
	import { Button } from '@webselect-ai/ui';
	import PricingCard from './PricingCard.svelte';
</script>

<section>
	<div class="pricing">
		<h2>Straightforward Pricing Options</h2>

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
				price="$39"
				oldPrice="$60"
				period="year"
				description="35% savings with annual commitment"
				note="One payment for full year access."
			/>

			<PricingCard
				title="Lifetime License"
				price="$59"
				oldPrice="$99"
				description="Launch Special: 40% discount for first 100 users"
				note="Permanent access to all features."
			/>
		</div>

		<div class="trial-info">
			<h2>Experience WebSelect.ai with our 30-day extended trial (special launch offer).</h2>
			<p>
				Test the extension across various websites and determine which plan best suits your needs.
			</p>

			<div class="cta">
				<Button>Start your free trial</Button>
				<span class="no-payment">No payment information required</span>
			</div>
		</div>
	</div>
</section>

<style>
	.pricing-cards {
		display: grid;
		gap: 2rem;

		@media (width > 768px) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		background: var(--bg-surface-1);
		padding: 2rem;
		border: 1px solid var(--color-border);
		border-radius: 1rem;
	}

	.strikethrough {
		opacity: 0.5;
		text-decoration: line-through;
	}

	.trial-info {
		display: grid;
		place-items: center;
		gap: 2rem;
		padding-block: 2rem;
		text-align: center;

		@media (width > 768px) {
			padding: 4rem;
		}

		h2,
		p {
			margin: 0;
		}

		.cta {
			display: grid;
			gap: 1rem;
			place-items: center;
			padding: 1rem;
		}
	}
</style>
