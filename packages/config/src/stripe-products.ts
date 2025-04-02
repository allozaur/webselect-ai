const stripeProducts = [
  {
    name: 'Yearly License',
    id: import.meta.env.VITE_STRIPE_1_YEAR_PRICE_ID,
    paymentType: 'subscription',
    price: '$59',
    discountPrice: '$19',
    description: '68% discount for first 100 users',
    note: 'One payment for full year access. Cancel anytime.',
    period: 'year'
  },
  {
    name: 'Lifetime License',
    id: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID,
    paymentType: 'one-time',
    price: '$99',
    discountPrice: '$49',
    description: '51% discount for first 100 users',
    note: 'Pay once to access all features and updates fovever.'
  }
];

export default stripeProducts;
