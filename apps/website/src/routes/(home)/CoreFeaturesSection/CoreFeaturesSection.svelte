<script>
	import CoreFeaturesSectionContent from './CoreFeaturesSectionContent.svx';
</script>

<section>
	<div>
		<h2>Choose your preferred LLM for content analysis</h2>
		<p>
			Connect any major AI model (OpenAI, Google's Gemini, or Ollama) using your own API key.
			Maintain complete control over your LLM usage and costs while ensuring data privacy. Direct,
			secure interaction with your chosen AI through WebSelect.ai's clean interface.
		</p>
	</div>

	<div>
		<h2>Browser-Based Privacy By Design</h2>
		<p>
			Your selected content never leaves your browser unnecessarily. All content is processed
			locally and then passed to LLM using your own API credentials – no external data storage,
			maximum privacy protection.
		</p>
	</div>

	<div>
		<h2>Flexible Content Processing Options</h2>
		<p>
			Choose between analyzing just the text or the full HTML structure of your selection. Get
			precise results tailored to your specific needs – whether you require raw content analysis or
			context-aware processing.
		</p>
	</div>
</section>

<style>
	section {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 5rem;
	}

	p {
		line-height: 1.5;
	}
</style>
