<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'UI/Atoms/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {}
	});
</script>

<Story name="Primary">
	<Button>Click me</Button>
</Story>
