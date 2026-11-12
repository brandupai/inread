'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Ico from '@/components/Ico';

type PromptInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
declare global {
  interface Window {
    __inreadBip?: PromptInstalar | null;
  }
}
type Plataforma = 'ios' | 'android' | 'mac' | 'windows' | 'outro';

function detetar(): Plataforma {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Mac/i.test(ua)) return 'mac';
  if (/Win/i.test(ua)) return 'windows';
  return 'outro';
}

function emModoApp(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Regista o service worker e guarda o evento de instalação (para os botões "Instalar"). */
export function RegistarPWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    const antes = (e: Event) => {
      e.preventDefault();
      window.__inreadBip = e as PromptInstalar;
      window.dispatchEvent(new Event('inread-bip'));
    };
    const depois = () => {
      window.__inreadBip = null;
      window.dispatchEvent(new Event('inread-bip'));
    };
    window.addEventListener('beforeinstallprompt', antes);
    window.addEventListener('appinstalled', depois);
    return () => {
      window.removeEventListener('beforeinstallprompt', antes);
      window.removeEventListener('appinstalled', depois);
    };
  }, []);
  return null;
}

const PASSOS: Record<'desktop' | 'movel', Record<string, ReactNode[]>> = {
  desktop: {
    mac: [
      <>No <strong>Chrome</strong> ou <strong>Edge</strong>: clica no ícone de instalar, na barra de endereço.</>,
      <>No <strong>Safari</strong> (macOS Sonoma ou mais recente): <strong>Ficheiro → Adicionar ao Dock</strong>.</>,
    ],
    windows: [
      <>No <strong>Chrome</strong> ou <strong>Edge</strong>: clica no ícone de instalar, na barra de endereço.</>,
      <>Ou abre o menu <strong>⋮</strong> → <strong>Guardar e partilhar → Instalar inread</strong>.</>,
    ],
  },
  movel: {
    ios: [
      <>Abre o inread no <strong>Safari</strong>.</>,
      <>Toca em <strong>Partilhar</strong> (o quadrado com a seta).</>,
      <>Escolhe <strong>Adicionar ao ecrã principal</strong>.</>,
    ],
    android: [
      <>Abre o inread no <strong>Chrome</strong>.</>,
      <>Toca no menu <strong>⋮</strong> e em <strong>Instalar aplicação</strong>.</>,
    ],
  },
};

function Icone({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/**
 * Painel "Instalar a app": dois cartões (desktop e telemóvel). O do dispositivo atual
 * ganha o botão de instalar (ou os passos, se o browser não permitir um clique).
 * claro=true → site público (fundo creme); false → dentro da app (tokens do leitor).
 */
export default function PainelInstalar({ claro = false }: { claro?: boolean }) {
  const [plat, setPlat] = useState<Plataforma | null>(null);
  const [bip, setBip] = useState(false);
  const [instalada, setInstalada] = useState(false);
  const [passos, setPassos] = useState<string | null>(null);

  useEffect(() => {
    setPlat(detetar());
    setInstalada(emModoApp());
    const sync = () => setBip(Boolean(window.__inreadBip));
    sync();
    window.addEventListener('inread-bip', sync);
    return () => window.removeEventListener('inread-bip', sync);
  }, []);

  async function instalar() {
    const e = window.__inreadBip;
    if (!e) return;
    await e.prompt();
    try {
      const r = await e.userChoice;
      if (r.outcome === 'accepted') setInstalada(true);
    } catch {}
    window.__inreadBip = null;
    setBip(false);
  }

  const c = claro
    ? { card: '#fff', borda: 'rgba(20,21,15,0.08)', sombra: '0 10px 28px rgba(20,21,15,0.07)', ink: '#15160F', suave: '#62624F', chip: 'rgba(21,184,50,0.1)', chipTxt: '#086B21', passo: '#F6F5F0' }
    : { card: 'var(--leitor-btn)', borda: 'var(--leitor-borda)', sombra: 'none', ink: 'var(--leitor-txt)', suave: 'var(--leitor-txt-fraco)', chip: 'rgba(27,224,60,0.14)', chipTxt: '#1be03c', passo: 'rgba(127,127,127,0.1)' };

  const cartoes: { id: 'desktop' | 'movel'; titulo: string; sub: string; icone: string; meu: boolean; chaves: string[] }[] = [
    { id: 'desktop', titulo: 'Desktop', sub: 'macOS e Windows', icone: 'M3 5h18v11H3zM8 20h8M12 16v4', meu: plat === 'mac' || plat === 'windows' || plat === 'outro', chaves: ['mac', 'windows'] },
    { id: 'movel', titulo: 'Telemóvel', sub: 'iPhone e Android', icone: 'M8 2h8a1 1 0 011 1v18a1 1 0 01-1 1H8a1 1 0 01-1-1V3a1 1 0 011-1zM11 18h2', meu: plat === 'ios' || plat === 'android', chaves: ['ios', 'android'] },
  ];

  const nomePlat: Record<string, string> = { mac: 'macOS', windows: 'Windows', ios: 'iPhone / iPad', android: 'Android' };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, width: '100%' }}>
      {cartoes.map((k) => {
        const aberto = passos === k.id;
        const podeClicar = k.meu && bip && !instalada;
        return (
          <div key={k.id} style={{ flex: '1 1 280px', minWidth: 0, background: c.card, border: `1px solid ${c.borda}`, boxShadow: c.sombra, borderRadius: 22, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 44, height: 44, borderRadius: 13, background: c.chip, color: c.chipTxt, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <Icone d={k.icone} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <b style={{ fontSize: 16, color: c.ink }}>{k.titulo}</b>
                <span style={{ fontSize: 12.5, color: c.suave }}>{k.sub}</span>
              </span>
              {k.meu && plat && (
                <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: c.chip, color: c.chipTxt, flex: '0 0 auto' }}>
                  o teu dispositivo
                </span>
              )}
            </div>

            {instalada && k.meu ? (
              <div style={{ fontSize: 14, fontWeight: 600, color: c.chipTxt }}><Ico n="check" s={14} /> Já estás a usar a app instalada.</div>
            ) : (
              <>
                {podeClicar && (
                  <button
                    type="button"
                    onClick={instalar}
                    style={{ border: 'none', borderRadius: 999, background: '#15B832', color: '#fff', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 700, padding: '12px 20px', cursor: 'pointer' }}
                  >
                    Instalar o inread
                  </button>
                )}
                {!podeClicar && (
                  <button
                    type="button"
                    onClick={() => setPassos(aberto ? null : k.id)}
                    aria-expanded={aberto}
                    style={{ border: `1px solid ${c.borda}`, borderRadius: 999, background: 'transparent', color: c.ink, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '11px 20px', cursor: 'pointer' }}
                  >
                    {aberto ? 'Esconder passos' : 'Como instalar'}
                  </button>
                )}
                {aberto && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {k.chaves.map((chave) => (
                      <div key={chave} style={{ background: c.passo, borderRadius: 14, padding: '12px 14px' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: c.suave, marginBottom: 6 }}>{nomePlat[chave]}</div>
                        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13.5, lineHeight: 1.5, color: c.ink }}>
                          {PASSOS[k.id][chave].map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
