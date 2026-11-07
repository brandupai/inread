'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import SidebarNav from '@/components/SidebarNav';
import TrocarEmail from './TrocarEmail';

type Categoria = 'plano' | 'conta' | 'ligacoes' | 'organizacao' | 'estatisticas' | 'sessao';

const CATEGORIAS: { id: Categoria; rotulo: string; icone: string }[] = [
  { id: 'plano', rotulo: 'Plano', icone: '✦' },
  { id: 'conta', rotulo: 'Conta', icone: '👤' },
  { id: 'ligacoes', rotulo: 'Ligações', icone: '🔗' },
  { id: 'organizacao', rotulo: 'Organização', icone: '🏷️' },
  { id: 'estatisticas', rotulo: 'Estatísticas', icone: '📊' },
  { id: 'sessao', rotulo: 'Sessão', icone: '🚪' },
];

function Linha({ titulo, detalhe, extra, href }: { titulo: string; detalhe?: string; extra?: string; href?: string }) {
  const conteudo = (
    <>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{titulo}</span>
        {detalhe && <span style={{ fontSize: 12.5, color: 'var(--quiet)', lineHeight: 1.5 }}>{detalhe}</span>}
      </span>
      <span style={{ flex: '0 0 auto', fontSize: 12, fontWeight: 600, color: 'var(--faint)' }}>{extra ?? (href ? '›' : '')}</span>
    </>
  );
  const estilo: CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
    borderRadius: 16, padding: '15px 18px', width: '100%', textAlign: 'left',
  };
  return href ? (
    <a href={href} className="glass" style={estilo}>{conteudo}</a>
  ) : (
    <div className="glass" style={estilo}>{conteudo}</div>
  );
}

function Titulo({ texto }: { texto: string }) {
  return (
    <div style={{ padding: '2px 4px 2px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--quiet)' }}>
      {texto}
    </div>
  );
}

