<section class="faq">
	<h2>FAQ</h2>

	<details>
		<summary>How does WebSelect.ai function?</summary>
		<p>
			After installing our browser extension and connecting your preferred LLM API key, simply
			select content on any webpage. An interface appears with a prompt field where you can ask
			questions about your selection. The entire interaction occurs on the same page, maintaining
			your workflow continuity.
		</p>
	</details>

	<details>
		<summary>Is there a trial period available?</summary>
		<p>
			Yes, we offer a 7-day full-access trial as part of our launch promotion. No payment
			information is required to begin exploring all features and capabilities.
		</p>
	</details>

	<details>
		<summary>What differentiates text mode from HTML mode?</summary>
		<p>
			Text mode processes only the raw textual content, suitable for straightforward analysis. HTML
			mode includes structural elements such as headers, lists, and tables, providing the AI with
			context about content organization and relationships—particularly valuable for technical
			documentation or structured information.
		</p>
	</details>

	<details>
		<summary>Does the lifetime license include future updates?</summary>
		<p>
			Yes, the lifetime license provides perpetual access to WebSelect.ai including all future
			updates and technical support via email.
		</p>
	</details>

	<details>
		<summary>Which AI models are compatible with WebSelect.ai?</summary>
		<p>
			WebSelect.ai supports major AI platforms including OpenAI models, Google's Gemini, and local
			models via Ollama. You'll need to provide your own API key for cloud models, giving you
			complete control over usage costs and privacy settings.
		</p>
	</details>

	<details>
		<summary>How is my data handled?</summary>
		<p>
			Content processing occurs through your selected LLM provider using your personal API key.
			WebSelect.ai doesn't store your data on external servers—it simply facilitates the connection
			between your selected web content and your chosen AI service.
		</p>
	</details>

	<details>
		<summary>What is the technical process for content analysis?</summary>
		<p>The process follows four steps:</p>
		<ul>
			<li>WebSelect.ai captures your selected content in-browser</li>
			<li>Combines it with your specified prompt</li>
			<li>Transmits it to your selected LLM using your API key</li>
			<li>Displays results on the same page</li>
		</ul>
		<p>
			This creates a seamless experience similar to using an AI chat interface, but integrated
			directly within your browsing environment.
		</p>
	</details>

	<details>
		<summary>Does WebSelect.ai retain my selected content?</summary>
		<p>
			No. As a browser extension, WebSelect.ai operates entirely within your browser environment. We
			maintain no servers for content storage or processing. Data transmission occurs exclusively
			between your browser and your chosen LLM provider using your API credentials.
		</p>
	</details>

	<details>
		<summary>Is WebSelect.ai compatible with all websites?</summary>
		<p>
			WebSelect.ai functions with virtually any website that allows text selection, including news
			platforms, forums, documentation sites, and social media.
		</p>
	</details>

	<details>
		<summary>How are API costs managed?</summary>
		<p>
			You maintain responsibility for LLM API usage costs through your personal API key. Content
			analysis typically costs fractions of a cent per interaction, though costs vary based on your
			selected LLM model and the volume of processed content.
		</p>
	</details>

	<details>
		<summary>Which browsers currently support WebSelect.ai?</summary>
		<p>
			Chrome is currently supported, with Firefox and additional browser compatibility in
			development.
		</p>
	</details>

	<details>
		<summary>What are the content volume limitations?</summary>
		<p>
			Content processing limits depend on your chosen LLM's context window. For optimal results with
			most models, we recommend limiting selections to approximately 40,000 words.
		</p>
	</details>

	<details>
		<summary>Does WebSelect.ai support multiple languages?</summary>
		<p>
			WebSelect.ai can process content in any language supported by your selected LLM. Contemporary
			models generally offer robust multilingual capabilities.
		</p>
	</details>

	<details>
		<summary>What is your refund policy?</summary>
		<p>We provide a 14-day, no-questions-asked refund policy for all purchases.</p>
	</details>
</section>

<style>
	.faq {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	h2 {
		text-align: center;
		font-size: 2rem;
		margin: 0;

		@media (width > 768px) {
			font-size: 3rem;
		}
	}

	details {
		border-radius: 0.5rem;
		background-color: var(--surface-2);
	}

	details p {
		font-size: 1.125rem;
		line-height: 1.5;
	}

	summary {
		cursor: pointer;
		font-weight: bold;
		font-size: 1.375rem;
		font-weight: 500;
		list-style: none;
		color: var(--c-text-light);

		@media (width > 768px) {
			font-size: 1.625rem;
		}
	}

	details[open] summary {
		color: var(--hex-primary);
		margin-bottom: 1rem;
	}
</style>
