<script lang="ts">
	import { Button } from '@webcursor/ui';
	import { onMount } from 'svelte';

	let llmConfig = $state({ apiKey: '', provider: '', model: '' });
	let showApiKey = $state(false);
	let ollamaModels = $state<{ name: string }[]>([]);

	onMount(() => {
		chrome.storage.local.get('llm_config', (result) => {
			llmConfig = result.llm_config ?? { provider: '', model: '' };
			if (llmConfig.provider === 'ollama') {
				fetchOllamaModels();
			}
		});
	});

	async function fetchOllamaModels() {
		try {
			const response = await fetch('http://localhost:11434/api/tags');
			const data = await response.json();
			ollamaModels = data.models;
		} catch (error) {
			console.error('Failed to fetch Ollama models:', error);
			ollamaModels = [];
		}
	}

	function handleChangeValue() {
		chrome.storage.local.set({
			llm_config: llmConfig
		});
	}

	async function handleChangeProvider() {
		handleChangeValue();
		llmConfig.model = '';
		if (llmConfig.provider === 'ollama') {
			await fetchOllamaModels();
		}
	}
</script>

<div class="llm-choice">
	<label>
		<span>Provider</span>

		<select name="llm_base_url" bind:value={llmConfig.provider} onchange={handleChangeProvider}>
			<option value="" selected disabled>Choose provider</option>
			<option value="ollama">Ollama (local)</option>
			<!-- <option value="anthropic">Anthropic</option> -->
			<option value="google">Google</option>
			<option value="openai">OpenAI</option>
		</select>
	</label>

	{#if llmConfig.provider !== 'ollama'}
		<label>
			<span>API Key</span>

			<input
				name="llm_api_key"
				oninput={handleChangeValue}
				placeholder="e.g. 1234567890abcdef"
				type={showApiKey ? 'text' : 'password'}
				bind:value={llmConfig.apiKey}
			/>

			<Button type="button" onclick={() => (showApiKey = !showApiKey)}>
				{showApiKey ? 'Hide' : 'Show'}
			</Button>
		</label>
	{/if}

	<label>
		<span>Model</span>

		{#if llmConfig.provider === 'ollama'}
			<select name="llm_model" bind:value={llmConfig.model} onchange={handleChangeValue}>
				<option value="" selected disabled>Choose model</option>
				{#each ollamaModels as model}
					<option value={model.name}>{model.name}</option>
				{/each}
			</select>
		{:else}
			<select name="llm_model" bind:value={llmConfig.model} onchange={handleChangeValue}>
				<option value="" selected disabled>Choose model</option>
				{#if llmConfig.provider === 'google'}
					<option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
					<option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
					<option value="gemini-2.0-flash-lite">Gemini 2.0 Flash-Lite</option>
					<option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
					<option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro (Experimental)</option>
					<!-- {:else if llmConfig.provider === 'anthropic'}
					<option value="claude-3-7-sonnet-latest">Claude 3.7 Sonnet</option>
					<option value="claude-3-5-sonnet-latest">Claude 3.5 Sonnet</option>
					<option value="claude-3-5-haiku-latest">Claude 3.5 Haiku</option> -->
				{:else if llmConfig.provider === 'openai'}
					<option value="gpt-4o">GPT-4o</option>
					<option value="gpt-4o-mini">GPT-4o mini</option>
					<option value="gpt-4-turbo">GPT-4 Turbo</option>
				{/if}
			</select>
		{/if}
	</label>
</div>

<style>
	.llm-choice {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.5rem;
	}
</style>
