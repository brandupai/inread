'use client';

import { useState } from 'react';
import SidebarNav from '@/components/SidebarNav';
import { CATEGORIAS, porCategoria, type Categoria, type EntradaDiretorio } from '@/lib/diretorio';

export default function DescobrirInterativo({ porLer, alias }: { porLer: number; alias: string }) {
  const [categoria, setCategoria] = useState<Categoria>('Tendências');
  const [selecionada, setSelecionada] = useState<EntradaDiretorio | null>(null);
  const [copiado, setCopiado] = useState(false);

  const lista = porCategoria(categoria);

  async function assinar(n: EntradaDiretorio) {
    setSelecionada(n);
    try {
      await navigator.clipboard.writeText(alias);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // clipboard pode falhar (sem permissão); o alias continua visível no painel
    }
    window.open(n.site, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="app3">
      <SidebarNav ativo="descobrir" porLer={porLer} />

      <section className="col-lista">
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '0 2px 4px' }}>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              className={c === categoria ? 'f-chip on' : 'f-chip'}
              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 4px' }}>
          <h1 className="t-app-forte" style={{ margin: 0, fontSize: 16, lineHeight: 1 }}>Descobrir</h1>
        </div>

        {lista.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => assinar(n)}
            className={selecionada?.id === n.id ? 'm-carta on' : 'm-carta'}
            style={{ alignItems: 'center', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <span style={{ width: 42, height: 42, borderRadius: 11, background: n.cor, flex: '0 0 auto' }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: '1 1 auto' }}>
              <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700 }}>{n.nome}</span>
              <span className="t-app-tenue" style={{ fontSize: 11 }}>{n.autor ?? n.categoria}</span>
            </span>
            <span style={{ flex: '0 0 auto', fontSize: 10.5, fontWeight: 700, color: '#1BE03C', border: '1px solid rgba(27,224,60,0.45)', borderRadius: 999, padding: '4px 9px', whiteSpace: 'nowrap' }}>
              Assinar
            </span>
          </button>
        ))}

        <p className="t-app-tenue" style={{ fontSize: 12, lineHeight: 1.6, padding: '6px 2px' }}>
          Diretório em crescimento. Diz-nos em suporte@inread.app que newsletters gostavas de ver aqui.
        </p>
      </section>

      <main className="col-leitor">
        {selecionada ? (
          <div style={{ margin: 'auto', textAlign: 'center', padding: 32, maxWidth: 440, color: 'var(--leitor-txt-fraco)' }}>
            <span style={{ display: 'inline-block', width: 56, height: 56, borderRadius: 14, background: selecionada.cor, marginBottom: 14 }} />
            <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--leitor-txt)', marginBottom: 4 }}>{selecionada.nome}</p>
            {selecionada.autor && <p style={{ fontSize: 13, margin: '0 0 10px' }}>{selecionada.autor}</p>}
            <p style={{ fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>{selecionada.descricao}</p>

            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                {copiado ? 'Alias copiado ✓' : 'O teu alias para subscrever'}
              </span>
              <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--leitor-txt)', background: 'rgba(27,224,60,0.12)', border: '1px solid rgba(27,224,60,0.4)', borderRadius: 10, padding: '8px 14px' }}>
                {alias}
              </code>
              <p style={{ fontSize: 12, margin: '2px 0 0', maxWidth: 320 }}>
                Abrimos o site da {selecionada.nome} numa nova aba — cola este email no formulário de subscrição deles.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', padding: 32, maxWidth: 420, color: 'var(--leitor-txt-fraco)' }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🧭</div>
            <p style={{ fontWeight: 700, color: 'var(--leitor-txt)', marginBottom: 6 }}>Descobre a tua próxima leitura</p>
            <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              Escolhe uma categoria à esquerda e toca em "Assinar" — copiamos o teu alias @inread.app e abrimos a
              página de subscrição da newsletter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
