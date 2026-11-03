export const dynamic = 'force-dynamic';

export default function Verificar() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass luz" style={{ width: '100%', maxWidth: 420, borderRadius: 24, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg?v=2" alt="inread" style={{ height: 28, width: 'auto', margin: '0 auto 6px' }} />
        <h1 style={{ margin: 0, fontSize: 24 }}>Verifica o teu email</h1>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          Enviámos-te um link de acesso. Abre o email e clica em <strong>Entrar na minha caixa</strong> — o link é válido durante 24 horas.
        </p>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--faint)' }}>
          Não chegou? Espreita o spam, ou <a href="/login">pede um novo link</a>.
        </p>
      </div>
    </main>
  );
}
