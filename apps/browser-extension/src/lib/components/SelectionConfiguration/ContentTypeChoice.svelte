<script>
	import { onMount } from 'svelte';

	let { selectedContentType = $bindable('text') } = $props();

	function handleChange() {
		chrome.storage.local.set({
			content_type: selectedContentType
		});
	}

	onMount(() => {
		chrome.storage.local.get('content_type', (result) => {
			selectedContentType = result.content_type ?? 'text';
		});
	});
</script>

<fieldset>
	<legend>Extracted content type</legend>

	<label>
		<input
			type="radio"
			name="content_type"
			value="text"
			bind:group={selectedContentType}
			onchange={handleChange}
		/>
		Text
	</label>

	<label>
		<input
			type="radio"
			name="content_type"
			value="html"
			bind:group={selectedContentType}
			onchange={handleChange}
		/>
		HTML
	</label>
</fieldset>
