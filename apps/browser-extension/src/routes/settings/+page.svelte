<script lang="ts">
	import { Button } from '@webselect-ai/ui';
	import LlmConfiguration from '$lib/components/LlmConfiguration/LlmConfiguration.svelte';
	import SelectionConfiguration from '$lib/components/SelectionConfiguration/SelectionConfiguration.svelte';

	let llmConfig = $state({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' });

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		chrome.storage.local.set({
			llm_config: llmConfig
		});

		window.close();
	}
</script>

<main>
	<h1>Settings</h1>

	<form onsubmit={handleSubmit}>
		<LlmConfiguration bind:llmConfig />

		<SelectionConfiguration />

		<div class="bottom">
			<Button type="submit">Save settings</Button>
		</div>
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

		.bottom {
			display: grid;
			position: sticky;
			bottom: 0;
			padding: 1rem 0;
			background: var(--bg-body);
		}
	}
</style>
