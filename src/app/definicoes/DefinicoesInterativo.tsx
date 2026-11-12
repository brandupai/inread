'use client';

import { useState, type CSSProperties, type ReactNode, type ComponentProps, useEffect } from 'react';
import SidebarNav from '@/components/SidebarNav';
import VoltarMobile from '@/components/VoltarMobile';
import TrocarEmail from './TrocarEmail';
import PainelInstalar from '@/components/Instalar';
import Notificacoes from '@/components/Notificacoes';
import Ico from '@/components/Ico';
import EscolherTema from '@/components/EscolherTema';
import MigrarEmail from './MigrarEmail';
import Partilhar from '@/components/Partilhar';
import Ligacoes from './Ligacoes';
import VoltarLista from '@/components/VoltarLista';

type Categoria = 'plano' | 'migrar' | 'partilhar' | 'aparencia' | 'instalar' | 'notificacoes' | 'conta' | 'ligacoes' | 'organizacao' | 'estatisticas' | 'sessao';

const CATEGORIAS: { id: Categoria; rotulo: string; icone: string }[] = [
  { id: 'plano', rotulo: 'Plano', icone: 'sparkle' },
  { id: 'migrar', rotulo: 'Migrar do Gmail / Outlook', icone: 'inbox' },
  { id: 'partilhar', rotulo: 'Partilhar o inread', icone: 'send' },
  { id: 'aparencia', rotulo: 'Aparência', icone: 'sun' },
  { id: 'instalar', rotulo: 'Instalar app', icone: 'phone' },
  { id: 'notificacoes', rotulo: 'Notificações', icone: 'bell' },
  { id: 'conta', rotulo: 'Conta', icone: 'user' },
  { id: 'ligacoes', rotulo: 'Ligações', icone: 'link' },
  { id: 'organizacao', rotulo: 'Organização', icone: 'tag' },
  { id: 'estatisticas', rotulo: 'Estatísticas', icone: 'chart' },
  { id: 'sessao', rotulo: 'Sessão', icone: 'logout' },
];

function Linha({ titulo, detalhe, extra, href }: { titulo: string; detalhe?: string; extra?: string; href?: string }) {
  const conteudo = (
    <>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--leitor-txt)' }}>{titulo}</span>
        {detalhe && <span style={{ fontSize: 12.5, color: 'var(--leitor-txt-fraco)', lineHeight: 1.5 }}>{detalhe}</span>}
      </span>
      <span style={{ flex: '0 0 auto', fontSize: 12, fontWeight: 600, color: 'var(--leitor-txt-fraco)' }}>{extra ?? (href ? '›' : '')}</span>
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
    <div style={{ padding: '2px 4px 2px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--leitor-txt-fraco)' }}>
      {texto}
    </div>
  );
}

