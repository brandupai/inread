'use client';

import { useState } from 'react';

/** O endereço @inread.app do utilizador, sempre à vista (clicar copia). */
export default function AliasChip({ alias }: { alias: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(alias);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {}
  }

  return (
    <button type="button" className="alias-chip" onClick={copiar} title="Copiar o teu endereço">
      {copiado ? (
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1be03c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <>
          <svg className="ac-env" aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1be03c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
            <rect x="2.5" y="5" width="19" height="14" rx="3" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <svg className="ac-copia" aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1be03c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        </>
      )}
      <span className="alias-txt">{alias}</span>
      <span className="alias-dica">{copiado ? 'copiado ✓' : 'copiar'}</span>
    </button>
  );
}
