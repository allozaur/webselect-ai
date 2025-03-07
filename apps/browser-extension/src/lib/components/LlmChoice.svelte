<script lang="ts">
	import { onMount } from 'svelte';
	let llmConfig = $state({ apiKey: '', provider: '', model: '' });

	onMount(() => {
		chrome.storage.local.get('llm_config', (result) => {
			llmConfig = result.llm_config ?? { provider: '', model: '' };
		});
	});

	function handleChangeValue() {
		chrome.storage.local.set({
			llm_config: llmConfig
		});
	}

	function handleChangeProvider() {
		handleChangeValue();
		llmConfig.model = '';
	}
</script>

<div class="llm-choice">
	<label>
		<span>Provider</span>

		<select name="llm_base_url" bind:value={llmConfig.provider} onchange={handleChangeProvider}>
			<option value="" selected disabled>Choose provider</option>
			<option value="ollama">Ollama (local)</option>
			<option value="anthropic">Anthropic</option>
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
				type="password"
				bind:value={llmConfig.apiKey}
			/>
		</label>
	{/if}

	<label>
		<span>Model</span>

		{#if llmConfig.provider === 'ollama'}
			<input
				type="text"
				name="llm_model"
				placeholder="e.g. llama3.3, qwen2.5, phi4"
				oninput={handleChangeValue}
				bind:value={llmConfig.model}
			/>
		{:else}
			<select name="llm_model" bind:value={llmConfig.model} onchange={handleChangeValue}>
				<option value="" selected disabled>Choose model</option>
				{#if llmConfig.provider === 'anthropic'}
					<option value="claude-3-7-sonnet-latest">Claude 3.7 Sonnet</option>
					<option value="claude-3-5-sonnet-latest">Claude 3.5 Sonnet</option>
					<option value="claude-3-5-haiku-latest">Claude 3.5 Haiku</option>
				{:else if llmConfig.provider === 'google'}
					<option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
					<option value="gemini-2.0-pro">Gemini 2.0 Pro</option>
					<option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
					<option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
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
