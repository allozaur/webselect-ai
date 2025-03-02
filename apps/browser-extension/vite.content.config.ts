import { defineConfig } from 'vite';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true
			},
			extensions: ['.svelte']
		})
	],

	build: {
		outDir: 'build',
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'src/content.svelte.ts'),
			name: 'content',
			fileName: () => 'content.js',
			formats: ['iife']
		},
		rollupOptions: {
			output: {
				extend: true,
				inlineDynamicImports: true
			}
		}
	},

	resolve: {
		alias: {
			$lib: resolve(__dirname, 'src/lib')
		}
	}
});
