<script>
	import Header from '$lib/components/Header/Header.svelte';
	import '@webselect-ai/ui/styles/index.css';

	let { children } = $props();
</script>

<Header />

{@render children()}

<style>
	:global(body) {
		background: var(--bg-body);
		box-sizing: border-box;
		color: var(--c-text);
		color-scheme: light dark;
		font-family: var(--ff);
	}
</style>
