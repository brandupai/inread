'use client';

import { useEffect, useState } from 'react';
import Ico from './Ico';

type Tema = 'light' | 'dark';

/** Definições → Aparência. Por omissão a app abre em modo claro; o escuro só fica se o utilizador o escolher. */
export default function EscolherTema() {
  const [tema, setTema] = useState<Tema>('light');

  useEffect(() => {
    setTema(document.documentElement.dataset.tema === 'dark' ? 'dark' : 'light');
  }, []);

  function escolher(novo: Tema) {
    document.documentElement.dataset.tema = novo;
    document.documentElement.style.background = novo === 'light' ? '#ece9e0' : '#0b140f';
    setTema(novo);
    try {
      localStorage.setItem('inread-tema', novo);
    } catch {}
  }

  const opcao = (id: Tema, rotulo: string, icone: string) => (
    <button
      key={id}
      type="button"
      onClick={() => escolher(id)}
      aria-pressed={tema === id}
      style={{
        flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 10px',
        borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
        color: 'var(--leitor-txt)', background: 'var(--leitor-btn)',
        border: `1.5px solid ${tema === id ? '#1be03c' : 'var(--leitor-borda)'}`,
      }}
    >
      <span style={{ color: 'var(--ico-cor)', display: 'inline-flex' }}><Ico n={icone} s={22} /></span>
      {rotulo}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {opcao('light', 'Claro', 'sun')}
        {opcao('dark', 'Escuro', 'moon')}
      </div>
      <p style={{ margin: '0 4px', fontSize: 12.5, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)' }}>
        O inread abre sempre em modo claro. Se escolheres o escuro, fica guardado neste dispositivo.
      </p>
    </div>
  );
}
