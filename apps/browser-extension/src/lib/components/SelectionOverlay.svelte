<script lang="ts">
	let { rect = null, textLength = 0 } = $props();

	let isOverLimit = $derived(textLength > 128000);

	let style = $derived(
		rect
			? {
					left: `${rect.left + window.scrollX}px`,
					top: `${rect.top + window.scrollY}px`,
					width: `${rect.width}px`,
					height: `${rect.height}px`
				}
			: undefined
	);
</script>

{#if rect}
	<div
		class="highlight-overlay"
		style:left={style?.left}
		style:top={style?.top}
		style:width={style?.width}
		style:height={style?.height}
	>
		<span class="token-counter" class:over-limit={isOverLimit}>
			{textLength.toLocaleString()} chars
		</span>
	</div>
{/if}

<style>
	.highlight-overlay {
		border-radius: 0.5rem;
		position: absolute;
		background-color: rgba(0, 123, 255, 0.2);
		pointer-events: none;
		z-index: 9999;
	}

	.token-counter {
		position: absolute;
		right: 0;
		bottom: -20px;
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
