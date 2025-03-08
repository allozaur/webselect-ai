<script lang="ts">
	import { marked } from 'marked';
	import PromptForm from './PromptForm.svelte';
	import { Button } from '@webcursor/ui';

	let { messages = $bindable([]), isLoading = $bindable(false), onClose } = $props();

	function copyToClipboard(content: string) {
		navigator.clipboard.writeText(content);
	}
</script>

<div class="conversation">
	<Button onclick={onClose}>Close</Button>

	{#if messages.length > 0}
		{#each messages as message, i}
			{#if message.role !== 'system'}
				<div class="message {message.role}">
					{#if message.role === 'user' && i === 1}
						<div class="content">
							<details>
								<summary>Analyzed content</summary>

								{@html message.content}
							</details>
						</div>
					{:else}
						<div class="content">
							{@html marked.parse(message.content)}

							<button class="copy-button" onclick={() => copyToClipboard(message.content)}>
								Copy to clipboard
							</button>
						</div>
					{/if}
				</div>
				<!-- content here -->
			{/if}
		{/each}

		<PromptForm bind:isLoading bind:messages isContinuation />
	{:else}
		Loading...
	{/if}
</div>

<style>
	.conversation {
		position: fixed;
		top: 1rem;
		right: 1rem;
		width: min(33vw, 32rem);
		max-height: calc(100vh - 2rem);
		overflow: auto;
		background: var(--bg-body);
		border-radius: 1rem;
		pointer-events: all;

		display: grid;
		gap: 1.5rem;
	}

	.message {
		padding: 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.message.assistant {
		background: rgba(66, 135, 245, 0.1);
	}

	.content :global(p) {
		margin: 0;
		font-family: 'Space Grotesk', sans-serif;
	}

	.copy-button {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		opacity: 0.7;
	}
</style>
