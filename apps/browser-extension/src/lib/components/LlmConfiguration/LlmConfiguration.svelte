<script lang="ts">
	import LlmModelSelector from './LlmModelSelector.svelte';
	import { onMount } from 'svelte';
	import OllamaControlPanel from './OllamaControlPanel.svelte';
	import LlmHostingChoice from './LlmHostingChoice.svelte';
	import LlmProviderChoice from './LlmProviderChoice.svelte';
	import LlmApiKeySetting from './LlmApiKeySetting.svelte';

	let ollamaModels = $state<{ name: string }[]>([]);
	let { llmConfig = $bindable({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' }) } =
		$props();

	onMount(async () => {
		chrome.storage.local.get('llm_config', async (result) => {
			llmConfig = result.llm_config ?? {
				apiKey: '',
				hosting: 'local',
				model: '',
				provider: 'ollama'
			};
		});
	});
</script>

<fieldset class="llm-configuration">
	<legend>LLM Configuration</legend>

	<LlmHostingChoice bind:llmConfig />

	<LlmProviderChoice bind:llmConfig />

	{#if ollamaModels.length > 0 || llmConfig.hosting === 'cloud'}
		<LlmModelSelector {ollamaModels} bind:llmConfig />
	{/if}

	{#if llmConfig.hosting === 'cloud'}
		<LlmApiKeySetting bind:llmConfig />
	{/if}

	{#if llmConfig.hosting === 'local'}
		<OllamaControlPanel {llmConfig} bind:ollamaModels />
	{/if}
</fieldset>

<style>
	.llm-configuration {
		display: grid;
		gap: 1rem;
	}

	.llm-configuration :global(label) {
		display: grid;
		gap: 0.5rem;
	}

	.llm-configuration :global(input) {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
