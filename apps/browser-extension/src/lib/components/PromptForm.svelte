<script lang="ts">
	import '@webselect-ai/ui/styles/variables.css';
	import { Button } from '@webselect-ai/ui';
	import type Stripe from 'stripe';

	const suggestedPrompts = [
		'Summarize this text',
		'Break down this text into bullet points',
		'Extract keywords from this text'
	];

	let {
		contentType = 'text',
		isAuthenticated = false,
		isLoading = $bindable(false),
		llmConfig = $bindable({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' }),
		messages = $bindable([]) as LlmMessage[],
		placeholder = '',
		prompt = $bindable(''),
		promptFormEl = $bindable() as HTMLElement,
		selectedContent = $bindable({ text: '', html: '' }),
		showSuggestedPrompts = false,
		customerId = $bindable(''),
		customerEmail = $bindable('')
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

		if (!customerId) {
			alert('Missing customer ID');
			return;
		}

		if (!customerEmail) {
			alert('Missing customer email');
			return;
		}

		if (!messages.some((message) => message.role === 'system')) {
			messages.push({
				role: 'system',
				content: `You are a sidebar AI chat assistant called webselect.ai. Your main job is to work as a web content selection analyzer and a web browsing assistant. The extracted web content that comes from the selection will ALWAYS begin with "!MY SELECTED WEB PAGE CONTENT IS BELOW THIS LINE!" and end with "!MY SELECTED WEB PAGE CONTENT IS ABOVE THIS LINE!", otherwise ALWAYS treat other message as user's input.`
			});
		}

		if (selectedContent.text.length > 0) {
			messages.push({
				role: 'user',
				content: `!MY SELECTED WEB PAGE CONTENT IS BELOW THIS LINE!
${selectedContent[contentType]}
!MY SELECTED WEB PAGE CONTENT IS ABOVE THIS LINE!`
			});
		}

		messages.push({
			role: 'user',
			content: prompt
		});

		try {
			const fetchedCustomer: CustomerData = await new Promise((resolve, reject) => {
				chrome.runtime.sendMessage(
					{ action: 'verifyStripeCustomer', email: customerEmail },
					(response) => {
						if (response.error) {
							reject(new Error(response.error));
						} else {
							resolve(response);
						}
					}
				);
			});

			if (!fetchedCustomer?.activeSubscription?.isActive) {
				chrome.runtime.sendMessage({ action: 'openWebSelectPopup' });

				return;
			}

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
				await new Promise((resolve, reject) => {
					chrome.runtime.sendMessage(
						{
							action: 'sendPrompt',
							messages: messages
						},
						(response) => {
							if (chrome.runtime.lastError) {
								reject(chrome.runtime.lastError);
							} else if (response?.error) {
								reject(new Error(response.error));
							} else {
								resolve(response);
							}
						}
					);
				});

				// Reset prompt after successful submission
				prompt = '';
			} catch (error: any) {
				console.error('Error sending prompt:', error);
				alert(error.message || 'Error sending prompt');
			} finally {
				isLoading = false;
			}
		} catch (error: any) {
			console.error(error.message);
			isLoading = false;
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="prompt-form"
	bind:this={promptFormEl}
	onclick={(e) => {
		if (!isAuthenticated) {
			e.preventDefault();
			chrome.runtime.sendMessage({ action: 'openWebSelectPopup' });
		}
	}}
>
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
			<textarea
				disabled={!isAuthenticated}
				onkeydown={handleKeydown}
				{placeholder}
				rows="1"
				bind:value={prompt}
			></textarea>

			{#if !isAuthenticated}
				<Button onclick={(e) => e.preventDefault()}>Sign in to start chatting!</Button>
			{:else if !llmConfig.model}
				<Button
					onclick={(e) => {
						e.preventDefault();
						chrome.runtime.sendMessage({ action: 'openWebSelectPopup' });
					}}
				>
					Select a model to start chatting!
				</Button>
			{:else}
				<Button disabled={!prompt.length} type="submit">
					{isLoading ? 'Processing...' : 'Submit'}
				</Button>
			{/if}
		</fieldset>
	</form>
</div>

<style>
	.prompt-form {
		font-family: 'Space Grotesk', sans-serif;
		position: relative;
		z-index: 10000;
		pointer-events: all;
		display: grid;
		gap: 1rem;
		padding: 0.75rem;
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

		&[disabled] {
			pointer-events: none;
		}
	}

	.suggested-prompts {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
</style>
