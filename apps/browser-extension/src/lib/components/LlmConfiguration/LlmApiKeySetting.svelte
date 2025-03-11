<script>
	let { llmConfig = $bindable() } = $props();
</script>

<label>
	<span>API Key</span>

	<span>
		Get your API key here:

		{#if llmConfig.provider === 'google'}
			<a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>
		{:else if llmConfig.provider === 'openai'}
			<a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>
		{/if}
	</span>

	<input
		name="llm_api_key"
		placeholder="e.g. 1234567890abcdef"
		type="password"
		bind:value={llmConfig.apiKey}
	/>
</label>
