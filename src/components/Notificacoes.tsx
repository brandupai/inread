'use client';

import { useEffect, useState } from 'react';

type Estado = 'a-verificar' | 'sem-suporte' | 'ios-instalar' | 'bloqueado' | 'desligado' | 'ligado';

function b64ParaBytes(b64: string): Uint8Array<ArrayBuffer> {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function registo() {
  return (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register('/sw.js'));
}

/** Ativar/desativar notificações neste dispositivo (web push — desktop, Android e iPhone com a app instalada). */
export default function Notificacoes() {
  const [estado, setEstado] = useState<Estado>('a-verificar');
  const [msg, setMsg] = useState('');
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    (async () => {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const instalada = window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        setEstado(ios && !instalada ? 'ios-instalar' : 'sem-suporte');
        return;
      }
      if (Notification.permission === 'denied') return setEstado('bloqueado');
      try {
        const sub = await (await registo()).pushManager.getSubscription();
        setEstado(sub && Notification.permission === 'granted' ? 'ligado' : 'desligado');
      } catch {
        setEstado('desligado');
      }
    })();
  }, []);

  async function ligar() {
    setOcupado(true);
    setMsg('');
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        setEstado(perm === 'denied' ? 'bloqueado' : 'desligado');
        return;
      }
      const { chave } = await fetch('/api/push/chave').then((r) => r.json());
      const reg = await registo();
      await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ParaBytes(chave) }));
      const r = await fetch('/api/push/subscrever', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(sub.toJSON()) });
      if (!r.ok) throw new Error('registo');
      setEstado('ligado');
      setMsg('Ativadas neste dispositivo.');
    } catch {
      setMsg('Não foi possível ativar. Tenta de novo daqui a pouco.');
    } finally {
      setOcupado(false);
    }
  }

  async function desligar() {
    setOcupado(true);
    try {
      const sub = await (await registo()).pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/subscrever', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        await sub.unsubscribe();
      }
      setEstado('desligado');
      setMsg('');
    } finally {
      setOcupado(false);
    }
  }

  async function testar() {
    setOcupado(true);
    await fetch('/api/push/subscrever?teste=1', { method: 'POST' }).catch(() => {});
    setMsg('Teste enviado — deve aparecer em segundos.');
    setOcupado(false);
  }

  const btn = { border: 'none', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '12px 20px', cursor: 'pointer', minHeight: 44 } as const;
  const nota = { margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={nota}>Recebe um aviso quando chega uma newsletter nova. A notificação mostra só o remetente e o assunto.</p>
      {estado === 'a-verificar' && <p style={nota}>A verificar…</p>}
      {estado === 'sem-suporte' && <p style={nota}>Este browser não suporta notificações. Experimenta o Chrome, Edge, Firefox ou Safari atualizados.</p>}
      {estado === 'ios-instalar' && (
        <p style={nota}>No iPhone, as notificações só funcionam com a app instalada: toca em Partilhar → «Adicionar ao ecrã principal», abre o inread a partir do ícone e volta aqui. Requer iOS 16.4 ou superior.</p>
      )}
      {estado === 'bloqueado' && <p style={nota}>As notificações estão bloqueadas para o inread. Permite-as nas definições do browser ou do sistema para este site e volta aqui.</p>}
      {estado === 'desligado' && (
        <button type="button" disabled={ocupado} onClick={ligar} style={{ ...btn, background: '#1be03c', color: '#052e16', alignSelf: 'flex-start' }}>
          Ativar notificações
        </button>
      )}
      {estado === 'ligado' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button type="button" disabled={ocupado} onClick={testar} style={{ ...btn, background: '#1be03c', color: '#052e16' }}>
            Enviar teste
          </button>
          <button type="button" disabled={ocupado} onClick={desligar} style={{ ...btn, background: 'transparent', color: 'inherit', border: '1px solid var(--leitor-borda, rgba(128,128,128,.35))' }}>
            Desativar
          </button>
        </div>
      )}
      {msg && <p role="status" style={nota}>{msg}</p>}
    </div>
  );
}
