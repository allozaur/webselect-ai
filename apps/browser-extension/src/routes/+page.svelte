<script>
	import { goto } from '$app/navigation';
	import { Button } from '@webselect-ai/ui';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/settings');
	});
</script>

<main>
	<h1>WebSelect</h1>

	<nav>
		<Button href="/settings">Settings</Button>
	</nav>
</main>

<style>
	main {
		padding: 1rem;
		display: grid;
		gap: 1.5rem;
	}

	h1 {
		margin: 0;
	}
</style>
