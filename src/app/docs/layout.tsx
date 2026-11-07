import type { ReactNode } from 'react';
import { DOCS } from '@/lib/docs';

export const metadata = { title: 'Documentação — inread' };

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src="/logo-w.svg?v=2" alt="inread" style={{ height: 20, width: 'auto' }} />
        </a>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(232,242,234,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Documentação</span>
        <div style={{ flex: 1 }} />
        <a href="/caixa" style={{ fontSize: 13, fontWeight: 700, color: '#0B140F', background: '#1BE03C', borderRadius: 999, padding: '8px 16px' }}>Abrir a caixa</a>
      </header>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', width: '100%', maxWidth: 1120, margin: '0 auto', padding: '26px 22px 72px', gap: 36 }}>
        <nav aria-label="Documentação" style={{ flex: '0 0 230px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {DOCS.map((s) => (
            <div key={s.titulo}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,242,234,0.45)', padding: '0 10px 7px' }}>
                {s.titulo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {s.paginas.map((p) => (
                  <a key={p.slug} href={`/docs/${p.slug}`} style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(232,242,234,0.8)', padding: '6px 10px', borderRadius: 9 }}>
                    {p.titulo}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <main className="docs-prosa" style={{ flex: '1 1 480px', minWidth: 0, maxWidth: 680 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
