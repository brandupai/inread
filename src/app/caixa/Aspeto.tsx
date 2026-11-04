'use client';

import { useEffect, useState } from 'react';

/** Popover ☀ — tamanho de letra do leitor (guardado no browser). */
export default function Aspeto() {
  const [escala, setEscala] = useState(100);

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem('inread-escala') || '100', 10);
      if (v >= 80 && v <= 140) aplicar(v);
    } catch {}
  }, []);

  function aplicar(v: number) {
    setEscala(v);
    const corpo = document.getElementById('artigo-corpo');
    if (corpo) corpo.style.fontSize = `${v}%`;
    try {
      localStorage.setItem('inread-escala', String(v));
    } catch {}
  }

  return (
    <details className="ddown">
      <summary className="lt-btn" title="Aspeto da leitura" aria-label="Aspeto da leitura">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4l1.4-1.4" />
        </svg>
      </summary>
      <div className="ddown-menu claro" style={{ minWidth: 200 }}>
        <div style={{ padding: '8px 11px 2px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(33,48,42,0.55)' }}>
          Tamanho da letra
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 11px 9px' }}>
          <button type="button" className="lt-btn" onClick={() => aplicar(Math.max(80, escala - 10))} aria-label="Diminuir letra" style={{ fontSize: 12, fontWeight: 700 }}>
            A−
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#21302a' }}>{escala}%</span>
          <button type="button" className="lt-btn" onClick={() => aplicar(Math.min(140, escala + 10))} aria-label="Aumentar letra" style={{ fontSize: 14, fontWeight: 700 }}>
            A+
          </button>
        </div>
      </div>
    </details>
  );
}
