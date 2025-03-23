<script>
	import { Button } from '@webselect-ai/ui';
</script>

<section class="home-hero">
	<div class="content">
		<h1>
			Chat with <br /><span class="selectable"><strong>any web content</strong></span> directly on the
			page
		</h1>

		<p>
			Select text on any website and instantly chat with AI about it without switching tabs.
			WebSelect.ai integrates seamlessly with your browsing experience – no copy-pasting, no context
			switching, no workflow disruption.
			<strong>Access insights about web content right where you're reading it.</strong>
		</p>

		<Button>Get the extension</Button>
	</div>
</section>

<style>
	.home-hero {
		display: flex;
		justify-content: center;
	}

	.content {
		display: grid;
		gap: 2.5rem;
		place-items: center;
		text-align: center;
		max-width: 40rem;

		@media (width > 768px) {
			padding: 4rem;
		}
	}

	h1 {
		margin: 0;
		font-size: 2rem;

		@media (width > 768px) {
			font-size: 2.75rem;

			br {
				display: none;
			}
		}

		strong {
			color: var(--hex-primary);
		}

		.selectable {
			position: relative;
		}

		.selectable::before {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: var(--bg-highlight);
			animation: 4s infinite selectText;
			transform: scaleX(0);
			transform-origin: left;
		}

		.selectable strong {
			position: relative;
			z-index: 1;
		}
	}

	p {
		margin: 0;
	}

	@keyframes selectText {
		20% {
			transform: scaleX(0);
		}

		50%,
		100% {
			transform: scaleX(1);
		}
	}
</style>
