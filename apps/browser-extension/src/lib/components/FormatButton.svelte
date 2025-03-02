<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		onClick: (e?: MouseEvent) => void;
		textarea: HTMLTextAreaElement;
	}

	let { onClick, textarea }: Props = $props();

	let buttonStyle = $state({
		top: '0px',
		right: '0px'
	});

	function updatePosition() {
		const rect = textarea.getBoundingClientRect();

		buttonStyle.top = `${rect.top + 10}px`;
		buttonStyle.right = `${window.innerWidth - rect.right + 10}px`;
	}

	onMount(() => {
		updatePosition();
	});
</script>

<svelte:window onresize={updatePosition} onscroll={updatePosition} />

<div
	class="markmaster-format-button-container"
	style:position="fixed"
	style:top={buttonStyle.top}
	style:right={buttonStyle.right}
	style:z-index="9999"
>
	<button onclick={onClick}> Improve formatting </button>
</div>

<style>
	:global(.markmaster-format-button-container button) {
		display: grid;
		padding: 0.5rem;
		background: cornflowerblue;
		color: white;
	}
</style>
