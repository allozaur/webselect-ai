<script lang="ts">
	import { Button } from '@webcursor/ui';
	import { marked } from 'marked';

	let { message = { content: '', role: '' } } = $props();

	function copyToClipboard() {
		navigator.clipboard.writeText(message.content);
	}
</script>

<div class="llm-message">
	{@html marked.parse(message.content)}

	{#if message.role === 'assistant'}
		<Button onclick={copyToClipboard}>Copy to clipboard</Button>
	{/if}
</div>

<style>
	.llm-message {
		max-width: 33vw;
		max-height: calc(100vh - 2rem);
		overflow: auto;
		width: 100%;
		padding: 1rem;
		border-radius: 1rem;
		background: var(--bg-body);
		color: var(--c-text);
		border: var(--c-text);
	}
</style>