export default function DefinicoesInterativo({
  alias, ehPro, billingEnabled, total, limiteFree,
  emailAtual, aviso, pedirTrocaEmail,
  lidas, favoritas, highlights, minutosTotais, mediaDiaria,
  sair, authEnabled, porLer,
}: {
  alias: string;
  ehPro: boolean;
  billingEnabled: boolean;
  total: number;
  limiteFree: number;
  emailAtual: string;
  aviso?: string;
  pedirTrocaEmail: (formData: FormData) => void;
  lidas: number;
  favoritas: number;
  highlights: number;
  minutosTotais: number;
  mediaDiaria: number;
  sair: () => void;
  authEnabled: boolean;
  porLer: number;
}) {
  const [categoria, setCategoria] = useState<Categoria>('plano');

  const conteudo: Record<Categoria, ReactNode> = {
    plano: (
      <>
        <Linha
          titulo={ehPro ? 'Plano Pro ✦' : 'Passar ao inread Pro'}
          detalhe={
            ehPro
              ? 'Armazenamento ilimitado, resumos IA e áudio (em rollout). Gerir pagamento, faturas ou cancelar.'
              : `€4,99/mês ou €49,99/ano (2 meses grátis) — armazenamento ilimitado, resumos IA e áudio. Estás no plano Free (${total}/${limiteFree} na caixa).`
          }
          extra={ehPro ? (billingEnabled ? 'Gerir ›' : '') : billingEnabled ? 'Ver planos ›' : 'Brevemente'}
          href={billingEnabled ? (ehPro ? '/api/stripe/portal' : '/pro') : undefined}
        />
        {!ehPro && billingEnabled && (
          <p style={{ margin: '2px 4px 0', fontSize: 12, lineHeight: 1.6, color: 'var(--faint)' }}>
            No plano anual poupas o equivalente a 2 meses face ao mensal.
          </p>
        )}
      </>
    ),
    conta: (
      <>
        <Linha
          titulo="O teu user inread"
          detalhe={`${alias} — é o endereço onde recebes as newsletters. Fica contigo para sempre e não pode ser alterado.`}
          extra="fixo"
        />
        <TrocarEmail emailAtual={emailAtual} aviso={aviso} acao={pedirTrocaEmail} />
        <Linha
          titulo="Como adicionar newsletters"
          detalhe={`Nas páginas de subscrição das tuas newsletters favoritas, usa ${alias} em vez do teu email pessoal. Elas passam a chegar aqui, limpas — sem tocar na tua caixa de trabalho.`}
        />
      </>
    ),
    ligacoes: (
      <>
        <Linha
          titulo="Ligar Gmail / Outlook (leitura)"
          detalhe="Importa as newsletters que já recebes, com acesso apenas de leitura. Opcional — o alias continua a ser o caminho mais privado."
          extra="Brevemente"
        />
        <Linha
          titulo="Integrações: Notion · Obsidian · Zapier"
          detalhe="Exportação direta dos teus highlights. Para já, usa o Exportar .md em qualquer newsletter — Markdown limpo que o Obsidian e o Notion importam na perfeição."
          extra="Brevemente"
        />
        <Linha
          titulo="API e webhooks"
          detalhe="Acesso programático à tua caixa, mesmo nos planos baratos. Em desenho — diz-nos o que queres construir."
          extra="Brevemente"
        />
      </>
    ),
    organizacao: (
      <>
        <Linha
          titulo="Etiquetas automáticas"
          detalhe="Cada newsletter recebe duas etiquetas automáticas: o formato (newsletter, vídeo, thread) e o contexto (Trabalho, Finanças, Tecnologia, Notícias, Lazer). Usa os filtros no topo da caixa."
        />
        <Linha titulo="Remetentes" detalhe="Vê todos os remetentes e cancela subscrições num clique." href="/remetentes" />
      </>
    ),
    estatisticas: (
      <div className="glass" style={{ borderRadius: 20, padding: '22px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12.5, color: 'var(--quiet)' }}>Tempo médio de leitura por dia</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, lineHeight: 1.1, color: 'var(--ink)' }}>
          {mediaDiaria < 1 ? '< 1 min' : `${mediaDiaria} min`}
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 10, fontSize: 12.5, color: 'var(--quiet)', flexWrap: 'wrap' }}>
          <span><strong style={{ color: 'var(--ink)' }}>{lidas}</strong> lidas</span>
          <span><strong style={{ color: 'var(--ink)' }}>{favoritas}</strong> guardadas</span>
          <span><strong style={{ color: 'var(--ink)' }}>{highlights}</strong> highlights</span>
          <span><strong style={{ color: 'var(--ink)' }}>{minutosTotais}</strong> min de leitura</span>
        </div>
      </div>
    ),
    sessao: authEnabled ? (
      <form action={sair}>
        <button
          type="submit"
          className="glass"
          style={{ width: '100%', border: '1px solid rgba(217,160,160,0.6)', borderRadius: 16, padding: '15px 18px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: '#8A3B3B', cursor: 'pointer', textAlign: 'center', background: 'rgba(255,255,255,0.55)' }}
        >
          Terminar sessão
        </button>
      </form>
    ) : (
      <p style={{ fontSize: 13, color: 'var(--faint)' }}>Sem sessão ativa.</p>
    ),
  };

  return (
    <div className="app3">
      <SidebarNav ativo="definicoes" porLer={porLer} />

      {/* Coluna B */}
      <section className="col-lista">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 4px' }}>
          <h1 className="t-app-forte" style={{ margin: 0, fontSize: 16, lineHeight: 1 }}>Definições</h1>
        </div>

        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoria(c.id)}
            className={categoria === c.id ? 'm-carta on' : 'm-carta'}
            style={{ alignItems: 'center', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <span style={{ width: 36, height: 36, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: 'rgba(27,224,60,0.12)', flex: '0 0 auto' }}>
              {c.icone}
            </span>
            <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700, flex: '1 1 auto' }}>{c.rotulo}</span>
          </button>
        ))}

        <p className="t-app-tenue" style={{ fontSize: 12, lineHeight: 1.6, padding: '14px 2px 2px' }}>
          inread.app · as tuas newsletters, fora da caixa de entrada
        </p>
      </section>

      {/* Coluna C */}
      <main className="col-leitor" style={{ alignItems: 'stretch', justifyContent: 'flex-start', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: '28px 24px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Titulo texto={CATEGORIAS.find((c) => c.id === categoria)?.rotulo ?? ''} />
          {conteudo[categoria]}
        </div>
      </main>
    </div>
  );
}
