'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

/** 🔍 — abre uma caixa de pesquisa em overlay (substitui o campo fixo na lista). */
export default function Busca({ inicial = '', compacto = false, dock = false }: { inicial?: string; compacto?: boolean; dock?: boolean }) {
  const router = useRouter();
  const [aberta, setAberta] = useState(false);
  const campo = useRef<HTMLInputElement>(null);
  const gatilho = useRef<HTMLButtonElement>(null);
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  useEffect(() => {
    function tecla(e: KeyboardEvent) {
      // só a instância visível reage (a da barra lateral e a do dock coexistem no DOM)
      if (!gatilho.current || gatilho.current.getClientRects().length === 0) return;
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
    if (!aberta) return;
    campo.current?.focus();
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = antes;
    };
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
        ref={gatilho}
        type="button"
        className={dock ? 'dock-ic' : compacto ? 's-ico-btn' : 's-item'}
        onClick={() => setAberta(true)}
        title="Pesquisar (⌘K)"
        aria-label="Pesquisar"
      >
        <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        {!compacto && !dock && <span className="s-rotulo">Pesquisar</span>}
      </button>

      {aberta && montado && createPortal(
        <div className="busca-fundo" onPointerDown={(e) => e.target === e.currentTarget && setAberta(false)}>
          <form className="busca-cx" onSubmit={pesquisar}>
            <input ref={campo} autoFocus name="q" type="search" enterKeyHint="search" autoComplete="off" autoCorrect="off" defaultValue={inicial} placeholder="Pesquisar em assuntos, remetentes e texto…" aria-label="Pesquisar newsletters" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <button type="button" onClick={() => setAberta(false)} aria-label="Fechar pesquisa" style={{ border: '1px solid var(--app-borda-forte)', borderRadius: 999, background: 'transparent', color: 'var(--app-txt)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: '9px 16px', cursor: 'pointer' }}>
                Fechar
              </button>
              <button type="submit" style={{ border: 'none', borderRadius: 999, background: '#1be03c', color: '#052e16', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '9px 18px', cursor: 'pointer' }}>
                Procurar
              </button>
            </div>
          </form>
        </div>,
        document.body,
      )}
    </>
  );
}
