<script>
	import PricingCard from './PricingCard.svelte';
</script>

<section>
	<div class="pricing">
		<div class="description">
			<h2>Straightforward Pricing Options</h2>
			<p><strong>Special launch pricing</strong> available for a first 100 users!</p>
		</div>

		<div class="pricing-cards">

			<PricingCard
				title="Yearly License"
				price="$9"
				oldPrice="$29"
				period="year"
				description="69% discount for first 100 users"
				note="One payment for full year access."
			/>

			<PricingCard
				title="Lifetime License"
				price="$39"
				oldPrice="$69"
				description="51% discount for first 100 users"
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
		max-width: 48rem;
		margin: auto;

		@media (width > 768px) {
			grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
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
