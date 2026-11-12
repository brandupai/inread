import SiteShell from '@/components/SiteShell';

export const metadata = { title: 'Contactos — inread' };

export default function Contactos() {
  return (
    <SiteShell>
      <main style={{ width: '100%', maxWidth: 640, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: '4px 0 6px', fontSize: 'clamp(30px, 5vw, 42px)' }}>Contactos</h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
          Dúvidas, sugestões ou problemas com a tua conta? Escreve-nos — respondemos pessoalmente.
        </p>
        <a
          href="mailto:suporte@inread.app"
          className="glass"
          style={{ borderRadius: 18, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--quiet)' }}>Suporte e geral</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-dark)' }}>suporte@inread.app</span>
        </a>
        <div className="glass" style={{ borderRadius: 18, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--quiet)' }}>Redes sociais</span>
          <span style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
            Acompanha o inread no{' '}
            <a href="https://www.linkedin.com/company/inread/" target="_blank" rel="noopener noreferrer" data-umami-event="contactos-linkedin" style={{ fontWeight: 600 }}>
              LinkedIn ↗
            </a>{' '}
            — novidades, funcionalidades e bastidores.
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--quiet)' }}>
          Antes de escreveres, espreita as <a href="/faq" style={{ fontWeight: 600 }}>perguntas frequentes</a> — a resposta pode já lá estar.
        </p>
      </main>
    </SiteShell>
  );
}
