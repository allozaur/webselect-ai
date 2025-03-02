<script lang="ts">
	let { onClick } = $props();
</script>

<button onclick={onClick}> Format Text </button>

<style>
	button {
		position: relative;
		padding: 4px 8px;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		z-index: 10000;
	}

	button:hover {
		background: #0056b3;
	}
</style>
