<script lang="ts">
	import { marked } from 'marked';

	let { content = '' } = $props();

	function copyToClipboard() {
		navigator.clipboard.writeText(content);
	}
</script>

<div class="llm-message">
	{@html marked.parse(content)}

	<button class="copy-button" onclick={copyToClipboard}> Copy to clipboard </button>
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
		border: var(--c-text);
	}
</style>
