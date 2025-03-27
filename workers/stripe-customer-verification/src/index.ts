import Stripe from 'stripe';

interface Env {
	CORS_ORIGIN: string;
	STRIPE_SECRET_KEY: string;
	STRIPE_LIFETIME_PRICE_ID: string;
}

interface RequestBody {
	email: string;
}

const corsHeaders = (env: Env) => ({
	'Access-Control-Allow-Origin': env.CORS_ORIGIN,
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
});

async function handleOptions(request: Request, env: Env): Promise<Response> {
	const headers = new Headers(request.headers);

	if (headers.get('Origin') && headers.get('Access-Control-Request-Method') && headers.get('Access-Control-Request-Headers')) {
		return new Response(null, {
			headers: {
				...corsHeaders(env),
				'Access-Control-Allow-Headers': headers.get('Access-Control-Request-Headers')!,
			},
		});
	} else {
		return new Response(null, {
			headers: {
				Allow: 'GET, HEAD, POST, OPTIONS',
			},
		});
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return handleOptions(request, env);
		}

		if (request.method !== 'POST') {
			return new Response('Method not allowed', {
				status: 405,
				headers: corsHeaders(env),
			});
		}

		try {
			const body: RequestBody = await request.json();

			if (!body.email) {
				return new Response('Email is required', {
					status: 400,
					headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
				});
			}

			const stripe = new Stripe(env.STRIPE_SECRET_KEY);

			let customer: Stripe.Customer | undefined;

			const customerRes = await stripe.customers.list({
				email: body.email,
				limit: 1,
			});

			if (!customerRes?.data.length) {
				customer = await stripe.customers.create({
					email: body.email,
				});
			} else {
				customer = customerRes.data[0];
			}

			const invoices = await stripe.invoices.list({
				customer: customer.id,
				limit: 100,
			});

			const products = [];

			for (const invoice of invoices.data) {
				const invoiceItems = await stripe.invoiceItems.list({
					invoice: invoice.id,
				});

				for (const item of invoiceItems.data) {
					products.push({
						description: item.description,
						amount: item.amount,
						currency: item.currency,
					});
				}
			}

			const subscriptions = [];

			const subscriptionsRes = await stripe.subscriptions.list({
				customer: customer.id,
				limit: 100,
			});

			for (const subscription of subscriptionsRes.data) {
				subscriptions.push(subscription);
			}

			const charges = (
				await stripe.charges.list({
					customer: customer.id,
					limit: 100,
				})
			).data;

			const sessions = (
				await stripe.checkout.sessions.list({
					customer: customer.id,
					limit: 100,
					expand: ['data.line_items', 'data.payment_intent'],
				})
			).data
				.filter((session) => session.payment_status === 'paid')
				.map((session) => ({
					...session,
					charges: charges.filter(
						(charge) =>
							charge.payment_intent === (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id),
					),
				}));

			const subscription = subscriptions.find((subscription) => subscription.status === 'active' || subscription.status === 'trialing');
			const isTrial = subscription?.status === 'trialing';
			const isLifeTime = sessions.some(
				(session) =>
					session.line_items?.data?.some((item) => item?.price?.id === env.STRIPE_LIFETIME_PRICE_ID) &&
					session?.charges?.every((charge) => !charge.refunded),
			);

			const hasActiveSubscription = subscription || isLifeTime;

			const activeSubscription: {
				subscriptionType: 'day' | 'week' | 'month' | 'year' | 'lifetime' | null;
				isActive: any;
				url: string | null;
				period: {
					start: number;
					end: number;
				} | null;
				isTrial: boolean;
				hadFinishedTrialsBefore: boolean;
			} = {
				subscriptionType: (isLifeTime ? 'lifetime' : subscription?.items.data[0].plan.interval) || null,
				isActive: hasActiveSubscription,
				url: null,
				period: null,
				isTrial: isTrial,
				hadFinishedTrialsBefore: false,
			};

			const hadFinishedTrialsBefore = subscriptions.some((subscription) => subscription.status === 'trialing' && subscription.current_period_end < Date.now());

			if (subscription) {
				const session = await stripe.billingPortal.sessions.create({
					customer: customer.id,
				});

				const subscribptionFrom = subscription?.current_period_start;
				const subscribptionTo = subscription?.current_period_end;

				activeSubscription.period = {
					start: subscribptionFrom,
					end: subscribptionTo,
				};

				activeSubscription.url = session.url;
				activeSubscription.hadFinishedTrialsBefore = hadFinishedTrialsBefore;
			}

			return new Response(JSON.stringify({ success: true, customer, subscriptions, activeSubscription, sessions }), {
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders(env),
				},
			});
		} catch (error) {
			console.error('Error:', error);

			return new Response(
				JSON.stringify({
					success: false,
					message: 'Internal server error',
					error: error instanceof Error ? error.message : 'Unknown error',
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders(env),
					},
				},
			);
		}
	},
};
