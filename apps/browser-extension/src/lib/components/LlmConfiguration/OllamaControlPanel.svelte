<script lang="ts">
	import { Button } from '@webselect-ai/ui';

	let customModelName = $state('');
	let downloadStatus = $state<DownloadStatus | null>(null);
	let downloadProgress = $state<number>(0);
	let isOllamaAvailable = $state(false);
	let showDownloadModel = $state(false);

	let { llmConfig = $bindable(), ollamaModels = $bindable() } = $props();

	async function checkOllamaAvailability() {
		try {
			const response = await fetch('http://localhost:11434/api/tags');

			isOllamaAvailable = response.status === 200;

			if (isOllamaAvailable) {
				await fetchOllamaModels();
			}
		} catch (error) {
			console.error('Ollama not available:', error);
			isOllamaAvailable = false;
		}
	}

	async function fetchOllamaModels() {
		try {
			const response = await fetch('http://localhost:11434/api/tags');
			const data = await response.json();

			ollamaModels = data.models;

			if (ollamaModels.length === 0) {
				showDownloadModel = true;
			}
		} catch (error) {
			console.error('Failed to fetch Ollama models:', error);
			ollamaModels = [];
			showDownloadModel = true;
		}
	}

	async function downloadModel(modelName: string) {
		downloadStatus = { status: 'Starting download...' };
		downloadProgress = 0;

		try {
			const response = await fetch('http://localhost:11434/api/pull', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: modelName
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to download model: ${response.statusText}`);
			}

			const reader = response.body?.getReader();
			if (!reader) throw new Error('No response body');

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				// Convert the received chunks to text and split by newlines
				const text = new TextDecoder().decode(value);
				const lines = text.split('\n').filter((line) => line.trim());

				// Process each line as a JSON status update
				for (const line of lines) {
					try {
						const status: DownloadStatus = JSON.parse(line);
						downloadStatus = status;

						if (status.total && status.completed) {
							downloadProgress = status.completed / status.total;
						}

						if (status.status === 'success') {
							await fetchOllamaModels();
							downloadStatus = null;
						}
					} catch (e) {
						console.error('Error parsing status:', e);
					}
				}
			}
		} catch (error: any) {
			console.error(`Failed to download ${modelName}:`, error);
			downloadStatus = { status: 'Error: ' + error.message };
		}
	}

	async function handleModelDownload(e: Event | MouseEvent | KeyboardEvent | SubmitEvent) {
		e.preventDefault();

		if (customModelName.trim()) {
			await downloadModel(customModelName.trim());
			customModelName = '';
		}
	}

	$effect(() => {
		if (llmConfig.provider === 'ollama') {
			checkOllamaAvailability();
		}
	});
</script>

{#if !isOllamaAvailable}
	<div class="not-detected-alert">
		<h3>Ollama Not Detected</h3>

		<p>Please install and run Ollama on your device to start using local LLMs.</p>

		<Button href="https://ollama.com/download" target="_blank">Download Ollama</Button>
	</div>
{:else}
	<div class="ollama-container">
		{#if showDownloadModel}
			<div class="model-download">
				<label>
					Model name

					<input
						disabled={!!downloadStatus}
						placeholder="e.g. deepseek-r1, qwen2.5, qwq, etc."
						type="text"
						onkeydown={(e) => e.key === 'Enter' && handleModelDownload(e)}
						bind:value={customModelName}
					/>
				</label>

				<span>
					Find available models

					<a href="https://ollama.com/library" target="_blank">here</a>
				</span>

				{#if downloadStatus}
					<div class="download-status">
						<p>{downloadStatus.status}</p>

						<span>
							WARNING: Please keep the extension popup open until the model download is complete
						</span>

						{#if downloadStatus.total}
							<progress value={downloadProgress} max="1"></progress>

							<span>{Math.round(downloadProgress * 100)}%</span>
						{/if}
					</div>
				{/if}

				<Button
					disabled={!customModelName?.trim() || !!downloadStatus}
					onclick={async (e) => await handleModelDownload(e)}
				>
					Download
				</Button>

				<Button kind="secondary" onclick={() => (showDownloadModel = !showDownloadModel)}>
					Cancel
				</Button>
			</div>
		{:else}
			<div class="add-new-model-cta">
				{#if ollamaModels.length > 0}
					<span>or</span>
				{/if}

				<Button onclick={() => (showDownloadModel = !showDownloadModel)} size="sm">
					{ollamaModels.length > 0 ? 'Add a new model' : 'Download a model to start'}
				</Button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.ollama-container {
		position: relative;
	}

	.not-detected-alert {
		display: grid;
		gap: 1rem;
		place-items: center;
		background: var(--bg-body);
		padding: 1.5rem;
		border-radius: 0.25rem;
	}

	.not-detected-alert h3 {
		font-size: 1.25rem;
		margin: 0;
	}

	.not-detected-alert p {
		margin-bottom: 1rem;
	}

	.add-new-model-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.download-status {
		display: grid;
		gap: 0.5rem;
	}

	progress {
		width: 100%;
		height: 0.5rem;
	}

	.model-download {
		display: grid;
		gap: 1rem;
	}
</style>
