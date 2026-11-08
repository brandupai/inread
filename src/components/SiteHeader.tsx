import { authEnabled } from '@/auth';
import HeaderConta from './HeaderConta';

const INK = '#15160F';

const LINKS: [string, string][] = [
  ['/#funcionalidades', 'Funcionalidades'],
  ['/#instalar', 'Instalar'],
  ['/#precos', 'Preços'],
  ['/blog', 'Blog'],
  ['/faq', 'FAQ'],
];

/** Cabeçalho do site público — estático (sem sessão no servidor) e com menu compacto no telemóvel. */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <a href="/" style={{ display: 'inline-flex' }} aria-label="inread — início">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg?v=2" alt="inread" width={96} height={26} style={{ height: 26, width: 'auto' }} />
      </a>
      <nav className="sh-links" aria-label="Navegação" style={{ color: INK }}>
        {LINKS.map(([href, t]) => (
          <a key={href} href={href} style={{ color: INK }}>{t}</a>
        ))}
      </nav>
      <div className="sh-conta">
        <HeaderConta authEnabled={authEnabled} />
        <details className="sh-menu">
          <summary aria-label="Menu">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </summary>
          <nav className="sh-painel" aria-label="Menu">
            {LINKS.map(([href, t]) => (
              <a key={href} href={href} style={{ color: INK }}>{t}</a>
            ))}
            <a href="/changelog" style={{ color: INK }}>Changelog</a>
            <a href="/docs" style={{ color: INK }}>Documentação</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
