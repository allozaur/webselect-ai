<script lang="ts">
	import { onMount } from 'svelte';
	import PromptForm from '$lib/components/PromptForm.svelte';
	import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';
	import Conversation from '$lib/components/Conversation.svelte';

	let llmContent = $state('');
	let isLoading = $state(false);
	let messages: Message[] = $state([]);
	let prompt = $state('');
	let selectionRect: DOMRect | null = $state(null);
	let selectedText = $state('');
	let showInitialPrompt = $state(true);
	let promptFormEl: HTMLElement | undefined = $state();

	function cleanup() {
		isLoading = false;
		prompt = '';
		llmContent = '';
		selectedText = '';
		selectionRect = null;
	}

	function handleCloseConversation() {
		messages = [];
		cleanup();
	}

	function handleMouseDown(e: MouseEvent) {
		const target = e.target as Node;
		const components = document.querySelector('.webcursor');

		if (promptFormEl?.contains(target)) {
			return;
		}

		if (components && !components.contains(target)) {
			if (
				!llmContent.trim() ||
				(llmContent.trim().length > 0 &&
					window.confirm('Are you sure you want to clear the response and start over?'))
			) {
				cleanup();
			}
		}
	}

	function handleSelectionRect(e: Event) {
		const target = e.target as Node;
		const selection = window.getSelection();

		if (promptFormEl?.contains(target)) {
			return;
		}

		if (!selection || !selection.toString().trim()) {
			// Don't cleanup messages when selection changes
			selectionRect = null;
			showInitialPrompt = true;
			return;
		}

		selectedText = selection.toString();

		if (selectedText.length > 128000) {
			alert('Selection exceeds 128k character limit');
			return;
		}

		const range = selection.getRangeAt(0);
		selectionRect = range.getBoundingClientRect();
	}

	onMount(() => {
		chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
			switch (message.action) {
				case 'streamStart':
					messages = [
						...messages,
						{ role: 'user', content: prompt },
						{ role: 'assistant', content: '' }
					];
					showInitialPrompt = false;
					prompt = '';
					break;
				case 'streamUpdate':
					if (message.chunk) {
						const lastMessage = messages[messages.length - 1];
						lastMessage.content += message.chunk;
						messages = [...messages];
					}
					break;
				case 'streamComplete':
					isLoading = false;
					break;
				case 'streamError':
					console.error('Stream error:', JSON.stringify(message.error));
					isLoading = false;
					break;
			}
		});
	});
</script>

<svelte:document onselectionchange={handleSelectionRect} />

<svelte:window
	onmousedown={handleMouseDown}
	onresize={handleSelectionRect}
	onscroll={handleSelectionRect}
/>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
	/>
</svelte:head>

<div class="webcursor">
	{#if selectionRect}
		<SelectionOverlay rect={selectionRect} textLength={selectedText.length}>
			{#snippet bottom()}
				{#if showInitialPrompt}
					<PromptForm
						bind:isLoading
						bind:messages
						bind:prompt
						bind:promptFormEl
						bind:selectedText
					/>
				{/if}
			{/snippet}
		</SelectionOverlay>
	{/if}

	{#if messages.length > 0}
		<Conversation {messages} onClose={handleCloseConversation} bind:isLoading />
	{/if}
</div>

<style lang="postcss">
	.webcursor {
		box-sizing: border-box;
		color: var(--c-text);
		color-scheme: light dark;
		font-family: var(--ff);
		font-optical-sizing: auto;
		letter-spacing: -0.01em;
		margin: 0;
		padding: 0;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;

		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 999999999999999999;
	}
</style>
