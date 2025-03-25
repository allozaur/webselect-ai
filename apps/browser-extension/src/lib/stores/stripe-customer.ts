import type Stripe from 'stripe';
import { writable, type Writable, derived } from 'svelte/store';

const customer: Writable<{
    customer: Stripe.Customer;
    subscriptions: Stripe.Subscription[];
    sessions: (Stripe.Checkout.Session & { charges: Stripe.Charge[] })[];
} | null> = writable(null);

const hasActiveSubscription = derived(customer, ($customer) => {
    return !!$customer?.subscriptions.some((subscription) => subscription.status === 'active')
        || !!$customer?.sessions?.some((session) => (session.line_items?.data?.some((item) => item?.price?.id === import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID)
            && session?.charges?.every((charge) => !charge.refunded)))
})

export default customer;
export { hasActiveSubscription };
