const colTitulo = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--quiet)',
  marginBottom: 4,
};

const colLink = { fontSize: 13.5, color: 'var(--ink-soft)' };

/** Rodapé do site público — ilha clara sobre o fundo escuro. */
export default function RodapeSite() {
  return (
    <footer className="luz" style={{ width: '100%', margin: '48px auto 0', padding: '32px 24px 28px', background: 'linear-gradient(165deg, #E4F0E5 0%, #EFF3EE 60%, #E9F1EC 100%)', borderRadius: '34px 34px 0 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
      <div className="rodape-cols" style={{ display: 'flex', flexWrap: 'wrap', gap: 36, justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg?v=3" alt="inread" width={40} height={40} style={{ height: 40, width: 40, alignSelf: 'flex-start' }} />
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--quiet)', maxWidth: 260 }}>
            As tuas newsletters, fora da caixa de entrada. Privado por desenho — sem acesso ao teu email.
          </p>
          <a
            href="https://www.linkedin.com/company/inread/"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="rodape-linkedin"
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, padding: '7px 14px 7px 7px', border: '1px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 8, background: '#0A66C2', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3-1.9 0-2.1 1.4-2.1 2.9v5.7H9.2V9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zM7.1 20.4H3.5V9h3.6v11.4z" />
              </svg>
            </span>
            Acompanha o inread no LinkedIn
          </a>
          <a
            href="https://www.producthunt.com/products/inread-app"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="rodape-producthunt"
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, padding: '7px 14px 7px 7px', border: '1px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}
          >
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 40 40" style={{ flex: '0 0 auto' }}>
              <circle cx="20" cy="20" r="20" fill="#DA552F" />
              <path fill="#fff" d="M22.667 20H17v-6h5.667a3 3 0 010 6m0-10H13v20h4v-6h5.667a7 7 0 000-14" />
            </svg>
            inread no Product Hunt
          </a>
          <a
            href="https://alternativeto.net/software/inread/"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="rodape-alternativeto"
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, padding: '7px 14px 7px 7px', border: '1px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/alternativeto.svg" alt="" width={28} height={28} style={{ width: 28, height: 28, flex: '0 0 auto' }} />
            inread no AlternativeTo
          </a>
        </div>

        <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={colTitulo}>Produto</div>
          <a href="/login" style={colLink}>Ler na web</a>
          <a href="/#funcionalidades" style={colLink}>Funcionalidades</a>
          <a href="/integracoes" style={colLink}>Integrações</a>
          <a href="/#precos" style={colLink}>Preços</a>
        </div>

        <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={colTitulo}>Recursos</div>
          <a href="/blog" style={colLink}>Blog</a>
          <a href="/changelog" style={colLink}>Changelog</a>
          <a href="/ajuda" style={colLink}>Ajuda</a>
          <a href="/docs" style={colLink}>Documentação</a>
        </div>

        <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={colTitulo}>Criadores</div>
          <a href="/parceiros" style={colLink}>Programa de parceiros</a>
          <a href="/parceiros" style={colLink}>Submeter newsletter</a>
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
          <a href="https://www.livroreclamacoes.pt/inicio" target="_blank" rel="noopener noreferrer" style={colLink}>Livro de Reclamações</a>
        </div>
      </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '28px auto 0', paddingTop: 16, borderTop: '1px solid rgba(48,73,63,0.15)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, fontSize: 12.5, color: 'var(--faint)' }}>
        <span>© 2026 inread.app — feito na Europa 🇵🇹</span>
        <a href="/login" style={{ color: 'var(--faint)' }}>Entrar</a>
      </div>
    </footer>
  );
}
