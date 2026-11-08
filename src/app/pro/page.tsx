import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { billingEnabled } from '@/lib/stripe';
import SiteShell from '@/components/SiteShell';
import PlanoPro from '@/components/PlanoPro';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Pro — inread' };

export default async function Pro() {
  let entrou = false;
  if (authEnabled) {
    const session = await auth();
    if (session?.user?.id) {
      entrou = true;
      const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } });
      if (user?.plan === 'pro') redirect('/definicoes');
    }
  }
  const ativo = entrou && billingEnabled;

  return (
    <SiteShell>
      <main style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: '48px 20px 24px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 8vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em' }}>
            Passa ao Pro. <span className="voz" style={{ color: '#15B832', fontWeight: 400 }}>Fica teu.</span>
          </h1>
          <p style={{ margin: 0, fontSize: 15.5, color: 'var(--ink-soft)' }}>
            Escolhe mensal ou anual. No anual pagas uma vez e poupas €9,89 — são 2 meses grátis.
          </p>
        </header>
        <PlanoPro entrou={entrou} billing={billingEnabled} hrefMensal={ativo ? '/api/stripe/checkout?p=mensal' : '/login'} hrefAnual={ativo ? '/api/stripe/checkout?p=anual' : '/login'} />
        <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: 'var(--faint)' }}>
          IVA incluído · pagamento seguro via Stripe · cancelas quando quiseres e exportas tudo antes de sair.
        </p>
      </main>
    </SiteShell>
  );
}
