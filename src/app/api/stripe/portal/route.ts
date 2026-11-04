import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { getStripe, baseUrl } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** GET /api/stripe/portal — abre o portal do cliente Stripe (gerir/cancelar subscrição). */
export async function GET() {
  const url = baseUrl();
  const stripe = getStripe();
  if (!stripe) return NextResponse.redirect(`${url}/definicoes`);

  const session = authEnabled ? await auth() : null;
  const uid = session?.user?.id;
  if (!uid) return NextResponse.redirect(`${url}/login`);

  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user?.stripeCustomerId) return NextResponse.redirect(`${url}/definicoes`);

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${url}/definicoes`,
  });

  return NextResponse.redirect(portal.url, 303);
}
