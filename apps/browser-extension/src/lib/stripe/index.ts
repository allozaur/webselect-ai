export async function getStripeCustomer(email?: string) {
	if (!email) {
		throw new Error('Email is required');
	}

	const res = await fetch(import.meta.env.VITE_STRIPE_CUSTOMER_VERIFICATION_WORKER_ORIGIN, {
		method: 'POST',
		body: JSON.stringify({
			email
		})
	});

	if (!res.ok) {
		throw new Error('Failed to get stripe customer');
	}

	const data = await res.json();

	return data;
}
