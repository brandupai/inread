import Stripe from 'stripe';

/** Cliente Stripe (null quando as chaves ainda não estão configuradas). */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const billingEnabled = Boolean(
  process.env.STRIPE_SECRET_KEY && (process.env.STRIPE_PRICE_MENSAL || process.env.STRIPE_PRICE_ANUAL)
);

export function baseUrl(): string {
  return process.env.AUTH_URL || 'https://inread.app';
}
