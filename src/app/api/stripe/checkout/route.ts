import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { getStripe, billingEnabled, baseUrl } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** GET /api/stripe/checkout?p=mensal|anual — redireciona para o Stripe Checkout. */
export async function GET(req: NextRequest) {
  const url = baseUrl();
  if (!billingEnabled) return NextResponse.redirect(`${url}/#precos`);

  const session = authEnabled ? await auth() : null;
  const uid = session?.user?.id;
  if (!uid) return NextResponse.redirect(`${url}/login`);

  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) return NextResponse.redirect(`${url}/login`);
  if (user.plan === 'pro') return NextResponse.redirect(`${url}/definicoes`);

  const periodo = req.nextUrl.searchParams.get('p') === 'anual' ? 'anual' : 'mensal';
  const price = periodo === 'anual' ? process.env.STRIPE_PRICE_ANUAL : process.env.STRIPE_PRICE_MENSAL;
  if (!price) return NextResponse.redirect(`${url}/#precos`);

  const stripe = getStripe()!;
  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    locale: 'pt',
    allow_promotion_codes: true,
    client_reference_id: user.id,
    ...(user.stripeCustomerId
      ? { customer: user.stripeCustomerId }
      : { customer_email: user.email }),
    subscription_data: { metadata: { userId: user.id } },
    success_url: `${url}/definicoes?pro=1`,
    cancel_url: `${url}/#precos`,
  });

  return NextResponse.redirect(checkout.url!, 303);
}
