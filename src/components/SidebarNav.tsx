'use client';

import { useEffect, useState } from 'react';

type Item = {
  chave: string;
  rotulo: string;
  href: string;
  icone: string;
  badge?: number;
  brevemente?: boolean;
};

const ICONES: Record<string, string> = {
  caixa: 'M3 8l9-5 9 5v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm0 1l9 6 9-6',
  guardados: 'M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z',
  audio: 'M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zm10-2a3 3 0 11-6 0 3 3 0 016 0z',
  descobrir: 'M12 21a9 9 0 110-18 9 9 0 010 18zm3.5-12.5L14 14l-5.5 1.5L10 10l5.5-1.5z',
  remetentes: 'M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m14-13a4 4 0 11-8 0 4 4 0 018 0zm4 13v-1a4 4 0 00-3-3.87M16 3.13A4 4 0 0116 11',
};

function Icone({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/** Sidebar colapsável com wallpaper — navegação principal da app. */
export default function SidebarNav({ ativo, porLer }: { ativo: string; porLer: number }) {
  const [aberta, setAberta] = useState(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem('inread-sidebar');
      if (v === 'fechada') setAberta(false);
    } catch {}
  }, []);

  function alternar() {
    setAberta((a) => {
      try {
        localStorage.setItem('inread-sidebar', a ? 'fechada' : 'aberta');
      } catch {}
      return !a;
    });
  }

  const itens: Item[] = [
    { chave: 'caixa', rotulo: 'Caixa', href: '/caixa', icone: ICONES.caixa, badge: porLer },
    { chave: 'guardados', rotulo: 'Guardados', href: '/caixa?f=fav', icone: ICONES.guardados },
    { chave: 'audio', rotulo: 'Áudio', href: '/audio', icone: ICONES.audio },
    { chave: 'descobrir', rotulo: 'Descobrir', href: '/descobrir', icone: ICONES.descobrir },
    { chave: 'remetentes', rotulo: 'Remetentes', href: '/remetentes', icone: ICONES.remetentes },
  ];

  return (
    <aside className={aberta ? 'sbar' : 'sbar fechada'} aria-label="Navegação principal">
      <div className="s-topo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="/caixa" className="s-logo-txt" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src="/logo-w.svg?v=2" alt="inread" style={{ height: 20, width: 'auto' }} />
        </a>
        <button type="button" className="s-ico-btn" onClick={alternar} title={aberta ? 'Recolher menu' : 'Expandir menu'} aria-label={aberta ? 'Recolher menu' : 'Expandir menu'}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
          </svg>
        </button>
      </div>

      {itens.map((item) => (
        <a key={item.chave} href={item.href} className={ativo === item.chave ? 's-item on' : 's-item'} aria-current={ativo === item.chave ? 'page' : undefined} title={item.rotulo}>
          <Icone d={item.icone} />
          <span className="s-rotulo">{item.rotulo}</span>
          {item.badge ? <span className="s-badge">{item.badge > 99 ? '99+' : item.badge}</span> : null}
        </a>
      ))}

      <div style={{ marginTop: 'auto' }} />
      <a href="/definicoes" className={ativo === 'definicoes' ? 's-item on' : 's-item'} title="Definições">
        <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        <span className="s-rotulo">Definições</span>
      </a>
    </aside>
  );
}
