<script>
	let { handleModelSelect, ollamaModels, llmConfig = $bindable(), showDownloadModel } = $props();
</script>

<label>
	<span>Model</span>

	<select
		disabled={showDownloadModel}
		name="llm_model"
		bind:value={llmConfig.model}
		onchange={handleModelSelect}
	>
		<option value="" selected disabled>Choose model</option>
		``
		{#if llmConfig.provider === 'ollama'}
			{#each ollamaModels as model}
				<option value={model.name}>{model.name}</option>
			{/each}
		{:else if llmConfig.provider === 'google'}
			<option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
			<option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
			<option value="gemini-2.0-flash-lite">Gemini 2.0 Flash-Lite</option>
			<option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
			<option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro (Experimental)</option>
		{:else if llmConfig.provider === 'anthropic'}
			<option value="claude-3-7-sonnet-latest">Claude 3.7 Sonnet</option>
			<option value="claude-3-5-sonnet-latest">Claude 3.5 Sonnet</option>
			<option value="claude-3-5-haiku-latest">Claude 3.5 Haiku</option>
		{:else if llmConfig.provider === 'openai'}
			<option value="gpt-4o">GPT-4o</option>
			<option value="gpt-4o-mini">GPT-4o mini</option>
			<option value="gpt-4-turbo">GPT-4 Turbo</option>
		{/if}
	</select>
</label>
