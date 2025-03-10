<script lang="ts">
	import { Button } from '@webcursor/ui';
	import { marked } from 'marked';

	interface Props {
		message: LlmMessage;
	}

	let { message }: Props = $props();

	function copyToClipboard() {
		navigator.clipboard.writeText(message.content);
	}
</script>

<div class="message role-{message.role}">
	<div class="content">
		{@html marked.parse(message.content)}
	</div>

	<div class="actions">
		{#if message.role === 'assistant'}
			<Button onclick={copyToClipboard}>Copy to clipboard</Button>
		{/if}
	</div>
</div>

<style>
	.message {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		flex-direction: column;
		overflow: auto;
		border-radius: 1rem;
		background: var(--bg-body);
		color: var(--c-text);
		border: var(--c-text);

		&.role-user {
			align-items: flex-end;
		}
	}

	.content {
		width: auto;
		max-width: min(84%, 32rem);
		border-radius: 1rem;

		:global(p) {
			margin: 0;
			line-height: 1.5;
		}

		.role-user & {
			background: var(--bg-surface-1);
			padding: 1rem;
		}
	}

	.actions {
		display: flex;
		gap: 1rem;
	}
</style>
