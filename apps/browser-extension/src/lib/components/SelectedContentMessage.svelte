<script lang="ts">
	interface Props {
		message: LlmMessage;
	}

	let { message }: Props = $props();
</script>

<details>
	<summary>Analyzed content</summary>

	{@html message.content.replace('!THIS IS MY SELECTED WEB PAGE CONTENT!', '')}
</details>
