<script>
	import ContentTypeChoice from '$lib/components/ContentTypeChoice.svelte';
	import LlmChoice from '$lib/components/LlmChoice.svelte';
	import { Button } from '@webcursor/ui';
</script>

<main>
	<h1>WebCursor</h1>

	<form>
		<LlmChoice />

		<ContentTypeChoice />

		<Button type="submit">Save settings</Button>
	</form>
</main>

<style>
	main {
		min-width: 36rem;
		padding: 1rem;
	}

	main,
	form {
		display: grid;
		gap: 1.5rem;
	}

	h1 {
		margin: 0;
	}
</style>
