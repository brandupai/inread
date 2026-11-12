'use client';

/** Erro inesperado numa página: mostra algo útil em vez de um ecrã em branco. */
export default function Erro({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', background: '#0b140f', color: '#e8f2ea', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, textAlign: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>Algo correu mal ao abrir esta página</div>
      <div style={{ fontSize: 14, opacity: 0.7 }}>Tenta outra vez. Se persistir, volta à caixa.</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={() => reset()} style={{ border: 'none', borderRadius: 999, background: '#1be03c', color: '#052e16', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '11px 20px', cursor: 'pointer' }}>
          Tentar de novo
        </button>
        <a href="/caixa" style={{ borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', color: '#e8f2ea', fontSize: 14, fontWeight: 600, padding: '11px 20px' }}>Ir para a caixa</a>
      </div>
    </div>
  );
}
