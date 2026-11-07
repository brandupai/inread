'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Sublinhador: observa a seleção de texto dentro do artigo (#artigo-corpo)
 * e mostra uma barra flutuante: Sublinhar · Copiar · WhatsApp · Email · X.
 */
export default function Sublinhador({ newsletterId, assunto }: { newsletterId: string; assunto?: string }) {
  const router = useRouter();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [aGuardar, setAGuardar] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const textoRef = useRef('');

  const esconder = useCallback(() => {
    setPos(null);
    setCopiado(false);
    textoRef.current = '';
  }, []);

  useEffect(() => {
    function onSelecao() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return esconder();
      const texto = sel.toString().trim();
      if (texto.length < 3 || texto.length > 2000) return esconder();

      const corpo = document.getElementById('artigo-corpo');
      const no = sel.anchorNode;
      if (!corpo || !no || !corpo.contains(no)) return esconder();

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      textoRef.current = texto;
      setPos({ x: rect.left + rect.width / 2, y: rect.top });
    }
    document.addEventListener('selectionchange', onSelecao);
    return () => document.removeEventListener('selectionchange', onSelecao);
  }, [esconder]);

  async function guardar() {
    const text = textoRef.current;
    if (!text || aGuardar) return;
    setAGuardar(true);
    try {
      const r = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ newsletterId, text }),
      });
      if (r.ok) {
        window.getSelection()?.removeAllRanges();
        esconder();
        router.refresh();
      }
    } finally {
      setAGuardar(false);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(citacao());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1400);
    } catch {}
  }

  function citacao() {
    const t = textoRef.current;
    return assunto ? `“${t}”\n— ${assunto} (via inread.app)` : `“${t}” (via inread.app)`;
  }

  function abrirPartilha(tipo: 'wa' | 'mail' | 'x') {
    const msg = citacao();
    let url = '';
    if (tipo === 'wa') url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    if (tipo === 'mail') url = `mailto:?subject=${encodeURIComponent(assunto ?? 'Uma passagem que sublinhei')}&body=${encodeURIComponent(msg)}`;
    if (tipo === 'x') url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg.slice(0, 260))}`;
    window.open(url, '_blank', 'noopener');
  }

  if (!pos) return null;

  const botao = (rotulo: string, onClick: () => void, forte = false, title?: string) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title ?? rotulo}
      style={{
        border: 'none',
        borderRadius: 999,
        background: forte ? '#1BE03C' : 'transparent',
        color: forte ? '#0B140F' : '#E8F2EA',
        fontFamily: 'inherit',
        fontSize: 12.5,
        fontWeight: 700,
        padding: '8px 12px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {rotulo}
    </button>
  );

  return (
    <div
      role="toolbar"
      aria-label="Ações da seleção"
      style={{
        position: 'fixed',
        left: Math.max(8, Math.min(pos.x - 170, window.innerWidth - 348)),
        top: Math.max(8, pos.y - 52),
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 4,
        borderRadius: 999,
        background: '#10231a',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 14px 34px rgba(0,0,0,0.45)',
      }}
    >
      {botao(aGuardar ? 'A guardar…' : '✦ Sublinhar', guardar, true)}
      {botao(copiado ? 'Copiado ✓' : 'Copiar', copiar)}
      {botao('WhatsApp', () => abrirPartilha('wa'), false, 'Partilhar no WhatsApp')}
      {botao('Email', () => abrirPartilha('mail'), false, 'Partilhar por email')}
      {botao('X', () => abrirPartilha('x'), false, 'Partilhar no X')}
    </div>
  );
}
