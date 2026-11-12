'use client';

/** Mobile: volta da "aba C" (detalhe) à lista — como na caixa. */
export default function VoltarLista({ onClick }: { onClick: () => void }) {
  return (
    <div className="voltar-lista so-mobile">
      <button type="button" className="btn-voltar-m" onClick={onClick} aria-label="Voltar à lista" title="Voltar à lista">
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
}
