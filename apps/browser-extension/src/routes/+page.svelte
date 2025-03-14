<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let llmConfig = $state({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' });

	onMount(() => {
		chrome.storage.local.get('llm_config', async (result) => {
			llmConfig = result.llm_config ?? {
				apiKey: '',
				hosting: '',
				model: '',
				provider: ''
			};

			if (!llmConfig.model) {
				goto('/settings');
			}
		});
	});
</script>

<main>
	<h1>Select any content on the page and start chatting with AI!</h1>
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
