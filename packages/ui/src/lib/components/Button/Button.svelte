<script lang="ts">
	import '$lib/styles/index.css';

	interface Props {
		children?: () => any;
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		type?: 'button' | 'submit' | 'reset';
	}

	let {
		children,
		disabled = undefined,
		onclick = (e?: MouseEvent) => {},
		type = 'button'
	}: Props = $props();
</script>

<button {disabled} {onclick} {type}>
	{@render children?.()}
</button>

<style>
	button {
		padding: 0.5rem 1rem;
		appearance: none;
		border: none;
		border-radius: 1rem;
		line-height: 1;
	}
</style>
