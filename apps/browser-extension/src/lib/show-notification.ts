export default function showNotification(message: string, type = 'info'): void {
	const notification = document.createElement('div');
	notification.className = `markmaster-notification markmaster-${type}`;
	notification.textContent = message;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.classList.add('markmaster-fade-out');
		setTimeout(() => {
			notification.remove();
		}, 500);
	}, 3000);
}
