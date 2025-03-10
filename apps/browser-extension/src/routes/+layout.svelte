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
	:global(body) {
		background: var(--bg-body);
		margin: 0;
		padding: 0;
		min-width: 36rem;
	}
	.webcursor-popup {
		color-scheme: light dark;
		background-color: var(--bg-body);
		box-sizing: border-box;
		color: var(--c-text);
		font-family: var(--ff);
		font-optical-sizing: auto;
		letter-spacing: -0.01em;
		margin: 0;
		padding: 0;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
	}
</style>
