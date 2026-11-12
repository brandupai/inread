'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const BASE = 'https://inread.app/';
const TEXTO = 'Descobri o inread: uma caixa privada só para newsletters, sem rastreio e fora do email.';
const ASSUNTO = 'Experimenta o inread — as tuas newsletters, fora da caixa de entrada';

type Canal = { id: string; nome: string; cor: string; d: string; href: (url: string) => string };

const e = encodeURIComponent;
const CANAIS: Canal[] = [
  {
    id: 'whatsapp', nome: 'WhatsApp', cor: '#25D366',
    d: 'M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.4z',
    href: (u) => `https://wa.me/?text=${e(`${TEXTO} ${u}`)}`,
  },
  {
    id: 'email', nome: 'Email', cor: '#14150f',
    d: 'M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm17 3.2l-8 5.3-8-5.3V17h16V8.2zM4.9 7l7.1 4.7L19.1 7H4.9z',
    href: (u) => `mailto:?subject=${e(ASSUNTO)}&body=${e(`${TEXTO}\n\n${u}`)}`,
  },
  {
    id: 'linkedin', nome: 'LinkedIn', cor: '#0A66C2',
    d: 'M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3-1.9 0-2.1 1.4-2.1 2.9v5.7H9.2V9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zM7.1 20.4H3.5V9h3.6v11.4z',
    href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${e(u)}`,
  },
  {
    id: 'x', nome: 'X', cor: '#000000',
    d: 'M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7zm-1.3 19.4h2L7.1 3.3h-2.2l12.7 17.3z',
    href: (u) => `https://twitter.com/intent/tweet?text=${e(TEXTO)}&url=${e(u)}`,
  },
  {
    id: 'facebook', nome: 'Facebook', cor: '#1877F2',
    d: 'M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z',
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${e(u)}`,
  },
  {
    id: 'telegram', nome: 'Telegram', cor: '#229ED9',
    d: 'M21.94 4.6l-3.02 14.25c-.23 1.01-.82 1.26-1.66.78l-4.6-3.39-2.22 2.14c-.25.25-.45.45-.92.45l.33-4.68 8.52-7.7c.37-.33-.08-.51-.57-.18L7.26 12.9l-4.54-1.42c-.99-.31-1-.99.2-1.46L20.67 3.2c.82-.3 1.54.2 1.27 1.4z',
    href: (u) => `https://t.me/share/url?url=${e(u)}&text=${e(TEXTO)}`,
  },
];

const url = (canal: string) => `${BASE}?utm_source=partilha&utm_medium=${canal}`;

/**
 * Partilhar o inread: WhatsApp, email, redes sociais, copiar link e a partilha nativa do dispositivo.
 * claro=true → site público; false → dentro da app (tokens do leitor).
 */
export default function Partilhar({ claro = false, titulo }: { claro?: boolean; titulo?: string }) {
  const [copiado, setCopiado] = useState(false);
  const [nativa, setNativa] = useState(false);
  useEffect(() => setNativa(typeof navigator !== 'undefined' && typeof navigator.share === 'function'), []);

  const c = claro
    ? { txt: '#15160F', fraco: '#62624F', chip: '#FFFFFF', borda: 'rgba(20,21,15,0.08)', sombra: '0 2px 6px rgba(20,21,15,0.06)' }
    : { txt: 'var(--leitor-txt)', fraco: 'var(--leitor-txt-fraco)', chip: 'var(--leitor-btn)', borda: 'var(--leitor-borda)', sombra: 'none' };

  const chip: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 9, borderRadius: 999, padding: '7px 15px 7px 7px',
    background: c.chip, border: `1px solid ${c.borda}`, boxShadow: c.sombra, color: c.txt,
    fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  };
  const bola = (cor: string): CSSProperties => ({
    width: 30, height: 30, borderRadius: 999, background: cor, color: '#fff', flex: '0 0 auto',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  });

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url('link'));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {}
  }

  async function partilhaNativa() {
    try {
      await navigator.share({ title: 'inread', text: TEXTO, url: url('nativo') });
    } catch {}
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: claro ? 'center' : 'stretch', gap: 12 }}>
      {titulo && <div style={{ fontSize: 15, fontWeight: 600, color: c.txt, textAlign: claro ? 'center' : 'left' }}>{titulo}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: claro ? 'center' : 'flex-start' }}>
        {CANAIS.map((k) => (
          <a key={k.id} href={k.href(url(k.id))} target="_blank" rel="noopener noreferrer" data-umami-event={`partilhar-${k.id}`} style={chip} aria-label={`Partilhar no ${k.nome}`}>
            <span style={bola(k.cor)}>
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={k.d} /></svg>
            </span>
            {k.nome}
          </a>
        ))}
        <button type="button" onClick={copiar} data-umami-event="partilhar-copiar" style={chip}>
          <span style={bola('#15B832')}>
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {copiado ? <path d="M20 6L9 17l-5-5" /> : <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />}
            </svg>
          </span>
          {copiado ? 'Link copiado' : 'Copiar link'}
        </button>
        {nativa && (
          <button type="button" onClick={partilhaNativa} data-umami-event="partilhar-nativo" style={chip}>
            <span style={bola('#62624F')}>
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" /></svg>
            </span>
            Mais opções
          </button>
        )}
      </div>
    </div>
  );
}
