'use client';

import { useState } from 'react';
import Ico from '@/components/Ico';

/** Menu ⋯ do leitor: copiar a edição (com sublinhados) em Markdown e abri-la no Obsidian. */
export default function ExportarNotas({ id, titulo, notion = false }: { id: string; titulo: string; notion?: boolean }) {
  const [estado, setEstado] = useState<'' | 'copiado' | 'obsidian' | 'erro'>('');
  const [nt, setNt] = useState<{ fase: '' | 'a-enviar' | 'ok' | 'erro'; url?: string; msg?: string }>({ fase: '' });

  async function enviarNotion() {
    if (nt.fase === 'a-enviar') return;
    setNt({ fase: 'a-enviar' });
    try {
      const r = await fetch('/api/notion/enviar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) });
      const d = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
      if (r.ok && d.url) return setNt({ fase: 'ok', url: d.url });
      setNt({ fase: 'erro', msg: d.error === 'notion-sempagina' ? 'Partilha uma página com o inread: Definições → Ligações → Notion.' : 'Não foi possível enviar para o Notion.' });
    } catch {
      setNt({ fase: 'erro', msg: 'Não foi possível enviar para o Notion.' });
    }
  }

  /** Copia o Markdown. O pedido corre dentro do ClipboardItem para o Safari aceitar a cópia após o toque. */
  async function copiarMd(): Promise<boolean> {
    const texto = fetch(`/api/export/${id}`, { credentials: 'same-origin' }).then((r) => {
      if (!r.ok) throw new Error('export');
      return r.text();
    });
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/plain': texto.then((t) => new Blob([t], { type: 'text/plain' })) }),
        ]);
      } else {
        await navigator.clipboard.writeText(await texto);
      }
      return true;
    } catch {
      try {
        await navigator.clipboard.writeText(await texto);
        return true;
      } catch {
        return false;
      }
    }
  }

  function avisar(e: '' | 'copiado' | 'obsidian' | 'erro') {
    setEstado(e);
    if (e) setTimeout(() => setEstado(''), 3500);
  }

  async function copiar() {
    avisar((await copiarMd()) ? 'copiado' : 'erro');
  }

  async function obsidian() {
    if (!(await copiarMd())) return avisar('erro');
    avisar('obsidian');
    // nomes de notas no Obsidian não podem ter \ / : # ^ [ ] |
    const nome = titulo.replace(/[\\/:#^[\]|?*"<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) || 'Newsletter';
    window.location.href = `obsidian://new?name=${encodeURIComponent(nome)}&clipboard`;
  }

  return (
    <>
      <button type="button" className="ddown-item" onClick={copiar}>
        <Ico n={estado === 'copiado' ? 'check' : 'link'} s={14} /> {estado === 'copiado' ? 'Markdown copiado' : 'Copiar em Markdown'}
      </button>
      <button type="button" className="ddown-item" onClick={obsidian}>
        <Ico n={estado === 'obsidian' ? 'check' : 'tag'} s={14} /> Abrir no Obsidian
      </button>
      {notion &&
        (nt.fase === 'ok' && nt.url ? (
          <a href={nt.url} target="_blank" rel="noopener noreferrer" className="ddown-item">
            <Ico n="check" s={14} /> Enviado — abrir no Notion ↗
          </a>
        ) : (
          <button type="button" className="ddown-item" onClick={enviarNotion}>
            <Ico n="send" s={14} /> {nt.fase === 'a-enviar' ? 'A enviar para o Notion…' : 'Enviar para o Notion'}
          </button>
        ))}
      {nt.fase === 'erro' && (
        <span style={{ fontSize: 11.5, lineHeight: 1.5, padding: '2px 11px 6px', color: '#e2574f' }}>{nt.msg}</span>
      )}
      {estado === 'obsidian' && (
        <span style={{ fontSize: 11.5, lineHeight: 1.5, padding: '2px 11px 6px', opacity: 0.7 }}>
          Nota criada a partir do Markdown copiado. Se o Obsidian não abrir, cola numa nota nova.
        </span>
      )}
      {estado === 'erro' && (
        <span style={{ fontSize: 11.5, lineHeight: 1.5, padding: '2px 11px 6px', color: '#e2574f' }}>
          Não foi possível copiar. Usa «Exportar .md».
        </span>
      )}
    </>
  );
}
