<script lang="ts">
	import { Button } from '@webcursor/ui';
	import { onMount } from 'svelte';

	let llmConfig = $state({ apiKey: '', hosting: 'local', model: '', provider: 'ollama' });
	let ollamaModels = $state<{ name: string }[]>([]);
	let customModelName = $state('');

	const suggestedModels = [
		{ name: 'qwen2.5:latest', label: 'Qwen 2.5' },
		{ name: 'qwen2.5-coder:latest', label: 'Qwen 2.5 Coder' },
		{ name: 'qwq', label: 'QWQ' },
		{ name: 'deepseek-r1:latest', label: 'Deepseek R1' }
	];

	onMount(() => {
		chrome.storage.local.get('llm_config', (result) => {
			llmConfig = result.llm_config ?? {
				apiKey: '',
				hosting: 'local',
				model: '',
				provider: 'ollama'
			};
			if (llmConfig.provider === 'ollama') {
				fetchOllamaModels();
			}
		});
	});

	async function fetchOllamaModels() {
		try {
			const response = await fetch('http://localhost:11434/api/tags');
			const data = await response.json();
			ollamaModels = data.models;
		} catch (error) {
			console.error('Failed to fetch Ollama models:', error);
			ollamaModels = [];
		}
	}

	let downloadStatus = $state<DownloadStatus | null>(null);
	let downloadProgress = $state<number>(0);

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

	function handleChangeValue() {
		chrome.storage.local.set({
			llm_config: llmConfig
		});
	}

	async function handleChangeProvider() {
		handleChangeValue();
		llmConfig.model = '';
	}

	async function handleChangeHosting() {
		handleChangeValue();

		if (llmConfig.hosting === 'local') {
			llmConfig.provider = 'ollama';

			await fetchOllamaModels();
		} else {
			llmConfig.provider = 'google';
		}
	}

	async function handleModelDownload(e: Event | MouseEvent | KeyboardEvent | SubmitEvent) {
		e.preventDefault();

		if (customModelName.trim()) {
			await downloadModel(customModelName.trim());
			customModelName = '';
		}
	}
</script>

<fieldset class="llm-choice">
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
				oninput={handleChangeValue}
				placeholder="e.g. 1234567890abcdef"
				type="password"
				bind:value={llmConfig.apiKey}
			/>
		</label>
	{:else if llmConfig.hosting === 'local'}
		{#if downloadStatus}
			<div class="download-status">
				<p>{downloadStatus.status}</p>
				{#if downloadStatus.total}
					<progress value={downloadProgress} max="1"></progress>
					<span>{Math.round(downloadProgress * 100)}%</span>
				{/if}
			</div>
		{/if}

		<div class="model-download">
			<div class="suggested-models">
				{#each suggestedModels as model}
					<Button onclick={async () => await downloadModel(model.name)} disabled={!!downloadStatus}>
						{model.label}
					</Button>
				{/each}
			</div>

			<label>
				Model name

				<input
					disabled={!!downloadStatus}
					placeholder="Enter model name (e.g. llama3:7b)"
					type="text"
					onkeydown={(e) => e.key === 'Enter' && handleModelDownload(e)}
					bind:value={customModelName}
				/>
			</label>

			{#if customModelName?.trim()}
				<Button disabled={!!downloadStatus} onclick={async (e) => await handleModelDownload(e)}>
					Download model
				</Button>
			{/if}
		</div>
	{/if}

	<label>
		<span>Model</span>

		<select name="llm_model" bind:value={llmConfig.model} onchange={handleChangeValue}>
			<option value="" selected disabled>Choose model</option>

			{#if llmConfig.provider === 'ollama'}
				{#each ollamaModels as model}
					<option value={model.name}>{model.name}</option>
				{/each}
			{:else if llmConfig.provider === 'google'}
				<option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
				<option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
				<option value="gemini-2.0-flash-lite">Gemini 2.0 Flash-Lite</option>
				<option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
				<option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro (Experimental)</option>
			{:else if llmConfig.provider === 'anthropic'}
				<option value="claude-3-7-sonnet-latest">Claude 3.7 Sonnet</option>
				<option value="claude-3-5-sonnet-latest">Claude 3.5 Sonnet</option>
				<option value="claude-3-5-haiku-latest">Claude 3.5 Haiku</option>
			{:else if llmConfig.provider === 'openai'}
				<option value="gpt-4o">GPT-4o</option>
				<option value="gpt-4o-mini">GPT-4o mini</option>
				<option value="gpt-4-turbo">GPT-4 Turbo</option>
			{/if}
		</select>
	</label>
</fieldset>

<style>
	.llm-choice {
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

	.suggested-models {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
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
</style>
