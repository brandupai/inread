'use client';

import { useState } from 'react';

const ACID_LIGHT = '#1BE03C';
const ACID = '#15B832';
const INK = '#15160F';

type Props = {
  hrefMensal: string;
  hrefAnual: string;
  /** texto do botão quando o utilizador já tem sessão */
  entrou: boolean;
  billing: boolean;
};

/** Cartão do plano Pro com escolha mensal/anual (anual pré-selecionado). */
export default function PlanoPro({ hrefMensal, hrefAnual, entrou, billing }: Props) {
  const [anual, setAnual] = useState(true);
  const href = anual ? hrefAnual : hrefMensal;
  const rotulo = !entrou ? (anual ? 'Começar com o anual' : 'Começar com o mensal') : billing ? (anual ? 'Ativar o Pro anual' : 'Ativar o Pro mensal') : 'Brevemente';

  const tab = (ativo: boolean) =>
    ({
      flex: '1 1 0',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 14,
      fontWeight: 700,
      padding: '10px 12px',
      minHeight: 44,
      borderRadius: 999,
      background: ativo ? INK : 'transparent',
      color: ativo ? ACID_LIGHT : 'rgba(21,22,15,0.7)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    }) as const;

  return (
    <div style={{ flex: '1 1 300px', minWidth: 0, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', gap: 14, background: `linear-gradient(160deg, ${ACID_LIGHT}, ${ACID})`, color: INK, boxShadow: '0 0 50px rgba(21,184,50,0.22), 0 20px 48px rgba(20,21,15,0.14)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Pro</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: ACID_LIGHT, background: INK, borderRadius: 999, padding: '4px 11px' }}>Preço de lançamento</span>
      </div>

      <div role="group" aria-label="Periodicidade" style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'rgba(255,255,255,0.45)' }}>
        <button type="button" aria-pressed={!anual} onClick={() => setAnual(false)} style={tab(!anual)}>Mensal</button>
        <button type="button" aria-pressed={anual} onClick={() => setAnual(true)} style={tab(anual)}>
          Anual <span style={{ fontSize: 11, fontWeight: 700, background: anual ? ACID_LIGHT : 'rgba(21,22,15,0.12)', color: INK, borderRadius: 999, padding: '2px 7px' }}>−17%</span>
        </button>
      </div>

      {anual ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1 }}>€49,99</span>
            <span style={{ fontSize: 14, color: 'rgba(21,22,15,0.65)' }}>/ano</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: 'rgba(21,22,15,0.75)' }}>≈ €4,17/mês · 2 meses grátis · poupas €9,89 face ao mensal</div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(21,22,15,0.5)', textDecoration: 'line-through' }}>€7,99</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1 }}>€4,99</span>
            <span style={{ fontSize: 14, color: 'rgba(21,22,15,0.65)' }}>/mês</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: 'rgba(21,22,15,0.75)' }}>Pagas mês a mês. Com o anual poupas €9,89.</div>
        </div>
      )}

      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(21,22,15,0.7)' }}>Garante este preço enquanto fores assinante.</div>
      <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, lineHeight: 1.5, color: 'rgba(21,22,15,0.85)' }}>
        <li>Armazenamento ilimitado</li>
        <li>Resumos com IA e áudio diário</li>
        <li>Alias personalizado à tua escolha</li>
        <li>Exportações avançadas (Notion, Obsidian)</li>
      </ul>
      <a href={href} style={{ marginTop: 'auto', textAlign: 'center', background: INK, borderRadius: 999, padding: '14px 18px', fontSize: 15, fontWeight: 700, color: ACID_LIGHT }}>
        {rotulo}
      </a>
    </div>
  );
}
