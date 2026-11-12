'use client';

/** Último recurso: erro no layout raiz. Evita o ecrã em branco. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt">
      <body style={{ margin: 0, background: '#0b140f', color: '#e8f2ea', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Algo correu mal</div>
          <button type="button" onClick={() => reset()} style={{ border: 'none', borderRadius: 999, background: '#1be03c', color: '#052e16', fontSize: 14, fontWeight: 700, padding: '11px 20px', cursor: 'pointer' }}>
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
