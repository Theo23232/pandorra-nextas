import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
// @ts-ignore
  apiVersion: '2024-09-30.acacia',
  typescript: true,
});
