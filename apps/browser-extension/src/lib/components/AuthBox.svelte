<script>
	import { signInWithGoogle } from '$lib/auth';
	import { Button, Logo } from '@webselect-ai/ui';
	import WebSelectLogo from './WebSelectLogo.svelte';
</script>

<nav class="auth-box">
	<WebSelectLogo --height="2.25rem" />

	<Button kind="secondary" onclick={signInWithGoogle}>
		Sign in with Google

		<Logo name="google" --size="1.5rem" />
	</Button>
</nav>

<style>
	.auth-box {
		display: grid;
		gap: 2rem;
		place-content: center;
		display: grid;
		text-align: center;
		background: var(--bg-body);
		font-size: 1.25rem;
		color: var(--c-text);
		font-weight: 500;
		border-radius: 1rem;
		padding: 3rem;
	}
</style>
