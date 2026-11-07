'use client';

import { useEffect, useState } from 'react';

type Estilo = 'sans' | 'serif' | 'mono';

const ESTILOS: { chave: Estilo; nome: string; amostra: string; familia: string }[] = [
  { chave: 'sans', nome: 'Nítido', amostra: 'Aa', familia: 'Inter, system-ui, sans-serif' },
  { chave: 'serif', nome: 'Clássico', amostra: 'Aa', familia: "Georgia, 'Iowan Old Style', serif" },
  { chave: 'mono', nome: 'Técnico', amostra: 'Aa', familia: 'ui-monospace, Menlo, monospace' },
];

/** A — tamanho da letra e estilo tipográfico do leitor. */
export default function Tipografia() {
  const [escala, setEscala] = useState(100);
  const [estilo, setEstilo] = useState<Estilo>('sans');
  const [conforto, setConforto] = useState(false);

  useEffect(() => {
    try {
      const e = parseInt(localStorage.getItem('inread-escala') || '100', 10);
      const s = (localStorage.getItem('inread-estilo') as Estilo) || 'sans';
      const c = localStorage.getItem('inread-conforto') === '1';
      aplicar(e >= 80 && e <= 150 ? e : 100, s, c);
    } catch {
      aplicar(100, 'sans', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function aplicar(e: number, s: Estilo, c: boolean) {
    setEscala(e);
    setEstilo(s);
    setConforto(c);
    const ilha = document.querySelector<HTMLElement>('.artigo-ilha');
    const corpo = document.getElementById('artigo-corpo');
    if (corpo) corpo.style.fontSize = `${e}%`;
    if (ilha) {
      ilha.classList.remove('est-sans', 'est-serif', 'est-mono');
      ilha.classList.add(`est-${s}`);
      ilha.classList.toggle('largura-conforto', c);
    }
    try {
      localStorage.setItem('inread-escala', String(e));
      localStorage.setItem('inread-estilo', s);
      localStorage.setItem('inread-conforto', c ? '1' : '0');
    } catch {}
  }

  const pilula = (ativo: boolean) => ({
    flex: '1 1 0',
    minWidth: 0,
    borderRadius: 10,
    border: `1px solid ${ativo ? '#1be03c' : 'var(--leitor-borda)'}`,
    background: ativo ? 'rgba(27,224,60,0.14)' : 'transparent',
    color: 'var(--leitor-txt)',
    fontFamily: 'inherit',
    cursor: 'pointer',
    padding: '9px 6px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 3,
  });

  return (
    <details className="ddown">
      <summary className="lt-btn" title="Tipografia" aria-label="Tipografia">
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, lineHeight: 1 }}>A</span>
      </summary>
      <div className="ddown-menu claro" style={{ left: 0, right: 'auto', minWidth: 268, padding: 12, gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--leitor-txt-fraco)', marginBottom: 7 }}>
            Tamanho
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <button type="button" className="lt-btn" onClick={() => aplicar(Math.max(80, escala - 10), estilo, conforto)} aria-label="Diminuir letra" style={{ fontSize: 12, fontWeight: 700 }}>
              A−
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--leitor-txt)' }}>{escala}%</span>
            <button type="button" className="lt-btn" onClick={() => aplicar(Math.min(150, escala + 10), estilo, conforto)} aria-label="Aumentar letra" style={{ fontSize: 15, fontWeight: 700 }}>
              A+
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--leitor-txt-fraco)', marginBottom: 7 }}>
            Estilo
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {ESTILOS.map((s) => (
              <button key={s.chave} type="button" onClick={() => aplicar(escala, s.chave, conforto)} style={pilula(estilo === s.chave)}>
                <span style={{ fontFamily: s.familia, fontSize: 17, fontWeight: 600, lineHeight: 1 }}>{s.amostra}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--leitor-txt-fraco)' }}>{s.nome}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => aplicar(escala, estilo, !conforto)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            border: '1px solid var(--leitor-borda)', borderRadius: 10, background: 'transparent',
            padding: '9px 11px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            color: 'var(--leitor-txt)', cursor: 'pointer',
          }}
        >
          Linha curta (mais fácil de ler)
          <span style={{ width: 34, height: 19, borderRadius: 999, background: conforto ? '#1be03c' : 'var(--leitor-btn-hover)', position: 'relative', flex: '0 0 auto' }}>
            <span style={{ position: 'absolute', top: 2, left: conforto ? 17 : 2, width: 15, height: 15, borderRadius: 999, background: '#fff', transition: 'left 0.16s ease' }} />
          </span>
        </button>
      </div>
    </details>
  );
}
