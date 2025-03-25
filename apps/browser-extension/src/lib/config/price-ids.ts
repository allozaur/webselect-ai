export const PRICE_IDS: {
    name: string;
    id: string;
    paymentType: 'subscription' | 'one-time';
}[] = [
        {
            name: 'Monthly Subscription',
            id: 'price_1R4gMiK3nWBBzoip2dxZIggk',
            paymentType: 'subscription'
        },
        {
            name: 'Annual Subscription',
            id: 'price_1R6WPvK3nWBBzoipTAIDtDiQ',
            paymentType: 'subscription'
        },
        { name: 'Lifetime License', id: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID, paymentType: 'one-time' }
    ];