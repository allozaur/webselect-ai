<script lang="ts">
	import '$lib/styles/index.css';

	interface Props {
		children?: () => any;
		disabled?: boolean;
		href?: string;
		onclick?: (e: MouseEvent) => void;
		target?: '_blank' | '_self' | '_parent' | '_top';
		type?: 'button' | 'submit' | 'reset';
	}

	let {
		children,
		disabled = undefined,
		href = undefined,
		onclick = (e?: MouseEvent) => {},
		target = undefined,
		type = 'button'
	}: Props = $props();
</script>

{#if href}
	<a class="button" {href} {target}>
		{@render children?.()}
	</a>
{:else}
	<button class="button" {disabled} {onclick} {type}>
		{@render children?.()}
	</button>
{/if}

<style>
	:is(button, a) {
		background: #ddd;
		color: #333;
		padding: 0.5rem 1rem;
		appearance: none;
		border: none;
		border-radius: 1rem;
		text-decoration: none;
		line-height: 1;
	}
</style>
