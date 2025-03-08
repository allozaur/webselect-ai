<script>
	import { Button } from '@webcursor/ui';
	import AutoselectionChoice from './AutoselectionChoice.svelte';
	import ContentTypeChoice from '$lib/components/ContentTypeChoice.svelte';
	import LlmChoice from '$lib/components/LlmChoice.svelte';
</script>

<form>
	<AutoselectionChoice />

	<LlmChoice />

	<ContentTypeChoice />

	<Button type="submit">Save settings</Button>
</form>

<style>
	form {
		display: grid;
		gap: 1.5rem;
	}
</style>
