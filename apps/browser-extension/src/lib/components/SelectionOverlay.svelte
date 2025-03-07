<script lang="ts">
	let { bottom, rect = null, textLength = 0 } = $props();

	let isOverLimit = $derived(textLength > 128000);
</script>

{#if rect}
	<div
		class="highlight-overlay"
		style:left="{rect.left}px"
		style:top="{rect.top}px"
		style:width="{rect.width}px"
		style:height="{rect.height}px"
	>
		<div class="bottom">
			<span class="token-counter" class:over-limit={isOverLimit}>
				{textLength.toLocaleString()} chars
			</span>

			{@render bottom()}
		</div>
	</div>
{/if}

<style>
	.highlight-overlay {
		position: absolute;
		background-color: rgba(66, 135, 245, 0.2); /* Visible but translucent blue */
		border: 2px solid rgba(66, 135, 245, 0.4);
		pointer-events: none;
		z-index: 9999;
	}

	.bottom {
		position: absolute;
		right: 0;
		top: calc(100% + 1.5rem);
	}

	.token-counter {
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 12px;
		font-family: 'Space Grotesk', sans-serif;
	}

	.token-counter.over-limit {
		background-color: rgba(255, 0, 0, 0.7);
	}
</style>
