<script>
	import LlmChoice from '$lib/components/LlmChoice.svelte';
</script>

<main>
	<h1>WebCursor</h1>

	<LlmChoice />
</main>

<style>
	main {
		display: grid;
		gap: 1.5rem;
		min-width: 36rem;
		padding: 1rem;
	}

	h1 {
		margin: 0;
	}
</style>
