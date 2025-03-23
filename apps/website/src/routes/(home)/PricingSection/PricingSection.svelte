<script>
	import { Button } from '@webselect-ai/ui';
</script>

<section>
	<div class="pricing">
		<h2>Straightforward Pricing Options</h2>

		<div class="pricing-cards">
			<div class="card">
				<h3>Monthly Subscription</h3>
				<div class="price">$5<span>/month</span></div>
				<p>Flexible monthly billing</p>
				<Button>Try 7 days for free</Button>
				<p class="note">Cancel anytime.</p>
			</div>

			<div class="card">
				<h3>Annual Subscription</h3>
				<div class="price">$39 <span class="strikethrough">$60</span><span>/year</span></div>
				<p>35% savings with annual commitment</p>
				<Button>Try 7 days for free</Button>
				<p class="note">One payment for full year access.</p>
			</div>

			<div class="card">
				<h3>Lifetime License</h3>
				<div class="price">$59 <span class="strikethrough">$99</span></div>
				<p>Launch Special: 40% discount for first 100 users</p>
				<Button>Try 7 days for free</Button>
				<p class="note">Permanent access to all features.</p>
			</div>
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
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
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
		padding: 4rem;

		h2,
		p {
			margin: 0;
		}

		.cta {
			display: grid;
			gap: 1rem;
			place-items: center;
		}
	}
</style>
