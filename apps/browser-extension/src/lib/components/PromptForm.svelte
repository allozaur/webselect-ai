<script lang="ts">
	let { onSubmit, response = '' } = $props();

	let prompt = $state('');
	let isLoading = $state(false);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;
		onSubmit(prompt);
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(response);
	}

	// Reset loading when response changes
	$effect(() => {
		if (response) {
			isLoading = false;
		}
	});
</script>

<div class="prompt-form">
	<form onsubmit={handleSubmit}>
		<textarea bind:value={prompt} placeholder="Enter your formatting instructions..." rows="3"
		></textarea>
		<button type="submit" disabled={isLoading}>
			{isLoading ? 'Processing...' : 'Format Text'}
		</button>
	</form>

	{#if response}
		<div class="response">
			<div class="response-text">{response}</div>
			<button class="copy-button" onclick={copyToClipboard}> Copy to clipboard </button>
		</div>
	{/if}
</div>

<style global>
	.prompt-form {
		position: relative;
		background: white;
		padding: 12px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		width: 300px;
		z-index: 10000;
	}

	textarea {
		width: 100%;
		padding: 8px;
		margin-bottom: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}

	button {
		padding: 4px 8px;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
	}

	button:hover {
		background: #0056b3;
	}

	button:disabled {
		background: #cccccc;
		cursor: not-allowed;
	}

	.response {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #eee;
		max-width: min(80vw, 4rem);
		background: white;
		border: 2px solid #007bff;
		padding: 1rem;
		border-radius: 0.5rem;
		display: grid;
		gap: 1rem;
	}

	.response-text {
		margin-bottom: 8px;
		white-space: pre-wrap;
	}

	.copy-button {
		background: #6c757d;
		font-size: 11px;
	}

	.copy-button:hover {
		background: #545b62;
	}
</style>
