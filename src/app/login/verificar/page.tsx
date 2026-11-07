export const dynamic = 'force-dynamic';

export default async function Verificar({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const email = e?.trim() || '';

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass luz" style={{ width: '100%', maxWidth: 440, borderRadius: 24, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg?v=2" alt="inread" style={{ height: 28, width: 'auto', margin: '0 auto 6px' }} />
        <h1 style={{ margin: 0, fontSize: 24 }}>Verifica o teu email</h1>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          Enviámos-te um link de acesso{email ? <> para <strong>{email}</strong></> : ''}. Clica em{' '}
          <strong>Entrar na minha caixa</strong> — ou escreve aqui o código de 6 dígitos do email.
        </p>

        {email && (
          <form action="/api/auth/callback/nodemailer" method="get" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            <input type="hidden" name="callbackUrl" value="/caixa" />
            <input type="hidden" name="email" value={email} />
            <input
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              placeholder="000000"
              aria-label="Código de 6 dígitos"
              style={{
                width: '100%', height: 52, borderRadius: 14, border: '1px solid rgba(9,87,44,0.3)',
                background: 'rgba(255,255,255,0.85)', textAlign: 'center', fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: 24, fontWeight: 700, letterSpacing: '0.4em', color: 'var(--brand-dark)', outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{ height: 46, borderRadius: 999, border: 'none', background: 'var(--brand-dark)', color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
            >
              Entrar com o código
            </button>
          </form>
        )}

        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--faint)' }}>
          O código é válido durante 15 minutos. Não chegou? Espreita o spam (e marca "Não é spam" — ajuda os próximos), ou{' '}
          <a href="/login">pede um novo</a>.
        </p>
      </div>
    </main>
  );
}
