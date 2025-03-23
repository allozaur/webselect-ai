<script lang="ts">
	import '$lib/styles/index.css';

	interface Props {
		children?: () => any;
		disabled?: boolean;
		href?: string;
		kind?: 'primary' | 'secondary' | 'tertiary' | 'danger';
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
		border-radius: 0.625rem;
		text-decoration: none;
		line-height: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
	}

	.primary {
		background: var(--hex-primary);
		color: var(--hex-white);
	}

	.secondary {
		background: var(--bg-surface-2);
		color: #fff;
	}

	.tertiary {
		background: transparent;
		color: #333;
	}

	.danger {
		background: var(--hex-danger);
		color: var(--hex-white);
	}

	.sm {
		padding: 0.5rem 1rem;
	}

	.md {
		padding: 0.75rem 1.5rem;
	}

	.lg {
		padding: 0.875rem 1.75rem;
	}
</style>
