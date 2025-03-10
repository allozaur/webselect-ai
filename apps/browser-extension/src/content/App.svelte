<script lang="ts">
	import { onMount } from 'svelte';
	import Conversation from '$lib/components/Conversation.svelte';
	import PromptForm from '$lib/components/PromptForm.svelte';
	import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';
	import clickOutside from '$lib/utils/click-outside';
	import getSelectionContent from './get-selection-content';

	let contentType = $state('text');
	let isLoading = $state(false);
	let messages: Message[] = $state([]);
	let overlayPrompt = $state('');
	let prompt = $state('');
	let promptFormEl: HTMLElement | undefined = $state();
	let selectionRect: DOMRect | null = $state(null);
	let selectedContent = $state({ text: '', html: '' });

	function cleanup() {
		isLoading = false;
		prompt = '';
		overlayPrompt = '';
		selectedContent = { text: '', html: '' };
		selectionRect = null;
	}

	function handleCloseConversation() {
		messages = [];

		cleanup();
	}

	function handleSelectionRect(e: Event) {
		const target = e.target as Node;
		const selection = window.getSelection();

		if (promptFormEl?.contains(target)) {
			return;
		}

		if (!selection || !selection.toString().trim()) {
			selectionRect = null;
			return;
		}

		const content = getSelectionContent(selection);

		if (content.text.length > 128000) {
			alert('Selection exceeds 128k character limit');
			return;
		}

		chrome.storage.local.get('content_type', (result) => {
			contentType = result.content_type ?? 'text';
		});

		selectedContent = content;
		const range = selection.getRangeAt(0);
		selectionRect = range.getBoundingClientRect();
	}

	onMount(() => {
		chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
			switch (message.action) {
				case 'streamStart':
					messages = [...messages, { role: 'assistant', content: '' }];
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
					console.error(message.error);
					isLoading = false;
					break;
			}
		});
	});
</script>

<svelte:window onresize={handleSelectionRect} onscroll={handleSelectionRect} />

<svelte:document onselectionchange={handleSelectionRect} />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
	/>
</svelte:head>

<div
	class="webcursor"
	use:clickOutside={() => {
		if (selectedContent && selectionRect && prompt) {
			cleanup();
		}
	}}
>
	{#if selectionRect}
		<SelectionOverlay rect={selectionRect} textLength={selectedContent.text.length}>
			{#snippet bottom()}
				<PromptForm
					{contentType}
					showSuggestedPrompts
					bind:isLoading
					bind:messages
					bind:prompt={overlayPrompt}
					bind:promptFormEl
					bind:selectedContent
				/>
			{/snippet}
		</SelectionOverlay>
	{/if}

	{#if messages.length > 0}
		<Conversation {messages} onClose={handleCloseConversation} bind:isLoading bind:prompt />
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
