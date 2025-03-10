export default function getSelectionContent(selection: Selection): { text: string; html: string } {
	const text = selection.toString();
	let html = '';

	if (selection.rangeCount > 0) {
		const container = document.createElement('div');
		const range = selection.getRangeAt(0);
		container.appendChild(range.cloneContents());
		html = container.innerHTML;
	}

	return { text, html };
}
