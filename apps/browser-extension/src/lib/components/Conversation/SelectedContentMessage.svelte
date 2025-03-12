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

		{@html message.content.replace('!THIS IS MY SELECTED WEB PAGE CONTENT!', '')}
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
		background: var(--bg-surface-1);
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
</style>
