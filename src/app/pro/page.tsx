import type { CSSProperties } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { billingEnabled } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const ACID = '#1BE03C';
const INK_DARK = '#0B140F';

const quiet: CSSProperties = { color: 'rgba(232,242,234,0.66)' };
const faint: CSSProperties = { color: 'rgba(232,242,234,0.45)' };

function Beneficio({ texto }: { texto: string }) {
  return (
    <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACID} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: 3 }}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <span>{texto}</span>
    </li>
  );
}

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

  const hrefMensal = entrou && billingEnabled ? '/api/stripe/checkout?p=mensal' : '/login';
  const hrefAnual = entrou && billingEnabled ? '/api/stripe/checkout?p=anual' : '/login';

  const cartao: CSSProperties = {
    flex: '1 1 300px',
    minWidth: 0,
    borderRadius: 26,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };

  return (
    <main style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '34px 24px 80px', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', width: 560, height: 560, top: -200, left: '50%', marginLeft: -280, borderRadius: '50%', filter: 'blur(90px)', background: 'radial-gradient(circle at 50% 50%, rgba(27,224,60,0.22) 0%, rgba(11,20,15,0) 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <a href={entrou ? '/definicoes' : '/'} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-light)' }}>‹ Voltar</a>

        <header style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5.4vw, 52px)', fontWeight: 700, letterSpacing: '-0.015em', color: '#F4FAF5' }}>
            Passa ao Pro. <span className="voz" style={{ color: ACID, fontWeight: 400 }}>Fica teu para sempre.</span>
          </h1>
          <p style={{ margin: 0, fontSize: 15.5, ...quiet }}>
            Preço de lançamento até ao final do ano — quem aderir agora mantém este valor enquanto for assinante.
          </p>
        </header>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'stretch' }}>
          {/* Mensal */}
          <div className="glass" style={cartao}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F4FAF5' }}>Mensal</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 19, fontWeight: 600, textDecoration: 'line-through', ...faint }}>€7,99</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, lineHeight: 1, color: '#F4FAF5' }}>€4,99</span>
              <span style={{ fontSize: 14, ...quiet }}>/mês</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, ...quiet }}>
              <Beneficio texto="Armazenamento ilimitado" />
              <Beneficio texto="Resumos com IA e áudio diário" />
              <Beneficio texto="Alias personalizado à tua escolha" />
              <Beneficio texto="Exportações avançadas (Notion, Obsidian)" />
            </ul>
            <a href={hrefMensal} style={{ marginTop: 'auto', textAlign: 'center', border: `1px solid ${ACID}`, borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 700, color: ACID }}>
              Ativar o Pro mensal
            </a>
          </div>

          {/* Anual */}
          <div style={{ ...cartao, background: `linear-gradient(160deg, ${ACID}, #17C434)`, color: INK_DARK, boxShadow: '0 0 60px rgba(27,224,60,0.3), 0 24px 56px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Anual</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: ACID, background: INK_DARK, borderRadius: 999, padding: '4px 11px' }}>2 meses grátis</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, lineHeight: 1 }}>€49,99</span>
              <span style={{ fontSize: 14, color: 'rgba(11,20,15,0.65)' }}>/ano · ≈ €4,17/mês</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, color: 'rgba(11,20,15,0.85)' }}>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={INK_DARK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: 3 }}><path d="M20 6L9 17l-5-5" /></svg>
                <span>Tudo o que o mensal tem</span>
              </li>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={INK_DARK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: 3 }}><path d="M20 6L9 17l-5-5" /></svg>
                <span>Poupas €9,89 por ano face ao mensal</span>
              </li>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={INK_DARK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: 3 }}><path d="M20 6L9 17l-5-5" /></svg>
                <span>Um pagamento, zero preocupações</span>
              </li>
            </ul>
            <a href={hrefAnual} style={{ marginTop: 'auto', textAlign: 'center', background: INK_DARK, borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 700, color: ACID }}>
              Ativar o Pro anual
            </a>
          </div>
        </div>

        <p style={{ margin: 0, textAlign: 'center', fontSize: 13, ...faint }}>
          IVA incluído · pagamento seguro via Stripe · cancelas quando quiseres e exportas tudo antes de sair.
        </p>
      </div>
    </main>
  );
}
