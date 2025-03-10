<script lang="ts">
	import { Button } from '@webcursor/ui';
	import LlmConfiguration from '$lib/components/LlmConfiguration/LlmConfiguration.svelte';
	import SelectionConfiguration from '$lib/components/SelectionConfiguration/SelectionConfiguration.svelte';

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		window.close();
	}
</script>

<main>
	<h1>Settings</h1>

	<form onsubmit={handleSubmit}>
		<LlmConfiguration />

		<SelectionConfiguration />

		<Button type="submit">Save settings</Button>
	</form>
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

	form {
		display: grid;
		gap: 1.5rem;
	}
</style>
