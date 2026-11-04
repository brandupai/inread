import RodapeSite from '@/components/RodapeSite';

export const metadata = { title: 'Changelog — inread' };

const ENTRADAS: Array<{ data: string; titulo: string; itens: string[] }> = [
  {
    data: '4 de novembro de 2026',
    titulo: 'A caixa vira app: 3 colunas, Pro ativo e documentação',
    itens: [
      'Nova caixa em 3 colunas — navegação, lista e leitor lado a lado, com sidebar colapsável',
      'Filtros de período (24 h / 7 dias / 30 dias / Sempre) e modo "Por ler"',
      'Leitor em fundo claro com barra de ações: anterior/seguinte, expandir, tamanho da letra, guardar, lido e menu de opções',
      'Seleciona texto e partilha na hora: Sublinhar, Copiar, WhatsApp, Email, X',
      'Cancelar subscrição direto no leitor (usa o link oficial da newsletter)',
      'Caixa atualiza-se sozinha e tem botão de atualizar',
      'inread Pro ativo: checkout seguro, portal de cliente para faturas e cancelamento',
      'Nova página /pro com escolha entre mensal e anual',
      'Documentação completa em inread.app/docs',
      'Entregabilidade do email de login melhorada (DMARC)',
    ],
  },
  {
    data: '3 de novembro de 2026',
    titulo: 'Site novo, highlights e organização automática',
    itens: [
      'Novo design do site — fundo escuro, tipografia nova e animações',
      'Highlights: seleciona texto no leitor para o guardares; exportam no .md',
      'Etiquetas duplas automáticas (formato + contexto) com filtros na caixa',
      'Pesquisa por assunto, remetente e texto completo',
      'Página Remetentes com cancelamento de subscrição num clique',
      'Definições com estatísticas de leitura e gestão da conta',
      'Guardados com separadores Newsletters e Highlights',
      'Páginas de Ajuda, FAQ, contactos, privacidade e termos',
      'Preço de lançamento do Pro: €4,99/mês (em vez de €7,99) até ao fim do ano',
    ],
  },
  {
    data: '3 de novembro de 2026',
    titulo: 'Lançamento do inread',
    itens: [
      'Endereço privado nome@inread.app — escolhes o teu no primeiro acesso',
      'Entrada sem passwords: link mágico por email ou conta Google',
      'Motor de leitura limpa: remove scripts, popups e pixels de rastreio, mantém 100% do texto',
      'Favoritos, marcar como lida e exportação em Markdown',
      'Plano Free com 50 newsletters ativas na caixa',
    ],
  },
];

const A_CAMINHO = [
  'Resumos com IA e apanhado diário em áudio (Pro)',
  'Ligação de leitura ao Gmail e Outlook',
  'Integrações diretas: Notion, Obsidian, Evernote, Google Keep, Apple Notes',
  'Descobrir: diretório de newsletters para encontrares novas leituras',
  'API pública e webhooks',
  'Apps iPhone, Android, Mac e Windows',
];

export default function Changelog() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <a href="/" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-light)' }}>‹ inread.app</a>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(30px, 5vw, 42px)' }}>Changelog</h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          Tudo o que muda no inread, por ordem. Construímos em público.
        </p>
        {ENTRADAS.map((e) => (
          <article key={e.titulo} className="glass" style={{ borderRadius: 18, padding: '22px 22px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand)' }}>{e.data}</span>
            <h2 style={{ margin: 0, fontSize: 22 }}>{e.titulo}</h2>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 7, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
              {e.itens.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
        <article className="glass" style={{ borderRadius: 18, padding: '22px 22px 18px', display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid rgba(74,204,95,0.9)' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-dark)' }}>A caminho</span>
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 7, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
            {A_CAMINHO.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--quiet)' }}>
            Tens uma sugestão? <a href="/contactos" style={{ fontWeight: 600 }}>Diz-nos</a> — o roadmap ouve.
          </p>
        </article>
      </main>
      <RodapeSite />
    </div>
  );
}
