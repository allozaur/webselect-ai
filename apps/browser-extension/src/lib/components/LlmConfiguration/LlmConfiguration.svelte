<script lang="ts">
	import { Button } from '@webcursor/ui';
	import LlmModelSelector from './LlmModelSelector.svelte';
	import { onMount } from 'svelte';

	let customModelName = $state('');
	let downloadStatus = $state<DownloadStatus | null>(null);
	let downloadProgress = $state<number>(0);
	let isOllamaAvailable = $state(false);
	let ollamaModels = $state<{ name: string }[]>([]);
	let selectedModelInfo = $state<ModelInfo | null>(null);
	let showDownloadModel = $state(false);

	let { llmConfig = $bindable({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' }) } =
		$props();

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

	async function handleChangeProvider() {
		llmConfig.model = '';
	}

	async function handleChangeHosting() {
		llmConfig.model = '';

		if (llmConfig.hosting === 'local') {
			llmConfig.provider = 'ollama';

			await fetchOllamaModels();
		} else {
			llmConfig.provider = '';
		}
	}

	async function handleModelDownload(e: Event | MouseEvent | KeyboardEvent | SubmitEvent) {
		e.preventDefault();

		if (customModelName.trim()) {
			await downloadModel(customModelName.trim());
			customModelName = '';
		}
	}

	async function fetchModelInfo(modelName: string) {
		try {
			const response = await fetch('http://localhost:11434/api/show', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: modelName })
			});

			if (!response.ok) throw new Error('Failed to fetch model info');

			const data = await response.json();
			selectedModelInfo = data;
		} catch (error) {
			console.error('Error fetching model info:', error);
			selectedModelInfo = null;
		}
	}

	async function handleModelSelect() {
		if (llmConfig.provider === 'ollama' && llmConfig.model) {
			await fetchModelInfo(llmConfig.model);
		} else {
			selectedModelInfo = null;
		}
	}

	onMount(async () => {
		chrome.storage.local.get('llm_config', async (result) => {
			llmConfig = result.llm_config ?? {
				apiKey: '',
				hosting: 'local',
				model: '',
				provider: 'ollama'
			};
		});
	});

	$effect(() => {
		if (llmConfig.provider === 'ollama') {
			checkOllamaAvailability();
		}
	});
</script>

<fieldset class="llm-configuration">
	<legend>LLM Configuration</legend>

	<fieldset class="hosting">
		<legend>Hosting</legend>

		<label>
			<input
				type="radio"
				name="llm_hosting"
				value="local"
				bind:group={llmConfig.hosting}
				onchange={handleChangeHosting}
			/>

			<span>Local</span>
		</label>

		<label>
			<input
				type="radio"
				name="llm_hosting"
				value="cloud"
				bind:group={llmConfig.hosting}
				onchange={handleChangeHosting}
			/>

			<span>Cloud</span>
		</label>
	</fieldset>

	<label>
		<span>Provider</span>

		<select name="llm_base_url" bind:value={llmConfig.provider} onchange={handleChangeProvider}>
			<option value="" selected disabled>Choose provider</option>

			{#if llmConfig.hosting === 'cloud'}
				<option value="anthropic" disabled>Anthropic</option>
				<option value="google">Google</option>
				<option value="openai">OpenAI</option>
			{:else if llmConfig.hosting === 'local'}
				<option selected value="ollama">Ollama</option>
			{/if}
		</select>
	</label>

	{#if llmConfig.hosting === 'cloud'}
		<label>
			<span>API Key</span>

			<span>
				Get your API key here:
				{#if llmConfig.provider === 'google'}
					<a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>
				{:else if llmConfig.provider === 'openai'}
					<a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>
				{/if}
			</span>

			<input
				name="llm_api_key"
				placeholder="e.g. 1234567890abcdef"
				type="password"
				bind:value={llmConfig.apiKey}
			/>
		</label>
	{/if}
	<LlmModelSelector {handleModelSelect} {ollamaModels} bind:llmConfig {showDownloadModel} />
	{#if llmConfig.hosting === 'local'}
		{#if !isOllamaAvailable}
			<div class="not-detected-alert">
				<h3>Ollama Not Detected</h3>

				<p>Please install and run Ollama on your device to start using local LLMs.</p>

				<Button href="https://ollama.com/download" target="_blank">Download Ollama</Button>
			</div>
		{:else}
			<div class="ollama-container">
				{#if selectedModelInfo && llmConfig.provider === 'ollama'}
					<details>
						<summary>Model Info</summary>

						<div class="model-info">
							<table>
								<tbody>
									<tr>
										<th>License</th>
										<td>{selectedModelInfo.license || 'N/A'}</td>
									</tr>
									<tr>
										<th>Size</th>
										<td>{(selectedModelInfo.size / 1024 / 1024 / 1024).toFixed(2)} GB</td>
									</tr>
									<tr>
										<th>Parameters</th>
										<td>{selectedModelInfo.parameters || 'N/A'}</td>
									</tr>
									<tr>
										<th>Digest</th>
										<td class="digest">{selectedModelInfo.digest || 'N/A'}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</details>
				{/if}

				<Button onclick={() => (showDownloadModel = !showDownloadModel)}>
					{showDownloadModel
						? 'close'
						: ollamaModels.length === 0
							? 'Download model to start'
							: 'Download more models'}
				</Button>

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
							Download model
						</Button>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
	<!-- {/if} -->
</fieldset>

<style>
	.llm-configuration {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
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

	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.hosting {
		display: flex;
		gap: 1rem;

		label {
			display: inline-flex;
			gap: 0.5rem;
		}
	}

	.model-info {
		padding: 1rem;
		border-radius: 4px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background: transparent;
		text-align: left;
		padding: 0.5rem;
		width: 100px;
		vertical-align: top;
	}

	td {
		background: transparent;
		padding: 0.5rem;
		vertical-align: top;
	}

	.digest {
		font-family: monospace;
		word-break: break-all;
	}

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
</style>
