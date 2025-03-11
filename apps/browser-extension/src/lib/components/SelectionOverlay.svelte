<script lang="ts">
	import { onMount } from 'svelte';

	let { bottom, rect = null, textLength = 0 } = $props();

	// svelte-ignore non_reactive_update
	let bottomElement: HTMLElement;
	let overflowState: null | string = $state(null);
	let isOverLimit = $derived(textLength > 128000);
	let isAutoselectionEnabled = $state(false);
	let isAltToggled = $state(false);

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Alt') {
			e.preventDefault();
			isAltToggled = !isAltToggled;
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'Alt') {
			e.preventDefault();
		}
	}

	function checkBottomOverflow() {
		if (!rect || !bottomElement) return;

		const viewportHeight = window.innerHeight;
		const bottomRect = bottomElement.getBoundingClientRect();

		if (bottomRect.bottom > viewportHeight) {
			overflowState = 'bottom';
		} else if (bottomRect.top < 0) {
			overflowState = 'top';
		} else {
			overflowState = null;
		}
	}

	onMount(() => {
		chrome.storage.local.get(['autoselection_enabled'], (result) => {
			isAutoselectionEnabled = result.autoselection_enabled ?? true;
		});
	});
</script>

<svelte:window
	onkeydown={handleKeyDown}
	onkeyup={handleKeyUp}
	onresize={checkBottomOverflow}
	onscroll={checkBottomOverflow}
/>

{#if rect && (isAutoselectionEnabled || isAltToggled)}
	<div
		class="highlight-overlay"
		style:left="{rect.left}px"
		style:top="{rect.top}px"
		style:width="{rect.width}px"
		style:height="{rect.height}px"
	>
		<span class="token-counter" class:over-limit={isOverLimit}>
			{textLength.toLocaleString()} chars
		</span>

		<div
			class="bottom-slot"
			class:overflow={overflowState}
			class:bottom={overflowState === 'bottom'}
			class:top={overflowState === 'top'}
			bind:this={bottomElement}
		>
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

	.token-counter {
		position: absolute;
		bottom: 0;
		right: 0;
		z-index: 1;
	}

	.bottom-slot {
		background-color: var(--bg-backdrop);
		backdrop-filter: blur(0.5rem);
		padding-top: 0.75rem;
		border-radius: 0.5rem;
		position: absolute;
		top: calc(100% + 0.5rem);

		&.overflow {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			top: unset;
		}

		:global(.prompt-form) {
			max-width: 64rem;
			margin: auto;
		}
	}

	.token-counter {
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.875rem;
		font-family: 'Space Grotesk', sans-serif;
	}

	.token-counter.over-limit {
		background-color: rgba(255, 0, 0, 0.7);
	}
</style>
