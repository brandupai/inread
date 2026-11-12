'use client';

import { useEffect, useRef, useState } from 'react';
import Ico from '@/components/Ico';

type Estado = 'parado' | 'a-ler' | 'pausa';

/** 🔊 — lê a newsletter em voz alta (síntese de voz do browser, pt-PT). */
export default function Voz({ titulo }: { titulo: string }) {
  const [estado, setEstado] = useState<Estado>('parado');
  const [velocidade, setVelocidade] = useState(1);
  const [disponivel, setDisponivel] = useState(true);
  const velRef = useRef(1);

  useEffect(() => {
    setDisponivel(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    };
  }, []);

  function vozPt(): SpeechSynthesisVoice | null {
    const vs = window.speechSynthesis.getVoices();
    return (
      vs.find((v) => v.lang?.toLowerCase().startsWith('pt-pt')) ??
      vs.find((v) => v.lang?.toLowerCase().startsWith('pt')) ??
      null
    );
  }

  function texto(): string {
    const corpo = document.getElementById('artigo-corpo');
    const t = (corpo?.innerText ?? '').replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '. ').trim();
    return `${titulo}. ${t}`;
  }

  function ler() {
    const sintese = window.speechSynthesis;
    sintese.cancel();
    const bruto = texto();
    if (!bruto) return;
    // Partir em frases: o Chrome corta falas muito longas.
    const partes = bruto.match(/[^.!?]+[.!?]*/g)?.filter((p) => p.trim().length > 1) ?? [bruto];
    const voz = vozPt();
    partes.forEach((parte, i) => {
      const u = new SpeechSynthesisUtterance(parte.trim());
      u.lang = 'pt-PT';
      u.rate = velRef.current;
      if (voz) u.voice = voz;
      if (i === partes.length - 1) u.onend = () => setEstado('parado');
      sintese.speak(u);
    });
    setEstado('a-ler');
  }

  function alternar() {
    const s = window.speechSynthesis;
    if (estado === 'parado') return ler();
    if (estado === 'a-ler') {
      s.pause();
      return setEstado('pausa');
    }
    s.resume();
    setEstado('a-ler');
  }

  function parar() {
    window.speechSynthesis.cancel();
    setEstado('parado');
  }

  function mudarVelocidade(v: number) {
    setVelocidade(v);
    velRef.current = v;
    if (estado !== 'parado') ler();
  }

  if (!disponivel) return null;

  return (
    <details className="ddown">
      <summary
        className="lt-btn"
        title="Ouvir a newsletter"
        aria-label="Ouvir a newsletter"
        style={estado !== 'parado' ? { background: 'rgba(27,224,60,0.22)', color: '#09572c' } : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H3v6h3l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
        </svg>
      </summary>
      <div className="ddown-menu claro" style={{ left: 0, right: 'auto', minWidth: 234, padding: 12, gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--leitor-txt)' }}>Ouvir esta edição</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={alternar}
            style={{ flex: '1 1 auto', border: 'none', borderRadius: 999, background: '#1be03c', color: '#052e16', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '10px 14px', cursor: 'pointer' }}
          >
            {estado === 'a-ler' ? <><Ico n="pause" s={13} fill /> Pausar</> : estado === 'pausa' ? <><Ico n="play" s={13} fill /> Continuar</> : <><Ico n="play" s={13} fill /> Ouvir</>}
          </button>
          {estado !== 'parado' && (
            <button type="button" onClick={parar} className="lt-btn" title="Parar" aria-label="Parar" style={{ flex: '0 0 auto' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--leitor-txt-fraco)', flex: '0 0 auto' }}>Velocidade</span>
          {[0.85, 1, 1.25, 1.5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => mudarVelocidade(v)}
              style={{
                flex: '1 1 0', border: `1px solid ${velocidade === v ? '#1be03c' : 'var(--leitor-borda)'}`,
                background: velocidade === v ? 'rgba(27,224,60,0.14)' : 'transparent', color: 'var(--leitor-txt)',
                borderRadius: 8, fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, padding: '6px 0', cursor: 'pointer',
              }}
            >
              {v}×
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--leitor-txt-fraco)' }}>
          Usa a voz portuguesa do teu dispositivo. O áudio com vozes naturais chega com o Pro.
        </span>
      </div>
    </details>
  );
}
