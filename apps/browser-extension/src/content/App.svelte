<script lang="ts">
	import { onMount } from 'svelte';
	import LlmMessage from '$lib/components/LlmMessage.svelte';
	import PromptForm from '$lib/components/PromptForm.svelte';
	import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';

	let llmContent = $state('');
	let isLoading = $state(false);
	let prompt = $state('');
	let selectedText = $state('');

	let selectionRect: DOMRect | null = $state(null);

	function cleanup() {
		isLoading = false;
		prompt = '';
		llmContent = '';
		selectedText = '';
		selectionRect = null;
	}

	function handleMouseDown(e: MouseEvent) {
		const target = e.target as Node;
		const components = document.querySelector('.webcursor');
		const promptForm = document.querySelector('.prompt-form');

		if (promptForm?.contains(target)) {
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

	function handleSelection() {
		const selection = window.getSelection();

		if (!selection || !selection.toString().trim()) {
			cleanup();
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
				case 'streamUpdate':
					if (message.chunk) {
						llmContent += message.chunk;
					}
					break;
				case 'streamComplete':
					isLoading = false;
					prompt = '';
					break;
				case 'streamError':
					console.error('Stream error:', message.error);
					isLoading = false;
					prompt = '';
					break;
			}
		});
	});
</script>

<svelte:document onselectionchange={handleSelection} />

<svelte:window
	onmousedown={handleMouseDown}
	onresize={handleSelection}
	onscroll={handleSelection}
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
				<PromptForm bind:isLoading bind:prompt bind:selectedText />
			{/snippet}
		</SelectionOverlay>
	{/if}

	{#if llmContent}
		<div class="llm-message-wrapper">
			<LlmMessage content={llmContent} />
		</div>
	{/if}
</div>

<style>
	.webcursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 9999;
	}

	.llm-message-wrapper {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 10000;
	}
</style>
