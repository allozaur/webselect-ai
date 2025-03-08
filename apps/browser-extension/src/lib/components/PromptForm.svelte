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
		selectedContent = $bindable({ text: '', html: '' }),
		isContinuation = false,
		messages = $bindable([]) as Message[],
		promptFormEl = $bindable() as HTMLElement
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();

			handleSubmit();
		}
	}

	async function handleSubmit(e?: SubmitEvent) {
		e?.preventDefault();

		if (!isContinuation && !selectedContent) {
			alert('No text selected');
			return;
		}

		if (!isContinuation && selectedContent.length > 128000) {
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
					content: `You are a helpful assistant that works as a web content selection analyzer. My first message is a copied web content which i want you to use for further conversation.`
				});

				messages.push({
					role: 'user',
					content: selectedContent.html
				});
			} else {
				messages.push({
					role: 'user',
					content: prompt
				});
			}

			await sendMessage({
				action: 'sendPrompt',
				messages: messages
			});
		} catch (error) {
			console.error('Error initiating LLM message:', error);
			alert(error);
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

<div class="prompt-form {isContinuation ? 'continuation' : ''}" bind:this={promptFormEl}>
	<form onsubmit={handleSubmit}>
		{#if !prompt && !isContinuation}
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
		width: 300px;
		z-index: 10000;
		pointer-events: all;
		width: min(80vw, 48rem, 100%);
	}

	.prompt-form textarea {
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

	.continuation {
		width: 100%;
	}
</style>
