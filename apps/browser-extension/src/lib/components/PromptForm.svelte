<script lang="ts">
	import '@webselect-ai/ui/styles/variables.css';
	import { Button } from '@webselect-ai/ui';

	const suggestedPrompts = [
		'Summarize this text',
		'Break down this text into bullet points',
		'Extract keywords from this text'
	];

	let {
		contentType = 'text',
		isLoading = $bindable(false),
		prompt = $bindable(''),
		selectedContent = $bindable({ text: '', html: '' }),
		messages = $bindable([]) as LlmMessage[],
		placeholder = '',
		promptFormEl = $bindable() as HTMLElement,
		showSuggestedPrompts = false
	} = $props();

	let formElement: HTMLFormElement;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();

			formElement.requestSubmit();
		}
	}

	async function handleSubmit(e?: SubmitEvent) {
		e?.preventDefault();

		if (!selectedContent && !prompt) {
			alert('Please select text or enter a prompt');
			return;
		}

		if (selectedContent && selectedContent.length > 128000) {
			alert('Selection exceeds 128k character limit');
			return;
		}

		if (isLoading) {
			alert('Responding in progress');
			return;
		}

		isLoading = true;

		try {
			if (!messages.some((message) => message.role === 'system')) {
				messages.push({
					role: 'system',
					content: `You are a helpful assistant that works as a web content selection analyzer. My copied web content will ALWAYS begin with "!THIS IS MY SELECTED WEB PAGE CONTENT!", otherwise ALWAYS treat other message as user's input.`
				});
			}

			if (selectedContent.text.length > 0) {
				messages.push({
					role: 'user',
					content: `!THIS IS MY SELECTED WEB PAGE CONTENT! ${selectedContent[contentType]}`
				});
			}

			messages.push({
				role: 'user',
				content: prompt
			});

			prompt = '';

			await new Promise((resolve, reject) => {
				chrome.runtime.sendMessage(
					{
						action: 'sendPrompt',
						messages: messages
					},
					(response) => {
						if (chrome.runtime.lastError) {
							reject(chrome.runtime.lastError);
						} else {
							resolve(response);
						}
					}
				);
			});
		} catch (error: any) {
			console.error(error.message);
			isLoading = false;
		}
	}
</script>

<div class="prompt-form" bind:this={promptFormEl}>
	<form onsubmit={handleSubmit} bind:this={formElement}>
		{#if !prompt && showSuggestedPrompts}
			<div class="suggested-prompts">
				{#each suggestedPrompts as suggestedPrompt}
					<Button onclick={() => (prompt = suggestedPrompt)}>
						{suggestedPrompt}
					</Button>
				{/each}
			</div>
		{/if}

		<fieldset>
			<textarea onkeydown={handleKeydown} {placeholder} rows="1" bind:value={prompt}></textarea>

			<Button disabled={!prompt.length} type="submit">
				{isLoading ? 'Processing...' : 'Submit'}
			</Button>
		</fieldset>
	</form>
</div>

<style>
	.prompt-form {
		font-family: 'Space Grotesk', sans-serif;
		position: relative;
		width: 300px;
		z-index: 10000;
		pointer-events: all;
		min-width: 48rem;
		width: 100%;
		display: grid;
		gap: 1rem;
	}

	form,
	textarea {
		margin: 0;
	}

	form {
		display: grid;
		gap: 1rem;
	}

	fieldset {
		display: grid;
		grid-template-columns: 1fr auto;
		margin: 0;
		padding: 0;
		gap: 1rem;
	}

	.prompt-form textarea {
		padding: 8px;
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
