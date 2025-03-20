import { PUBLIC_STRIPE_CUSTOMER_VERIFICATION_WORKER_URL } from "$env/static/public";

export async function getStripeCustomer(email?: string) {
    if (!email) {
        throw new Error('Email is required');
    }

    const res = await fetch(PUBLIC_STRIPE_CUSTOMER_VERIFICATION_WORKER_URL, {
        method: 'POST',
        body: JSON.stringify({
            email
        })
    })

    if (!res.ok) {
        throw new Error('Failed to get stripe customer');
    }

    const data = await res.json();

    return data;
}