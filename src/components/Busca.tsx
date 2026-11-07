'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/** 🔍 — abre uma caixa de pesquisa em overlay (substitui o campo fixo na lista). */
export default function Busca({ inicial = '', compacto = false }: { inicial?: string; compacto?: boolean }) {
  const router = useRouter();
  const [aberta, setAberta] = useState(false);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function tecla(e: KeyboardEvent) {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !aberta && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        setAberta(true);
      }
      if (e.key === 'Escape') setAberta(false);
    }
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [aberta]);

  useEffect(() => {
    if (aberta) setTimeout(() => campo.current?.focus(), 30);
  }, [aberta]);

  function pesquisar(e: React.FormEvent) {
    e.preventDefault();
    const q = campo.current?.value.trim() ?? '';
    setAberta(false);
    router.push(q ? `/caixa?q=${encodeURIComponent(q)}` : '/caixa');
  }

  return (
    <>
      <button
        type="button"
        className={compacto ? 's-ico-btn' : 's-item acao'}
        onClick={() => setAberta(true)}
        title="Pesquisar (⌘K)"
        aria-label="Pesquisar"
      >
        <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        {!compacto && <span className="s-rotulo">Pesquisar</span>}
      </button>

      {aberta && (
        <div className="busca-fundo" onMouseDown={(e) => e.target === e.currentTarget && setAberta(false)}>
          <form className="busca-cx" onSubmit={pesquisar}>
            <input ref={campo} name="q" type="search" defaultValue={inicial} placeholder="Pesquisar em assuntos, remetentes e texto…" aria-label="Pesquisar newsletters" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span className="t-app-tenue" style={{ fontSize: 11.5 }}>Enter para procurar · Esc para fechar</span>
              <button type="submit" style={{ border: 'none', borderRadius: 999, background: '#1be03c', color: '#052e16', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '9px 18px', cursor: 'pointer' }}>
                Procurar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
