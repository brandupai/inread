import type { ReactNode } from 'react';
import { DOCS } from '@/lib/docs';
import SiteShell from '@/components/SiteShell';

export const metadata = { title: 'Documentação — inread' };

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', width: '100%', maxWidth: 1120, margin: '0 auto', padding: '40px 22px 72px', gap: 36 }}>
        <nav aria-label="Documentação" style={{ flex: '0 0 230px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {DOCS.map((s) => (
            <div key={s.titulo}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--faint)', padding: '0 10px 7px' }}>
                {s.titulo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {s.paginas.map((p) => (
                  <a key={p.slug} href={`/docs/${p.slug}`} style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-soft)', padding: '6px 10px', borderRadius: 9 }}>
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
    </SiteShell>
  );
}
