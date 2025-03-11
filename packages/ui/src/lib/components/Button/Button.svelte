<script lang="ts">
	import '$lib/styles/index.css';

	interface Props {
		children?: () => any;
		disabled?: boolean;
		href?: string;
		kind?: 'primary' | 'secondary' | 'tertiary';
		onclick?: (e: MouseEvent) => void;
		size?: 'sm' | 'md' | 'lg';
		target?: '_blank' | '_self' | '_parent' | '_top';
		type?: 'button' | 'submit' | 'reset';
	}

	let {
		children,
		disabled = undefined,
		href = undefined,
		kind = 'primary',
		onclick = (e?: MouseEvent) => {},
		size = 'md',
		target = undefined,
		type = 'button'
	}: Props = $props();
</script>

{#if href}
	<a class="button {kind} {size}" {href} {target}>
		{@render children?.()}
	</a>
{:else}
	<button class="button {kind} {size}" {disabled} {onclick} {type}>
		{@render children?.()}
	</button>
{/if}

<style>
	:is(button, a) {
		appearance: none;
		border: none;
		border-radius: 1rem;
		text-decoration: none;
		line-height: 1;
	}

	.primary {
		background: #ddd;
		color: #333;
	}

	.secondary {
		background: #333;
		color: #fff;
	}

	.tertiary {
		background: transparent;
		color: #333;
	}

	.sm {
		padding: 0.25rem 0.5rem;
	}

	.md {
		padding: 0.5rem 1rem;
	}

	.lg {
		padding: 0.75rem 1.5rem;
	}
</style>
