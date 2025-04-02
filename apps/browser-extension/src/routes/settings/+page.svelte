<script lang="ts">
	import { Button } from '@webselect-ai/ui';
	import { signOut } from '$lib/auth';
	import LlmConfiguration from '$lib/components/LlmConfiguration/LlmConfiguration.svelte';
	import SelectionConfiguration from '$lib/components/SelectionConfiguration/SelectionConfiguration.svelte';
	import ManageLicenseSection from './ManageLicenseSection.svelte';

	let llmConfig = $state({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' });

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		chrome.storage.local.set({
			llm_config: llmConfig
		});

		window.close();
	}
</script>

<main>
	<section>
		<h2>Settings</h2>

		<form onsubmit={handleSubmit}>
			<LlmConfiguration bind:llmConfig />

			<SelectionConfiguration />

			<div class="bottom">
				<Button type="submit">Save settings</Button>
			</div>
		</form>
	</section>

	<section>
		<h2>Manage your license</h2>

		<ManageLicenseSection />
	</section>

	<section>
		<h2>Manage your account</h2>

		<Button
			kind="danger"
			onclick={async () => {
				await signOut();

				window.close();
			}}>Sign out</Button
		>
	</section>
</main>

<style>
	main {
		padding: 1rem;
		display: grid;
		gap: 2rem;
	}

	section {
		display: grid;
		gap: 1rem;
	}

	h2 {
		margin: 0;
	}

	form {
		display: grid;
		gap: 1.5rem;

		.bottom {
			display: grid;
			position: sticky;
			bottom: 0;
			background: var(--bg-body);
			margin-top: 1rem;
		}
	}
</style>
