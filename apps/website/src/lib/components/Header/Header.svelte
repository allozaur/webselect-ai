<script>
	import { WebSelectLogo } from '@webselect-ai/ui';
</script>

<header>
	<a href="/">
		<WebSelectLogo --height="2.5rem" />
	</a>
</header>

<style>
	header {
		padding: 2rem 1.5rem;
		display: grid;
		place-items: center;

		@media (width > 768px) {
			:global(svg) {
				--height: 3rem;
			}
		}
	}

	a {
		display: contents;
		appearance: none;
		text-decoration: none;
		color: var(--c-text);
	}
</style>
