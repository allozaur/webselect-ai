<script lang="ts">
	import '@webcursor/ui/styles/variables.css';
	import { Button } from '@webcursor/ui';

	const suggestedPrompts = [
		'Summarize this text',
		'Analyze the sentiment of this text',
		'Extract the keywords from this text'
	];

	let { onSubmit, isLoading = false, prompt = $bindable('') } = $props();
	let selectedText = $state('');

	function handleSubmit(e?: SubmitEvent) {
		e?.preventDefault();

		onSubmit(prompt, selectedText);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();

			handleSubmit();
		}
	}
</script>

<div class="prompt-form">
	<form onsubmit={handleSubmit}>
		{#if !prompt}
			<div class="suggested-prompts">
				{#each suggestedPrompts as suggestedPrompt}
					<Button onclick={() => (prompt = suggestedPrompt)}>
						{suggestedPrompt}
					</Button>
				{/each}
			</div>
		{/if}
		<textarea
			onkeydown={handleKeydown}
			placeholder="What do you want to do with this selection?"
			rows="3"
			bind:value={prompt}
		></textarea>

		{#if prompt}
			<Button type="submit" disabled={isLoading}>
				{isLoading ? 'Processing...' : 'Submit'}
			</Button>
		{/if}
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
		width: min(80vw, 48rem);
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

	.suggested-prompts {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
</style>
