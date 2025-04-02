<script lang="ts">
	import { Button } from '@webselect-ai/ui';

	interface Props {
		message: LlmMessage;
	}

	let { message }: Props = $props();

	let showContent = $state(false);
</script>

<div class="selected-content-message">
	<span>Your web page selection</span>

	<details bind:open={showContent}>
		<summary>
			<Button>
				{showContent ? 'Hide' : 'See'} content
			</Button>
		</summary>

		<div class="content">
			{@html message.content.replace('!MY SELECTED WEB PAGE CONTENT IS BELOW THIS LINE!', '').replace('!MY SELECTED WEB PAGE CONTENT IS ABOVE THIS LINE!', '')}
		</div>
	</details>
</div>

<style>
	.selected-content-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 1rem;
		background: var(--bg-surface-2);
		color: var(--c-text);
		margin-top: 1rem;
	}

	details {
		background: transparent;
	}

	summary {
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 1rem;

		:global(.button) {
			pointer-events: none;
		}
	}

	.content {
		[open] & {
			padding-block: 1rem;
		}
	}
</style>
