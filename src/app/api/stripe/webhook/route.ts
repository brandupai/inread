import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** POST /api/stripe/webhook — eventos do Stripe (assinados). */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: 'not configured' }, { status: 503 });

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.client_reference_id;
        if (userId && s.mode === 'subscription') {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'pro',
              stripeCustomerId: typeof s.customer === 'string' ? s.customer : s.customer?.id,
              stripeSubscriptionId: typeof s.subscription === 'string' ? s.subscription : s.subscription?.id,
            },
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        const ativo = sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due';
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: ativo ? 'pro' : 'free', stripeSubscriptionId: sub.id },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: 'free', stripeSubscriptionId: null },
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('[stripe webhook]', event.type, err);
    return NextResponse.json({ error: 'handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
