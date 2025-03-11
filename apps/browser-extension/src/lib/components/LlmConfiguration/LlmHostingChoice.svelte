<script>
	let { llmConfig = $bindable() } = $props();

	async function handleChangeHosting() {
		llmConfig.model = '';

		if (llmConfig.hosting === 'local') {
			llmConfig.provider = 'ollama';
		} else {
			llmConfig.provider = '';
		}
	}
</script>

<fieldset class="hosting">
	<legend>Hosting</legend>

	<label>
		<input
			type="radio"
			name="llm_hosting"
			value="local"
			bind:group={llmConfig.hosting}
			onchange={handleChangeHosting}
		/>

		<span>Local</span>
	</label>

	<label>
		<input
			type="radio"
			name="llm_hosting"
			value="cloud"
			bind:group={llmConfig.hosting}
			onchange={handleChangeHosting}
		/>

		<span>Cloud</span>
	</label>
</fieldset>

<style>
	.hosting {
		display: flex;
		gap: 1rem;

		label {
			display: inline-flex;
			gap: 0.5rem;
		}
	}
</style>
