<script>
	let { llmConfig = $bindable() } = $props();

	async function handleChangeProvider() {
		llmConfig.model = '';
	}
</script>

<label>
	<span>Provider</span>

	<select name="llm_base_url" bind:value={llmConfig.provider} onchange={handleChangeProvider}>
		<option value="" selected disabled>Choose provider</option>

		{#if llmConfig.hosting === 'cloud'}
			<option value="anthropic" disabled>Anthropic</option>
			<option value="google">Google</option>
			<option value="openai">OpenAI</option>
		{:else if llmConfig.hosting === 'local'}
			<option selected value="ollama">Ollama</option>
		{/if}
	</select>
</label>
