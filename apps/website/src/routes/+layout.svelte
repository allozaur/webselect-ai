<script>
	import Footer from '$lib/components/Footer/Footer.svelte';
	import Header from '$lib/components/Header/Header.svelte';
	import '@webselect-ai/ui/styles/index.css';

	let { children } = $props();
</script>

<Header />

{@render children()}

<Footer />

<style>
	:global(body) {
		background: var(--bg-body);
		box-sizing: border-box;
		color: var(--c-text);
		color-scheme: light dark;
		font-family: var(--ff);
		font-optical-sizing: auto;
		letter-spacing: -0.01em;
		margin: 0;
		padding: 0;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
	}
</style>
