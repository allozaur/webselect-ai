<script>
	import cloudLlmModels from '$lib/config/cloud-llm-models';

	const cloudLlmProviders = [...new Set(cloudLlmModels.map(({ provider }) => provider))].map(
		(provider) => ({
			provider,
			providerName:
				cloudLlmModels.find((model) => model.provider === provider)?.providerName || provider
		})
	);

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
			{#each cloudLlmProviders as { provider, providerName }}
				<option value={provider}>{providerName}</option>
			{/each}
		{:else if llmConfig.hosting === 'local'}
			<option selected value="ollama">Ollama</option>
		{/if}
	</select>
</label>
