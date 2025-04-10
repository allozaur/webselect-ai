import type Stripe from 'stripe';

export async function getStripeCustomer(email?: string): Promise<{
	customer: Stripe.Customer;
	subscriptions: Stripe.Subscription[];
	activeSubscription: {
		subscriptionType: 'day' | 'week' | 'month' | 'year' | 'lifetime' | null;
		isActive: boolean;
		url: string | null;
		period: {
			start: number;
			end: number;
		} | null;
		isTrial: boolean;
		hadFinishedTrialsBefore: boolean;
	} | null;
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

	return data;
}

export async function getStripeCheckoutURL(
	customerId: string,
	priceId: string,
	paymentType: 'subscription' | 'one-time'
) {
	const { url } = await fetch(import.meta.env.VITE_STRIPE_CHECKOUT_WORKER_ORIGIN, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			customerId,
			paymentType,
			priceId,
			promotionCode:
				import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID !== priceId
					? import.meta.env.VITE_STRIPE_1_YEAR_PROMOTION_CODE_ID
					: import.meta.env.VITE_STRIPE_LIFETIME_PROMOTION_CODE_ID,
			trial: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID !== priceId
		})
	}).then((res) => res.json());

	if (!url) {
		throw new Error('Failed to get stripe checkout URL');
	}

	window.open(url, '_blank');
}
