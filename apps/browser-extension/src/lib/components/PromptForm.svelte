<script lang="ts">
	import '@webcursor/ui/styles/index.css';

	let { onSubmit, response = '' } = $props();

	let prompt = $state('');
	let selectedText = $state('');
	let isLoading = $state(false);

	function handleSubmit(e?: SubmitEvent) {
		e?.preventDefault();

		isLoading = true;
		onSubmit(prompt, selectedText);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();

			handleSubmit();
		}
	}

	$effect(() => {
		if (response) {
			isLoading = false;
		}
	});
</script>

<div class="prompt-form">
	<form onsubmit={handleSubmit}>
		<textarea
			onkeydown={handleKeydown}
			placeholder="Enter your formatting instructions..."
			rows="3"
			bind:value={prompt}
		></textarea>

		<button type="submit" disabled={isLoading}>
			{isLoading ? 'Processing...' : 'Submit'}
		</button>
	</form>
</div>

<style>
	.prompt-form {
		font-family: 'Space Grotesk', sans-serif;
		position: relative;
		background: var(--bg-body);
		color: var(--c-text);
		padding: 12px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		width: 300px;
		z-index: 10000;
	}

	.prompt-form textarea {
		font-family: 'Space Grotesk', sans-serif;
		width: 100%;
		padding: 8px;
		margin-bottom: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}

	.prompt-form button {
		font-family: 'Space Grotesk', sans-serif;
		padding: 4px 8px;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
	}

	.prompt-form button:hover {
		background: #0056b3;
	}

	.prompt-form button:disabled {
		background: #cccccc;
		cursor: not-allowed;
	}
</style>
