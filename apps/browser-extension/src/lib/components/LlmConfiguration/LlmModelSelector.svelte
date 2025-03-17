<script>
	import cloudLlmModels from '$lib/config/cloud-llm-models';

	let {
		disabled = undefined,
		llmConfig = $bindable(),
		ollamaModels,
		onChangeModel = () => {}
	} = $props();
</script>

<label>
	<span>Model</span>

	<select
		{disabled}
		name="llm_model"
		bind:value={llmConfig.model}
		onchange={() => onChangeModel?.()}
	>
		<option value="" selected disabled>Choose model</option>
		{#if llmConfig.provider === 'ollama'}
			{#each ollamaModels as model}
				<option value={model.name}>{model.name}</option>
			{/each}
		{:else}
			{#each cloudLlmModels.filter((x) => x.provider === llmConfig.provider) as model}
				<option value={model.id}>{model.name}</option>
			{/each}
		{/if}
	</select>
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	select:disabled {
		opacity: 0.5;
	}
</style>
