<script lang="ts">
	import '@webcursor/ui/styles/variables.css';
	import { Button } from '@webcursor/ui';

	const suggestedPrompts = [
		'Summarize this thread',
		'Breakdown this text into bullet points',
		'Extract the keywords from this text'
	];

	let {
		isLoading = $bindable(false),
		prompt = $bindable(''),
		selectedText = $bindable('')
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();

			handleSubmit();
		}
	}

	async function handleSubmit(e?: SubmitEvent) {
		e?.preventDefault();

		if (!selectedText) {
			alert('No text selected');
			return;
		}

		if (selectedText.length > 128000) {
			alert('Selection exceeds 128k character limit');
			return;
		}

		if (isLoading) {
			alert('Responding in progress');
			return;
		}

		isLoading = true;

		try {
			await sendMessage({
				action: 'sendPrompt',
				systemPrompt: `You are a helpful assistant`,
				userPrompt: `This is a text which i want you to use for my further instruction: ${selectedText}. Now this is my prompt: ${prompt}`
			});
		} catch (error) {
			console.error('Error initiating LLM message:', error);
			alert('Connection error');
			isLoading = false;
		}
	}

	function sendMessage<T = unknown>(message: ChromeMessage): Promise<T> {
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(message, (response) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve(response);
				}
			});
		});
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
		pointer-events: all;
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

	.suggested-prompts {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
</style>
