import type { ReactNode } from 'react';
import SiteHeader from './SiteHeader';
import RodapeSite from './RodapeSite';

/** Moldura das páginas do site público: fundo claro, cabeçalho e rodapé do site. */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="sd luz sd-shell" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="sd-aurora" aria-hidden="true">
        <div className="sd-orb" style={{ width: 640, height: 640, top: -240, left: '50%', marginLeft: -320, opacity: 0.5, background: 'radial-gradient(circle at 50% 45%, rgba(21,184,50,0.2) 0%, rgba(21,184,50,0.07) 45%, rgba(241,240,235,0) 72%)' }} />
        <div className="sd-orb sd-orb2" style={{ width: 480, height: 480, top: 520, right: -180, opacity: 0.4, background: 'radial-gradient(circle at 50% 50%, rgba(21,184,50,0.14) 0%, rgba(241,240,235,0) 70%)' }} />
      </div>
      <SiteHeader />
      <div style={{ position: 'relative', zIndex: 1, flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>{children}</div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 10 }}>
        <RodapeSite />
      </div>
    </div>
  );
}
