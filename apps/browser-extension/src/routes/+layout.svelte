<script>
	import '@webcursor/ui/styles/index.css';

	let { children } = $props();
</script>

<div class="webcursor-popup">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.webcursor-popup {
		background-color: var(--bg-body);
		box-sizing: border-box;
		color: var(--c-text);
		font-family:
			'Space Grotesk',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			'Helvetica Neue',
			Arial,
			sans-serif;
		font-optical-sizing: auto;
		letter-spacing: -0.01em;
		margin: 0;
		padding: 0;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
	}
</style>
