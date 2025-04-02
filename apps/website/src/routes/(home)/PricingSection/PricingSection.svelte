<script>
	import { PricingCard } from '@webselect-ai/ui';
	import { stripeProducts } from '@webselect-ai/config';
</script>

<section>
	<div class="pricing">
		<div class="description">
			<h2>Straightforward Pricing Options</h2>
			<p><strong>Special launch pricing</strong> available for a first 100 users!</p>
		</div>

		<div class="pricing-cards">
			{#each stripeProducts as product}
				<PricingCard
					title={product.name}
					description={product.description}
					price={product.price}
					discountPrice={product.discountPrice}
					period={product.period}
					note={product.note}
				/>
			{/each}
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
