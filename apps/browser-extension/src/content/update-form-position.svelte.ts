export default function updateFormPosition(
	selection: Selection,
	formContainer: HTMLDivElement | null
) {
	if (!formContainer) return;

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();

	formContainer.style.position = 'absolute';
	formContainer.style.left = `${rect.left + window.scrollX}px`;
	formContainer.style.top = `${rect.bottom + window.scrollY + 10}px`;
}