export default function DefinicoesInterativo({
  alias, ehPro, billingEnabled, total, limiteFree,
  emailAtual, aviso, pedirTrocaEmail,
  lidas, favoritas, highlights, minutosTotais, mediaDiaria,
  sair, authEnabled, porLer, codigoGmail, categoriaInicial, ligacoes,
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
  codigoGmail: string | null;
  categoriaInicial?: string;
  ligacoes: ComponentProps<typeof Ligacoes>;
}) {
  const inicial = CATEGORIAS.find((c) => c.id === categoriaInicial)?.id;
  const [categoria, setCategoria] = useState<Categoria>(inicial ?? 'plano');
  const [aberto, setAberto] = useState(Boolean(inicial));
  useEffect(() => { if (aberto) window.scrollTo(0, 0); }, [aberto]);

  const conteudo: Record<Categoria, ReactNode> = {
    plano: (
      <>
        <Linha
          titulo={ehPro ? 'Plano Pro' : 'Passar ao inread Pro'}
          detalhe={
            ehPro
              ? 'Armazenamento ilimitado, resumos IA e áudio (em rollout). Gerir pagamento, faturas ou cancelar.'
              : `€4,99/mês ou €49,99/ano (2 meses grátis) — armazenamento ilimitado, resumos IA e áudio. Estás no plano Free (${total}/${limiteFree} na caixa).`
          }
          extra={ehPro ? (billingEnabled ? 'Gerir ›' : '') : billingEnabled ? 'Ver planos ›' : 'Brevemente'}
          href={billingEnabled ? (ehPro ? '/api/stripe/portal' : '/pro') : undefined}
        />
        {!ehPro && billingEnabled && (
          <p style={{ margin: '2px 4px 0', fontSize: 12, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)' }}>
            No plano anual poupas o equivalente a 2 meses face ao mensal.
          </p>
        )}
      </>
    ),
    migrar: <MigrarEmail alias={alias} codigoGmail={codigoGmail} />,
    partilhar: (
      <>
        <p style={{ margin: '0 4px 4px', fontSize: 13.5, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)' }}>
          Gostas do inread? Envia-o a quem também anda afogado em newsletters. O link leva à página inicial — não partilha nada da tua conta.
        </p>
        <Partilhar />
      </>
    ),
    aparencia: <EscolherTema />,
    instalar: (
      <>
        <p style={{ margin: '0 4px 4px', fontSize: 13.5, lineHeight: 1.6, color: 'var(--leitor-txt-fraco)' }}>
          Instala o inread como uma app: abre em janela própria, com o seu ícone, sem a barra do browser.
        </p>
        <PainelInstalar />
      </>
    ),
    notificacoes: <Notificacoes />,
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
          detalhe="Importar o histórico com acesso apenas de leitura. Para já, usa «Migrar do Gmail / Outlook» — passa as newsletters para o inread sem dar acesso à tua caixa."
          extra="Brevemente"
        />
        <Ligacoes {...ligacoes} />
        <Linha
          titulo="Obsidian e Markdown"
          detalhe="Em qualquer newsletter, no menu ⋯: «Abrir no Obsidian» cria a nota com o artigo e os teus sublinhados; «Copiar em Markdown» cola-se em qualquer app de notas; «Exportar .md» descarrega o ficheiro."
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
        <span style={{ fontSize: 12.5, color: 'var(--leitor-txt-fraco)' }}>Tempo médio de leitura por dia</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, lineHeight: 1.1, color: 'var(--leitor-txt)' }}>
          {mediaDiaria < 1 ? '< 1 min' : `${mediaDiaria} min`}
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 10, fontSize: 12.5, color: 'var(--leitor-txt-fraco)', flexWrap: 'wrap' }}>
          <span><strong style={{ color: 'var(--leitor-txt)' }}>{lidas}</strong> lidas</span>
          <span><strong style={{ color: 'var(--leitor-txt)' }}>{favoritas}</strong> guardadas</span>
          <span><strong style={{ color: 'var(--leitor-txt)' }}>{highlights}</strong> highlights</span>
          <span><strong style={{ color: 'var(--leitor-txt)' }}>{minutosTotais}</strong> min de leitura</span>
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
      <p style={{ fontSize: 13, color: 'var(--leitor-txt-fraco)' }}>Sem sessão ativa.</p>
    ),
  };

  return (
    <div className={aberto ? 'app3 m-leitor' : 'app3 m-lista'}>
      <SidebarNav ativo="definicoes" porLer={porLer} />

      {/* Coluna B */}
      <section className="col-lista" onClickCapture={(e) => { if ((e.target as HTMLElement).closest('button, a, .f-chip')) setAberto(true); }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 4px' }}>
          <VoltarMobile />
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
            <span style={{ width: 36, height: 36, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: 'rgba(27,224,60,0.12)', color: 'var(--ico-cor)', flex: '0 0 auto' }}>
              <Ico n={c.icone} s={17} />
            </span>
            <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700, flex: '1 1 auto' }}>{c.rotulo}</span>
          </button>
        ))}

        <a href="/remetentes" className="m-carta so-mobile" style={{ alignItems: 'center' }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: 'rgba(27,224,60,0.12)', color: 'var(--ico-cor)', flex: '0 0 auto' }}><Ico n="building" s={17} /></span>
          <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700, flex: '1 1 auto' }}>Remetentes</span>
        </a>

        <p className="t-app-tenue" style={{ fontSize: 12, lineHeight: 1.6, padding: '14px 2px 2px' }}>
          inread.app · as tuas newsletters, fora da caixa de entrada
        </p>
      </section>

      {/* Coluna C */}
      <main className="col-leitor" style={{ alignItems: 'stretch', justifyContent: 'flex-start', overflowY: 'auto' }}>
        <VoltarLista onClick={() => setAberto(false)} />
        <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: '28px 24px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Titulo texto={CATEGORIAS.find((c) => c.id === categoria)?.rotulo ?? ''} />
          {conteudo[categoria]}
        </div>
      </main>
    </div>
  );
}
