export const PRICE_IDS: {
	name: string;
	id: string;
	paymentType: 'subscription' | 'one-time';
}[] = [
	{
		name: '1-Year License',
		id: import.meta.env.VITE_STRIPE_1_YEAR_PRICE_ID,
		paymentType: 'subscription'
	},
	{
		name: 'Lifetime License',
		id: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID,
		paymentType: 'one-time'
	}
];
