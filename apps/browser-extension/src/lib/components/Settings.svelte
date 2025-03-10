<script>
	import { Button } from '@webcursor/ui';
	import LlmConfiguration from '$lib/components/LlmConfiguration.svelte';
	import SelectionPreferences from './SelectionPreferences.svelte';
</script>

<form>
	<LlmConfiguration />

	<SelectionPreferences />

	<Button type="submit">Save settings</Button>
</form>

<style>
	form {
		display: grid;
		gap: 1.5rem;
	}
</style>
