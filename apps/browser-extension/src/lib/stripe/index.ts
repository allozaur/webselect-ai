import type Stripe from "stripe";

export async function getStripeCustomer(email?: string): Promise<{
	customer: Stripe.Customer;
	subscriptions: Stripe.Subscription[];
	sessions: (Stripe.Checkout.Session & { charges: Stripe.Charge[] })[];
}> {
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

	return {
		...data
	};
}

export async function getStripeCheckoutURL(customerId: string, priceId: string, paymentType: 'subscription' | 'one-time') {
	const { url } = await fetch(import.meta.env.VITE_STRIPE_CHECKOUT_WORKER_ORIGIN, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			customerId,
			priceId,
			paymentType
		})
	}).then((res) => res.json());


	if (!url) {
		throw new Error('Failed to get stripe checkout URL');
	}

	window.open(url, '_blank');
}