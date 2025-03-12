<script>
	import { onMount } from 'svelte';

	let { enabled = $bindable(false) } = $props();

	function handleChange() {
		chrome.storage.local.set({
			autoselection_enabled: enabled
		});
	}

	onMount(() => {
		chrome.storage.local.get(['autoselection_enabled'], (result) => {
			if (result.autoselection_enabled === undefined) {
				enabled = true;
				chrome.storage.local.set({ autoselection_enabled: true });
			} else {
				enabled = result.autoselection_enabled;
			}
		});
	});
</script>

<fieldset>
	<legend>Automatically activate on selection</legend>

	<label>
		<input
			type="checkbox"
			name="content_type"
			value="text"
			bind:checked={enabled}
			onchange={handleChange}
		/>
		Enabled
	</label>

	{#if !enabled}
		<p>
			WebSelect will only activate when you press the <kbd>Alt</kbd> key.
		</p>
	{/if}
</fieldset>
