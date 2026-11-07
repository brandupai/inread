'use client';

import { useEffect, useState } from 'react';

type Tema = 'dark' | 'light';

/** Switch icon-only (sem texto) — alterna entre modo noite e modo dia (guarda a escolha no browser). */
export default function BotaoTema({ classe = 'tema-switch' }: { classe?: string }) {
  const [tema, setTema] = useState<Tema>('dark');

  useEffect(() => {
    const atual = (document.documentElement.dataset.tema as Tema) || 'dark';
    setTema(atual);
  }, []);

  function alternar() {
    const novo: Tema = tema === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.tema = novo;
    setTema(novo);
    try {
      localStorage.setItem('inread-tema', novo);
    } catch {}
  }

  const claro = tema === 'light';

  return (
    <button
      type="button"
      className={classe}
      onClick={alternar}
      role="switch"
      aria-checked={claro}
      title={tema === 'dark' ? 'Modo dia' : 'Modo noite'}
      aria-label={tema === 'dark' ? 'Mudar para modo dia' : 'Mudar para modo noite'}
    >
      <span className="tema-switch-trilho">
        <span className="tema-switch-bola">
          {claro ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4l1.4-1.4" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
