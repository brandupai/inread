'use client';

import { useState, type CSSProperties } from 'react';
import Ico from '@/components/Ico';

type Acao = (formData: FormData) => void;

const cartao: CSSProperties = {
  borderRadius: 16, padding: '15px 18px', display: 'flex', flexDirection: 'column', gap: 9,
  background: 'var(--leitor-btn)', border: '1px solid var(--leitor-borda)',
};
const titulo: CSSProperties = { fontSize: 15, fontWeight: 600, color: 'var(--leitor-txt)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' };
const txt: CSSProperties = { margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)' };
const botao: CSSProperties = {
  border: '1px solid var(--leitor-borda)', borderRadius: 999, background: 'transparent', color: 'var(--leitor-txt)',
  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: '8px 14px', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
};
const botaoForte: CSSProperties = { ...botao, background: '#14150f', color: '#fff', border: '1px solid #14150f' };
const pilula = (ligado: boolean): CSSProperties => ({
  fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 9px',
  background: ligado ? 'rgba(27,224,60,0.18)' : 'var(--leitor-btn-hover)', color: ligado ? 'var(--ico-cor)' : 'var(--leitor-txt-fraco)',
});

const AVISOS: Record<string, { t: string; ok: boolean }> = {
  'feed-ok': { t: 'Feed RSS criado. Copia o endereço para o teu leitor de RSS.', ok: true },
  'feed-off': { t: 'Feed RSS desligado. O endereço antigo deixou de funcionar.', ok: true },
  'readwise-ok': { t: 'Readwise ligado. Os novos sublinhados seguem automaticamente.', ok: true },
  'readwise-invalido': { t: 'O Readwise não aceitou esse token. Confirma em readwise.io/access_token.', ok: false },
  'readwise-off': { t: 'Readwise desligado.', ok: true },
  'readwise-sync': { t: 'Sublinhados enviados para o Readwise.', ok: true },
  'readwise-falhou': { t: 'Não foi possível enviar para o Readwise. Tenta de novo daqui a pouco.', ok: false },
  'notion-ok': { t: 'Notion ligado. Usa «Enviar para o Notion» no menu ⋯ de qualquer newsletter.', ok: true },
  'notion-sempagina': { t: 'Notion ligado, mas sem nenhuma página partilhada. Volta a ligar e escolhe uma página onde o inread possa criar notas.', ok: false },
  'notion-erro': { t: 'A ligação ao Notion não ficou concluída. Tenta de novo.', ok: false },
  'notion-off': { t: 'Notion desligado.', ok: true },
  'notion-indisponivel': { t: 'A ligação ao Notion ainda não está disponível.', ok: false },
};

export default function Ligacoes({
  feedUrl, readwiseLigado, notionAtivo, notionLigado, notionWorkspace, aviso,
  acaoFeed, acaoReadwise, acaoNotion,
}: {
  feedUrl: string | null;
  readwiseLigado: boolean;
  notionAtivo: boolean;
  notionLigado: boolean;
  notionWorkspace: string | null;
  aviso?: string;
  acaoFeed: Acao;
  acaoReadwise: Acao;
  acaoNotion: Acao;
}) {
  const [copiado, setCopiado] = useState(false);
  const msg = aviso ? AVISOS[aviso] : undefined;

  async function copiar() {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {}
  }

  return (
    <>
      {msg && (
        <div role="status" style={{ ...cartao, padding: '11px 16px', borderColor: msg.ok ? 'rgba(27,224,60,0.5)' : 'rgba(226,87,79,0.5)', fontSize: 13.5, color: 'var(--leitor-txt)' }}>
          {msg.t}
        </div>
      )}

      {/* Feed RSS privado */}
      <div style={cartao}>
        <div style={titulo}>Feed RSS privado <span style={pilula(Boolean(feedUrl))}>{feedUrl ? 'Ativo' : 'Desligado'}</span></div>
        <p style={txt}>Lê as tuas newsletters em qualquer leitor de RSS (Feedly, Reeder, NetNewsWire…). O endereço é secreto: quem o tiver consegue ler o feed.</p>
        {feedUrl && (
          <input readOnly value={feedUrl} onFocus={(e) => e.currentTarget.select()} aria-label="Endereço do feed RSS"
            style={{ width: '100%', boxSizing: 'border-box', height: 40, borderRadius: 10, border: '1px solid var(--leitor-borda)', background: 'var(--leitor-bg)', color: 'var(--leitor-txt)', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16, padding: '0 10px' }} />
        )}
        <form action={acaoFeed} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {feedUrl ? (
            <>
              <button type="button" style={botaoForte} onClick={copiar}><Ico n={copiado ? 'check' : 'link'} s={14} /> {copiado ? 'Copiado' : 'Copiar endereço'}</button>
              <button type="submit" name="op" value="novo" style={botao}>Gerar novo endereço</button>
              <button type="submit" name="op" value="desligar" style={botao}>Desligar</button>
            </>
          ) : (
            <button type="submit" name="op" value="novo" style={botaoForte}>Criar feed RSS</button>
          )}
        </form>
      </div>

      {/* Readwise */}
      <div style={cartao}>
        <div style={titulo}>Readwise <span style={pilula(readwiseLigado)}>{readwiseLigado ? 'Ligado' : 'Desligado'}</span></div>
        <p style={txt}>Envia os teus sublinhados para o Readwise — cada novo sublinhado segue automaticamente, com o título e o autor da newsletter.</p>
        {readwiseLigado ? (
          <form action={acaoReadwise} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="submit" name="op" value="sync" style={botaoForte}>Enviar todos os sublinhados</button>
            <button type="submit" name="op" value="desligar" style={botao}>Desligar</button>
          </form>
        ) : (
          <form action={acaoReadwise} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input name="token" required autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="Token de acesso do Readwise" aria-label="Token de acesso do Readwise"
              style={{ flex: '1 1 220px', minWidth: 0, height: 40, borderRadius: 10, border: '1px solid var(--leitor-borda)', background: 'var(--leitor-bg)', color: 'var(--leitor-txt)', fontFamily: 'inherit', fontSize: 16, padding: '0 12px' }} />
            <button type="submit" name="op" value="ligar" style={botaoForte}>Ligar</button>
            <a href="https://readwise.io/access_token" target="_blank" rel="noopener noreferrer" style={botao}>Obter token ↗</a>
          </form>
        )}
      </div>

      {/* Notion */}
      <div style={cartao}>
        <div style={titulo}>Notion <span style={pilula(notionLigado)}>{notionLigado ? `Ligado${notionWorkspace ? ` · ${notionWorkspace}` : ''}` : notionAtivo ? 'Desligado' : 'Brevemente'}</span></div>
        <p style={txt}>
          {notionAtivo
            ? 'Liga o teu Notion e escolhe uma página. Depois, em qualquer newsletter, «Enviar para o Notion» cria lá uma página com o artigo e os teus sublinhados.'
            : 'A ligação direta está a caminho. Para já, «Copiar em Markdown» no menu ⋯ de cada newsletter cola-se direto numa página do Notion.'}
        </p>
        {notionAtivo && (
          <form action={acaoNotion} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="/api/notion/ligar" style={notionLigado ? botao : botaoForte}>{notionLigado ? 'Ligar de novo / mudar de página' : 'Ligar o Notion'}</a>
            {notionLigado && <button type="submit" name="op" value="desligar" style={botao}>Desligar</button>}
          </form>
        )}
      </div>
    </>
  );
}
