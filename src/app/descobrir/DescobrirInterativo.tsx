'use client';

import { useState } from 'react';
import SidebarNav from '@/components/SidebarNav';
import VoltarMobile from '@/components/VoltarMobile';
import LogoNewsletter from './LogoNewsletter';
import { CATEGORIAS, porCategoria, type Categoria, type EntradaDiretorio } from '@/lib/diretorio';

const ICONE: Record<Categoria, string> = {
  Tendências: '🔥',
  Tecnologia: '💻',
  Negócios: '💼',
  Produtividade: '🌱',
  Marketing: '📣',
  Finanças: '📈',
};

export default function DescobrirInterativo({ porLer, alias }: { porLer: number; alias: string }) {
  const [categoria, setCategoria] = useState<Categoria>('Tendências');
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  const lista = porCategoria(categoria);

  async function assinar(n: EntradaDiretorio) {
    try {
      await navigator.clipboard.writeText(alias);
    } catch {
      // clipboard pode falhar (sem permissão); o alias fica visível no cartão
    }
    setCopiadoId(n.id);
    setTimeout(() => setCopiadoId((atual) => (atual === n.id ? null : atual)), 2500);
    window.open(n.site, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="app3">
      <SidebarNav ativo="descobrir" porLer={porLer} />

      {/* Coluna B — categorias */}
      <section className="col-lista">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 4px' }}>
          <VoltarMobile />
          <h1 className="t-app-forte" style={{ margin: 0, fontSize: 16, lineHeight: 1 }}>Descobrir</h1>
        </div>

        {CATEGORIAS.map((c) => {
          const n = porCategoria(c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              className={c === categoria ? 'm-carta on' : 'm-carta'}
              style={{ alignItems: 'center', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span style={{ width: 36, height: 36, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, background: 'rgba(27,224,60,0.12)', flex: '0 0 auto' }}>
                {ICONE[c]}
              </span>
              <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700, flex: '1 1 auto' }}>{c}</span>
              <span className="t-app-tenue" style={{ fontSize: 11, flex: '0 0 auto' }}>{n}</span>
            </button>
          );
        })}

        <p className="t-app-tenue" style={{ fontSize: 12, lineHeight: 1.6, padding: '6px 2px' }}>
          Diretório em crescimento. Diz-nos em suporte@inread.app que newsletters gostavas de ver aqui.
        </p>
      </section>

      {/* Coluna C — diretório da categoria escolhida */}
      <main className="col-leitor" style={{ alignItems: 'stretch', justifyContent: 'flex-start', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 880, margin: '0 auto', padding: '28px 24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 22 }}>{ICONE[categoria]}</span>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--leitor-txt)' }}>{categoria}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
            {lista.map((n) => (
              <div
                key={n.id}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 16, padding: 16,
                  background: 'var(--app-painel)', border: '1px solid var(--app-borda)',
                }}
              >
                <LogoNewsletter dominio={n.dominio} nome={n.nome} cor={n.cor} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--leitor-txt)' }}>{n.nome}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--leitor-txt-fraco)' }}>{n.autor ?? n.categoria}</span>
                </span>
                <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--leitor-txt-fraco)', flex: '1 1 auto' }}>
                  {n.descricao}
                </span>
                <button
                  type="button"
                  onClick={() => assinar(n)}
                  style={{
                    alignSelf: 'flex-start', fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '6px 13px',
                    border: '1px solid rgba(27,224,60,0.45)', cursor: 'pointer', fontFamily: 'inherit',
                    color: copiadoId === n.id ? '#052e16' : '#1BE03C',
                    background: copiadoId === n.id ? '#1BE03C' : 'transparent',
                  }}
                >
                  {copiadoId === n.id ? 'Alias copiado ✓' : 'Assinar'}
                </button>
              </div>
            ))}
          </div>

          {lista.length === 0 && (
            <p style={{ color: 'var(--leitor-txt-fraco)', fontSize: 14 }}>Ainda sem newsletters nesta categoria.</p>
          )}

          <p style={{ marginTop: 24, fontSize: 12, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)', maxWidth: 480 }}>
            Ao tocar em "Assinar" copiamos o teu alias <strong>{alias}</strong> e abrimos o site da newsletter numa
            nova aba — é só colar no formulário de subscrição deles.
          </p>
        </div>
      </main>
    </div>
  );
}
