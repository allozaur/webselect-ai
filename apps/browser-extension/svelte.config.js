import { mdsvex } from 'mdsvex';
// @ts-expect-error - non-standard module export
import adapter from 'sveltekit-adapter-chrome-extension';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			manifest: 'manifest.json'
		}),
		appDir: 'app',
		env: {
			dir: '../../'
		},
		prerender: {
			entries: ['*'],
		},
	},

	extensions: ['.svelte', '.svx']
};

export default config;
