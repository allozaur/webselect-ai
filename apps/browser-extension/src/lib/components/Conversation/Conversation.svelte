<script lang="ts">
	import PromptForm from '../PromptForm.svelte';
	import { Button } from '@webselect-ai/ui';
	import Message from './Message.svelte';
	import SelectedContentMessage from './SelectedContentMessage.svelte';
	import WebSelectLogo from '../WebSelectLogo.svelte';

	let {
		customerEmail = $bindable(''),
		customerId = $bindable(''),
		messages = $bindable([]),
		isLoading = $bindable(false),
		isAuthenticated = false,
		llmConfig = $bindable({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' }),
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

<div class="webselect-conversation" bind:this={conversationContainer}>
	<nav>
		<WebSelectLogo />

		<Button onclick={onClose}>Close</Button>
	</nav>

	<div class="messages">
		{#if messages.length > 0}
			{#each messages as message, i}
				{#if message.role !== 'system'}
					{#if message.content.startsWith('!MY SELECTED WEB PAGE CONTENT IS BELOW THIS LINE!') && message.content.endsWith('!MY SELECTED WEB PAGE CONTENT IS ABOVE THIS LINE!')}
						<SelectedContentMessage {message} />
					{:else}
						<Message {message} />
					{/if}
				{/if}
			{/each}
		{/if}
	</div>

	<div class="bottom">
		<PromptForm
			{isAuthenticated}
			placeholder="What do you want to do with this selection?"
			bind:isLoading
			bind:llmConfig
			bind:messages
			bind:prompt
			bind:customerEmail
			bind:customerId
		/>
	</div>
</div>

<style>
	.webselect-conversation {
		position: fixed;
		top: 1rem;
		right: 1rem;
		max-height: calc(100vh - 2rem);
		overflow: auto;
		background: var(--bg-body);
		border-radius: 1rem;
		pointer-events: all;
		width: 36vw;
		max-width: 36rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-shadow: #00000050 0 0 12px 12px;
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
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
