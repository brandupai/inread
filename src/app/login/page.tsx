import { redirect } from 'next/navigation';
import { auth, signIn, authEnabled, magicLinkEnabled, googleEnabled } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  if (!authEnabled) redirect('/caixa');
  const session = await auth();
  if (session?.user) redirect('/caixa');

  async function magicLink(formData: FormData) {
    'use server';
    await signIn('nodemailer', { email: String(formData.get('email') ?? ''), redirectTo: '/caixa' });
  }

  async function google() {
    'use server';
    await signIn('google', { redirectTo: '/caixa' });
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 420, borderRadius: 24, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 18px 50px rgba(52,78,65,0.14)' }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
          inread<span style={{ color: 'var(--brand)' }}>.</span>
        </div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
          Entra na tua caixa de leitura. Sem passwords — enviamos-te um link de acesso.
        </p>
        {error && (
          <p style={{ margin: 0, fontSize: 13, color: '#8A3B3B', background: 'rgba(217,160,160,0.25)', border: '1px solid rgba(217,160,160,0.6)', borderRadius: 10, padding: '10px 12px' }}>
            Não foi possível iniciar sessão. Tenta novamente.
          </p>
        )}
        {magicLinkEnabled && (
          <form action={magicLink} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label htmlFor="email" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--quiet)' }}>
              O teu email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@exemplo.com"
              style={{ boxSizing: 'border-box', width: '100%', height: 46, border: '1px solid #D9DBD4', borderRadius: 12, background: '#FFFFFF', padding: '0 14px', fontSize: 15, fontFamily: 'inherit', color: 'var(--ink)' }}
            />
            <button
              type="submit"
              style={{ height: 46, border: 'none', borderRadius: 999, background: 'var(--brand-dark)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
            >
              Enviar link de acesso
            </button>
          </form>
        )}
        {magicLinkEnabled && googleEnabled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--faint)', fontSize: 12 }}>
            <span style={{ flex: 1, height: 1, background: '#D9DBD4' }}></span>ou
            <span style={{ flex: 1, height: 1, background: '#D9DBD4' }}></span>
          </div>
        )}
        {googleEnabled && (
          <form action={google}>
            <button
              type="submit"
              style={{ width: '100%', height: 46, border: '1px solid #D9DBD4', borderRadius: 999, background: '#FFFFFF', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}
            >
              Continuar com o Google
            </button>
          </form>
        )}
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--faint)' }}>
          Ao entrar crias a tua conta e o teu alias privado @inread.app. Grátis até 50 newsletters.
        </p>
      </div>
    </main>
  );
}
