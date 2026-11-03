const colTitulo = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--quiet)',
  marginBottom: 4,
};

const colLink = { fontSize: 13.5, color: 'var(--ink-soft)' };

function Social({ nome, path }: { nome: string; path: string }) {
  return (
    <span
      title={`${nome} — brevemente`}
      style={{ width: 34, height: 34, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.55)', color: 'var(--brand-dark)', opacity: 0.55 }}
    >
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    </span>
  );
}

/** Rodapé do site público (homepage, FAQ, contactos, legais). */
export default function RodapeSite() {
  return (
    <footer style={{ width: '100%', maxWidth: 1120, margin: '48px auto 0', padding: '32px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.75)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 36, justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="inread" style={{ height: 24, width: 'auto', alignSelf: 'flex-start' }} />
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--quiet)', maxWidth: 260 }}>
            As tuas newsletters, fora da caixa de entrada. Privado por desenho — sem acesso ao teu email.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Social nome="X" path="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7zm-1.3 19.4h2L7.1 3.3h-2.2l12.7 17.3z" />
            <Social nome="Instagram" path="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 2.9a6.9 6.9 0 100 13.8 6.9 6.9 0 000-13.8zm0 2.5a4.4 4.4 0 110 8.8 4.4 4.4 0 010-8.8zm7.2-2.9a1.6 1.6 0 11-3.2 0 1.6 1.6 0 013.2 0z" />
            <Social nome="LinkedIn" path="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3-1.9 0-2.1 1.4-2.1 2.9v5.7H9.2V9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zM7.1 20.4H3.5V9h3.6v11.4z" />
          </div>
        </div>

        <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={colTitulo}>Produto</div>
          <a href="/login" style={colLink}>Ler na web</a>
          <a href="/#funcionalidades" style={colLink}>Funcionalidades</a>
          <a href="/#precos" style={colLink}>Preços</a>
          <span style={{ ...colLink, opacity: 0.55 }} title="Brevemente">Apps iPhone · Android · Mac · Windows</span>
        </div>

        <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={colTitulo}>Suporte</div>
          <a href="/faq" style={colLink}>Perguntas frequentes</a>
          <a href="/contactos" style={colLink}>Contactos</a>
        </div>

        <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={colTitulo}>Legal</div>
          <a href="/legal/privacidade" style={colLink}>Política de privacidade</a>
          <a href="/legal/termos" style={colLink}>Termos de utilização</a>
        </div>
      </div>

      <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.65)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, fontSize: 12.5, color: 'var(--faint)' }}>
        <span>© 2026 inread.app — feito na Europa 🇵🇹</span>
        <a href="/login" style={{ color: 'var(--faint)' }}>Entrar</a>
      </div>
    </footer>
  );
}
