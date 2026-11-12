'use client';

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import Ico from '@/components/Ico';

type Servico = 'gmail' | 'outlook' | 'outro';

const cartao: CSSProperties = {
  borderRadius: 16, padding: '15px 18px', display: 'flex', flexDirection: 'column', gap: 8,
  background: 'var(--leitor-btn)', border: '1px solid var(--leitor-borda)',
};
const txt: CSSProperties = { margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)' };
const forte: CSSProperties = { color: 'var(--leitor-txt)', fontWeight: 600 };
const botao: CSSProperties = {
  alignSelf: 'flex-start', border: '1px solid var(--leitor-borda)', borderRadius: 999, background: 'transparent',
  color: 'var(--leitor-txt)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: '8px 14px', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
};

/** Aceita emails ou domínios, um por linha (ou separados por vírgulas/espaços). */
function lerRemetentes(bruto: string): string[] {
  const vistos = new Set<string>();
  for (const t of bruto.split(/[\s,;]+/)) {
    const v = t.trim().toLowerCase().replace(/^<|>$/g, '');
    if (/^([a-z0-9._%+-]+@)?[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v)) vistos.add(v);
  }
  return [...vistos].slice(0, 80);
}

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;');

function Passo({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <div style={cartao}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 24, height: 24, borderRadius: 999, background: 'rgba(27,224,60,0.16)', color: 'var(--ico-cor)', fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{n}</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--leitor-txt)' }}>{titulo}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * Definições → Migrar: passa newsletters do Gmail/Outlook/outros para o inread por reencaminhamento automático.
 * O inread nunca tem acesso à caixa de correio do utilizador — a regra vive no fornecedor de email dele.
 */
export default function MigrarEmail({ alias, codigoGmail }: { alias: string; codigoGmail: string | null }) {
  const [servico, setServico] = useState<Servico>('gmail');
  const [bruto, setBruto] = useState('');
  const [copiado, setCopiado] = useState<string | null>(null);

  const remetentes = useMemo(() => lerRemetentes(bruto), [bruto]);
  const consulta = remetentes.join(' OR ');

  async function copiar(texto: string, id: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(id);
      setTimeout(() => setCopiado(null), 1500);
    } catch {}
  }

  function descarregarFiltros() {
    const conteudo =
      `<?xml version='1.0' encoding='UTF-8'?>\n<feed xmlns='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>\n` +
      `<title>Mail Filters</title>\n<entry>\n<category term='filter'></category>\n<title>inread</title>\n<content></content>\n` +
      `<apps:property name='from' value='${xml(consulta)}'/>\n<apps:property name='forwardTo' value='${xml(alias)}'/>\n` +
      `<apps:property name='shouldArchive' value='true'/>\n</entry>\n</feed>\n`;
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inread-filtros-gmail.xml';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const copiarAlias = (
    <button type="button" style={botao} onClick={() => copiar(alias, 'alias')}>
      <Ico n={copiado === 'alias' ? 'check' : 'inbox'} s={14} /> {copiado === 'alias' ? 'Copiado' : `Copiar ${alias}`}
    </button>
  );

  const campoRemetentes = (
    <>
      <textarea
        value={bruto}
        onChange={(e) => setBruto(e.target.value)}
        rows={4}
        placeholder={'Um por linha — email ou domínio:\nnews@exemplo.com\nsubstack.com'}
        aria-label="Remetentes das newsletters a migrar"
        style={{ width: '100%', boxSizing: 'border-box', borderRadius: 12, border: '1px solid var(--leitor-borda)', background: 'var(--leitor-bg)', color: 'var(--leitor-txt)', fontFamily: 'inherit', fontSize: 16, lineHeight: 1.5, padding: '10px 12px', resize: 'vertical' }}
      />
      <p style={{ ...txt, fontSize: 12.5 }}>
        {remetentes.length === 0 ? 'Escreve os remetentes das newsletters que queres passar para o inread.' : `${remetentes.length} remetente${remetentes.length > 1 ? 's' : ''} reconhecido${remetentes.length > 1 ? 's' : ''}.`}
      </p>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ ...txt, margin: '0 4px' }}>
        Passa as newsletters que já recebes para o inread com uma regra de reencaminhamento no teu email. Deixam de aparecer na tua caixa de entrada e chegam aqui, limpas. <span style={forte}>O inread nunca tem acesso à tua caixa de correio.</span>
      </p>

      <div className="seg-trilho" role="tablist" style={{ alignSelf: 'flex-start' }}>
        {([['gmail', 'Gmail'], ['outlook', 'Outlook'], ['outro', 'Outros']] as [Servico, string][]).map(([id, rotulo]) => (
          <button key={id} type="button" role="tab" aria-selected={servico === id} onClick={() => setServico(id)} className={servico === id ? 'seg-item on' : 'seg-item'} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {rotulo}
          </button>
        ))}
      </div>

      {servico === 'gmail' && (
        <>
          <Passo n={1} titulo="Adiciona o teu endereço inread ao Gmail">
            <p style={txt}>No Gmail (no computador): <span style={forte}>Definições → Ver todas as definições → Encaminhamento e POP/IMAP → Adicionar um endereço de encaminhamento</span> e cola o teu endereço.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {copiarAlias}
              <a href="https://mail.google.com/mail/u/0/#settings/fwdandpop" target="_blank" rel="noopener noreferrer" style={botao}>Abrir definições do Gmail ↗</a>
            </div>
          </Passo>
          <Passo n={2} titulo="Confirma com o código que o Gmail envia">
            {codigoGmail ? (
              <>
                <p style={txt}>O Gmail enviou o código de confirmação para a tua caixa inread:</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--leitor-txt)' }}>{codigoGmail}</span>
                  <button type="button" style={botao} onClick={() => copiar(codigoGmail, 'codigo')}>{copiado === 'codigo' ? 'Copiado' : 'Copiar código'}</button>
                </div>
                <p style={{ ...txt, fontSize: 12.5 }}>Cola-o no Gmail, no campo de verificação junto ao endereço de encaminhamento.</p>
              </>
            ) : (
              <>
                <p style={txt}>O Gmail envia um email com um código para o teu endereço inread. Aparece aqui e na tua caixa em poucos segundos.</p>
                <a href="/definicoes" style={botao}>Já pedi — procurar o código</a>
              </>
            )}
          </Passo>
          <Passo n={3} titulo="Deixa o encaminhamento geral desligado">
            <p style={txt}>Na mesma página, mantém selecionado <span style={forte}>«Desativar encaminhamento»</span>. Assim só seguem para o inread as newsletters que escolheres no passo seguinte — o resto do teu email não sai do Gmail.</p>
          </Passo>
          <Passo n={4} titulo="Escolhe as newsletters a migrar">
            {campoRemetentes}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" style={{ ...botao, opacity: remetentes.length ? 1 : 0.5 }} disabled={!remetentes.length} onClick={descarregarFiltros}>Descarregar filtro para o Gmail</button>
              <button type="button" style={{ ...botao, opacity: remetentes.length ? 1 : 0.5 }} disabled={!remetentes.length} onClick={() => copiar(consulta, 'consulta')}>{copiado === 'consulta' ? 'Copiado' : 'Copiar lista (De:)'}</button>
              <a href="https://mail.google.com/mail/u/0/#settings/filters" target="_blank" rel="noopener noreferrer" style={botao}>Abrir filtros do Gmail ↗</a>
            </div>
            <p style={{ ...txt, fontSize: 12.5 }}>
              No Gmail: <span style={forte}>Filtros e endereços bloqueados → Importar filtros</span> e escolhe o ficheiro. Ou cria o filtro à mão: cola a lista no campo «De», e marca «Encaminhar para {alias}» e «Ignorar a caixa de entrada (arquivar)».
            </p>
          </Passo>
        </>
      )}

      {servico === 'outlook' && (
        <>
          <Passo n={1} titulo="Cria uma regra no Outlook">
            <p style={txt}>No Outlook na web: <span style={forte}>Definições → Correio → Regras → Adicionar nova regra</span>.</p>
            <a href="https://outlook.live.com/mail/0/options/mail/rules" target="_blank" rel="noopener noreferrer" style={botao}>Abrir regras do Outlook ↗</a>
          </Passo>
          <Passo n={2} titulo="Condição: os remetentes das newsletters">
            {campoRemetentes}
            <p style={txt}>Em <span style={forte}>«Adicionar uma condição»</span> escolhe <span style={forte}>«De»</span> e adiciona cada remetente (ou «O endereço do remetente inclui» para domínios).</p>
            <button type="button" style={{ ...botao, opacity: remetentes.length ? 1 : 0.5 }} disabled={!remetentes.length} onClick={() => copiar(remetentes.join('; '), 'consulta')}>{copiado === 'consulta' ? 'Copiado' : 'Copiar lista'}</button>
          </Passo>
          <Passo n={3} titulo="Ação: redirecionar para o inread">
            <p style={txt}>Em <span style={forte}>«Adicionar uma ação»</span> escolhe <span style={forte}>«Redirecionar para»</span> (não «Reencaminhar» — o redirecionamento mantém o remetente original) e cola o teu endereço. Para saírem da caixa de entrada, junta a ação <span style={forte}>«Mover para → Arquivo»</span>.</p>
            {copiarAlias}
          </Passo>
          <p style={{ ...txt, margin: '0 4px', fontSize: 12.5 }}>Contas de trabalho (Microsoft 365) podem ter o reencaminhamento para fora bloqueado pela empresa. Nesse caso usa a opção «Outros».</p>
        </>
      )}

      {servico === 'outro' && (
        <>
          <Passo n={1} titulo="A forma definitiva: mudar o email da subscrição">
            <p style={txt}>Em qualquer newsletter, abre o link <span style={forte}>«gerir preferências»</span> ou «atualizar perfil» no rodapé e troca o teu email pelo teu endereço inread. Funciona com qualquer fornecedor e a newsletter deixa de passar pelo teu email pessoal.</p>
            {copiarAlias}
          </Passo>
          <Passo n={2} titulo="Ou uma regra de reencaminhamento">
            <p style={txt}>
              <span style={forte}>iCloud Mail:</span> Definições → Regras → «Se o remetente for…» → «Reencaminhar para».<br />
              <span style={forte}>Proton Mail:</span> Definições → Reencaminhamento (planos pagos).<br />
              <span style={forte}>Yahoo e outros:</span> procura «Filtros» ou «Regras» nas definições e escolhe reencaminhar/redirecionar para o teu endereço inread.
            </p>
          </Passo>
          <Passo n={3} titulo="Se não houver reencaminhamento">
            <p style={txt}>Subscreve de novo a newsletter com o teu endereço inread e cancela a subscrição antiga. No inread, cada edição tem «Cancelar subscrição» no menu ⋯ quando quiseres sair.</p>
          </Passo>
        </>
      )}
    </div>
  );
}
