<script>
	import CtaBannerContent from './CtaBannerContent.svx';
</script>

<section>
	<CtaBannerContent />
</section>

<style>
	section {
		display: grid;
		place-items: center;
		text-align: center;
		gap: 2rem;
		background: var(--bg-surface-2);
		padding: 4rem;
	}

	section :global(:is(h2, p)) {
		margin: 0;
	}
</style>
