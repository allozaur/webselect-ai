<script>
	import HomeHero from './HomeHero/HomeHero.svelte';
	import CoreFeaturesSection from './CoreFeaturesSection/CoreFeaturesSection.svelte';
	import UseCasesSection from './UseCasesSection/UseCasesSection.svelte';
	import CtaBanner from './CtaBanner/CtaBanner.svelte';
	import PricingSection from './PricingSection/PricingSection.svelte';
	import FaqSection from './FaqSection/FaqSection.svelte';
</script>

<svelte:head>
	<title>WebSelect.ai</title>
</svelte:head>

<main>
	<HomeHero />

	<CoreFeaturesSection />

	<UseCasesSection />

	<CtaBanner />

	<PricingSection />

	<FaqSection />
</main>

<style>
	main {
		max-width: 80rem;
		display: grid;
		gap: 5rem;
		margin: auto;
		padding: 2rem;
	}
</style>
