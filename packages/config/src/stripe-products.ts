const stripeProducts = [
  {
    name: 'Yearly License',
    id: import.meta.env.VITE_STRIPE_1_YEAR_PRICE_ID,
    paymentType: 'subscription',
    price: '$29',
    discountPrice: '$9',
    description: '69% discount for first 100 users',
    note: 'One payment for full year access. Cancel anytime.',
    period: 'year'
  },
  {
    name: 'Lifetime License',
    id: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID,
    paymentType: 'one-time',
    price: '$69',
    discountPrice: '$39',
    description: '43% discount for first 100 users',
    note: 'Pay once to access all features and updates fovever.'
  }
];

export default stripeProducts;
