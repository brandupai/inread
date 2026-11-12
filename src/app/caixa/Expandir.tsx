'use client';

import { useState } from 'react';

/** ⤢ — alterna a largura de leitura (normal / expandida). */
export default function Expandir() {
  const [exp, setExp] = useState(false);

  function alternar() {
    const col = document.querySelector('.col-leitor');
    if (col) col.classList.toggle('exp');
    setExp((e) => !e);
  }

  return (
    <button type="button" className="lt-btn so-desktop" onClick={alternar} title={exp ? 'Reduzir leitura' : 'Expandir leitura'} aria-label={exp ? 'Reduzir leitura' : 'Expandir leitura'}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {exp ? <path d="M9 15l-6 6m0 0v-5m0 5h5M15 9l6-6m0 0v5m0-5h-5" /> : <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />}
      </svg>
    </button>
  );
}
