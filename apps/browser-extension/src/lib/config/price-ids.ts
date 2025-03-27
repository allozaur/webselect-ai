export const PRICE_IDS: {
	name: string;
	id: string;
	paymentType: 'subscription' | 'one-time';
}[] = [
	{
		name: 'Monthly Subscription',
		id: 'price_1R74JFK3nWBBzoip3j2HqP0Z',
		paymentType: 'subscription'
	},
	{
		name: 'Yearly Subscription',
		id: 'price_1R74JwK3nWBBzoipbL5SUeJH',
		paymentType: 'subscription'
	},
	{
		name: 'Lifetime License',
		id: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID,
		paymentType: 'one-time'
	}
];
