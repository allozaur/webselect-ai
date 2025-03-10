<script>
	import AutoselectionChoice from './AutoselectionChoice.svelte';
	import ContentTypeChoice from './ContentTypeChoice.svelte';
</script>

<fieldset>
	<legend>Selection Preferences</legend>

	<AutoselectionChoice />

	<ContentTypeChoice />
</fieldset>

<style>
	fieldset {
		display: grid;
		gap: 1rem;
		padding: 0.75rem 1rem 1.25rem;
		margin: 0;
	}
</style>
