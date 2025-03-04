export default function isFormFocused(formContainer: HTMLDivElement | null): boolean {
	return formContainer?.contains(document.activeElement) ?? false;
}
