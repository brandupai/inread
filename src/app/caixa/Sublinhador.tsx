'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Sublinhador: observa a seleção de texto dentro do artigo (#artigo-corpo)
 * e mostra um botão flutuante "Sublinhar" que guarda o highlight.
 */
export default function Sublinhador({ newsletterId }: { newsletterId: string }) {
  const router = useRouter();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [aGuardar, setAGuardar] = useState(false);
  const textoRef = useRef('');

  const esconder = useCallback(() => {
    setPos(null);
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

  if (!pos) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={guardar}
      style={{
        position: 'fixed',
        left: Math.max(8, Math.min(pos.x - 54, window.innerWidth - 116)),
        top: Math.max(8, pos.y - 46),
        zIndex: 50,
        border: 'none',
        borderRadius: 999,
        background: 'var(--brand-dark)',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        padding: '9px 16px',
        cursor: 'pointer',
        boxShadow: '0 12px 28px rgba(31,51,41,0.35)',
      }}
    >
      {aGuardar ? 'A guardar…' : '✦ Sublinhar'}
    </button>
  );
}
