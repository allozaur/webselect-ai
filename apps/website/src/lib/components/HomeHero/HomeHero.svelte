<script>
	import HomeHeroContent from './HomeHeroContent.svx';
</script>

<div class="home-hero">
	<div class="content">
		<HomeHeroContent />
	</div>
</div>

<style>
	.home-hero {
		display: flex;
		justify-content: center;
	}

	.content {
		padding: 2rem;
		display: grid;
		place-items: center;
		text-align: center;
		gap: 1.5rem;
		max-width: 48rem;
	}
</style>
