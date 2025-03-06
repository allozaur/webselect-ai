import type { StorybookConfig } from '@storybook/sveltekit';

import { join, dirname } from 'path';

function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		getAbsolutePath('@storybook/addon-essentials'),
		'@storybook/addon-svelte-csf',
		getAbsolutePath('@chromatic-com/storybook')
	],
	framework: {
		name: getAbsolutePath('@storybook/sveltekit'),
		options: {}
	}
};
export default config;
