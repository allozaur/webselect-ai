export default function injectFontLinks() {
	const links = [
		{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
		{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap'
		}
	];

	links.forEach((linkProps) => {
		const link = document.createElement('link');
		Object.entries(linkProps).forEach(([key, value]) => {
			link.setAttribute(key, value);
		});
		document.head.appendChild(link);
	});
}
