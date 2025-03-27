import type Stripe from 'stripe';
import { writable, type Writable } from 'svelte/store';

const customer: Writable<{
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
} | null> = writable(null);

export default customer;
