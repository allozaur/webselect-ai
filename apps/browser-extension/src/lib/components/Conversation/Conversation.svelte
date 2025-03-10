<script lang="ts">
	import PromptForm from '../PromptForm.svelte';
	import { Button } from '@webcursor/ui';
	import Message from './Message.svelte';
	import SelectedContentMessage from './SelectedContentMessage.svelte';

	let {
		messages = $bindable([]),
		isLoading = $bindable(false),
		onClose,
		prompt = $bindable('')
	} = $props();

	let conversationContainer: HTMLElement;

	$effect(() => {
		if (messages.length > 0) {
			conversationContainer?.scrollTo({
				top: conversationContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	});
</script>

<div class="webcursor-conversation" bind:this={conversationContainer}>
	<nav>
		<Button onclick={onClose}>Close</Button>
	</nav>

	<div class="messages">
		{#if messages.length > 0}
			{#each messages as message, i}
				{#if message.role !== 'system'}
					{#if message.content.startsWith('!THIS IS MY SELECTED WEB PAGE CONTENT!')}
						<SelectedContentMessage {message} />
					{:else}
						<Message {message} />
					{/if}
				{/if}
			{/each}
		{/if}
	</div>

	<div class="bottom">
		<PromptForm placeholder="Reply to WebCursor..." bind:isLoading bind:messages bind:prompt />
	</div>
</div>

<style>
	.webcursor-conversation {
		position: fixed;
		top: 1rem;
		right: 1rem;
		max-height: calc(100vh - 2rem);
		overflow: auto;
		background: var(--bg-body);
		border-radius: 1rem;
		pointer-events: all;
		width: 36vw;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-shadow: #00000050 0 0 12px 12px;
	}

	nav {
		display: flex;
		justify-content: flex-end;
		padding: 1rem;
		margin: 0;
	}

	.messages {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	.bottom {
		padding: 1rem;
		position: sticky;
		bottom: 0;
	}
</style>
