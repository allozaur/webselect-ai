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
		padding: 2rem;

		@media (width > 768px) {
			padding: 4rem;
		}
	}

	section :global(h2) {
		font-size: 1.25rem;
		line-height: 1.5;

		@media (width > 768px) {
			font-size: 2rem;
		}
	}

	section :global(:is(h2, p)) {
		margin: 0;
	}
</style>
