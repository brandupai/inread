/** Conteúdo da documentação (docs.inread.app → /docs). HTML escrito por nós. */

export type PaginaDoc = { slug: string; titulo: string; html: string };
export type SeccaoDoc = { titulo: string; paginas: PaginaDoc[] };

export const DOCS: SeccaoDoc[] = [
  {
    titulo: 'Começar',
    paginas: [
      {
        slug: 'o-que-e-o-inread',
        titulo: 'O que é o inread?',
        html: `
<p>O inread é um leitor de newsletters: um lugar calmo, fora da tua caixa de email, onde as tuas subscrições chegam limpas e prontas a ler.</p>
<p>Ao criares conta recebes um <strong>endereço privado</strong> — <code>onome@inread.app</code>. Usa-o nas páginas de subscrição das newsletters que gostas e elas passam a chegar à tua caixa inread, organizadas com etiquetas automáticas, sem anúncios de permeio nem distrações.</p>
<h3>Primeiros passos</h3>
<ol>
<li><strong>Cria a conta</strong> em <a href="https://inread.app/login">inread.app/login</a> — com link mágico por email ou Google.</li>
<li><strong>Escolhe o teu endereço</strong> @inread.app (ficas com ele para sempre).</li>
<li><strong>Subscreve</strong> uma newsletter com esse endereço — a primeira edição aparece na caixa segundos depois de ser enviada.</li>
</ol>
<p>O plano gratuito inclui 50 newsletters ativas na caixa, etiquetas automáticas, pesquisa em todo o texto, sublinhados e exportação em Markdown.</p>`,
      },
      {
        slug: 'migrar-as-subscricoes',
        titulo: 'Migrar as tuas subscrições',
        html: `
<p>Já tens dezenas de newsletters no Gmail ou Outlook? A forma mais limpa de migrar:</p>
<ol>
<li>Abre uma edição recente de cada newsletter no teu email antigo.</li>
<li>No fundo, usa o link <em>gerir subscrição</em> / <em>update preferences</em> e troca o email pelo teu endereço @inread.app. Quando não existir, cancela e volta a subscrever no site da newsletter com o novo endereço.</li>
<li>Confirma o email de verificação, se a newsletter o enviar — ele chega à tua caixa inread.</li>
</ol>
<p>Dica: migra primeiro as 5 que lês sempre. O resto migra-se sozinho ao longo de uma semana, sempre que te lembrares de uma.</p>
<p>Em breve: ligação de leitura ao Gmail/Outlook para importar automaticamente as newsletters que já recebes.</p>`,
      },
    ],
  },
  {
    titulo: 'O teu endereço @inread.app',
    paginas: [
      {
        slug: 'como-funciona-o-endereco',
        titulo: 'Como funciona',
        html: `
<p>O teu endereço @inread.app é um email verdadeiro, mas pensado só para newsletters. Tudo o que lá chega:</p>
<ul>
<li>é <strong>limpo</strong> — tiramos o ruído de formatação e deixamos o conteúdo legível;</li>
<li>recebe <strong>duas etiquetas automáticas</strong>: o formato (newsletter, vídeo, thread) e o contexto (Trabalho, Finanças, Tecnologia, Notícias, Lazer);</li>
<li>fica <strong>pesquisável</strong> em todo o texto, para sempre (até 50 edições no plano gratuito, ilimitado no Pro).</li>
</ul>
<p>Nenhum email é partilhado com terceiros e não há rastreadores nossos no meio. Vê a <a href="https://inread.app/legal/privacidade">política de privacidade</a>.</p>`,
      },
      {
        slug: 'usar-o-endereco',
        titulo: 'Onde usar o endereço',
        html: `
<p>Usa o teu @inread.app em qualquer sítio que envie conteúdo por email:</p>
<ul>
<li>newsletters no Substack, beehiiv, Ghost, Kit e afins;</li>
<li>alertas e digests (Google Alerts, resumos de fóruns);</li>
<li>blogs com subscrição por email.</li>
</ul>
<p>Evita usá-lo para contas pessoais (bancos, lojas): o inread é uma caixa de leitura, não um email de recuperação de passwords.</p>`,
      },
    ],
  },
  {
    titulo: 'Conhecer o inread',
    paginas: [
      {
        slug: 'a-caixa',
        titulo: 'A caixa',
        html: `
<p>A caixa é a tua lista de leitura. À esquerda tens a navegação; ao centro, as edições; à direita, o leitor.</p>
<ul>
<li><strong>Período</strong> — filtra por Últimas 24 h, 7 dias, 30 dias ou Sempre.</li>
<li><strong>Por ler</strong> — mostra só o que ainda não abriste.</li>
<li><strong>Etiquetas</strong> — um toque numa etiqueta (Tecnologia, Finanças…) filtra a lista.</li>
<li><strong>Pesquisa</strong> — procura em assuntos, remetentes e no texto completo de todas as edições.</li>
<li><strong>✓ no topo</strong> — marca tudo como lido; o 🔄 verifica se chegou algo novo (a caixa também se atualiza sozinha).</li>
</ul>`,
      },
      {
        slug: 'o-leitor',
        titulo: 'O leitor',
        html: `
<p>Abrir uma edição marca-a como lida e mostra-a no leitor, com fundo claro e largura de leitura confortável.</p>
<p>Na barra do leitor tens: <strong>⤢</strong> expandir a largura, <strong>↑ ↓</strong> edição anterior/seguinte, <strong>✦</strong> resumo com IA (Pro), <strong>☀</strong> tamanho da letra, e o grupo de ações — <strong>guardar</strong> 🔖, <strong>lido/não lido</strong> ✓ e o menu <strong>⋯</strong> com Exportar .md, Responder, Ver edições do remetente e Cancelar subscrição.</p>`,
      },
      {
        slug: 'sublinhados-e-exportacao',
        titulo: 'Sublinhados e exportação',
        html: `
<p>Seleciona qualquer passagem de texto no leitor e aparece a barra de ações: <strong>✦ Sublinhar</strong>, Copiar, WhatsApp, Email e X.</p>
<p>Os sublinhados ficam guardados no fim de cada edição e em Guardados → Sublinhados. O botão <strong>Exportar .md</strong> gera um ficheiro Markdown limpo com o artigo e os teus sublinhados — pronto a importar no Notion, Obsidian, Apple Notes ou Evernote.</p>
<p>Em breve: exportação direta para Notion e Obsidian, e API para levares os teus dados para onde quiseres.</p>`,
      },
      {
        slug: 'etiquetas-automaticas',
        titulo: 'Etiquetas automáticas',
        html: `
<p>Cada edição recebe duas etiquetas sem fazeres nada:</p>
<ul>
<li><strong>Formato</strong> — newsletter, vídeo, thread, artigo;</li>
<li><strong>Contexto</strong> — Trabalho, Finanças, Tecnologia, Notícias ou Lazer, detetado a partir do remetente e do conteúdo.</li>
</ul>
<p>As etiquetas aparecem como filtros no topo da caixa. Grupos personalizados estão no plano de desenvolvimento.</p>`,
      },
      {
        slug: 'remetentes',
        titulo: 'Remetentes e cancelar subscrições',
        html: `
<p>Em <a href="https://inread.app/remetentes">Remetentes</a> vês todas as publicações que te escrevem: total de edições, por ler e a data da última.</p>
<p>O botão <strong>Cancelar</strong> usa o link de cancelamento oficial da própria newsletter (o cabeçalho <code>List-Unsubscribe</code>) — um clique e deixas de a receber. Sem dark patterns.</p>`,
      },
    ],
  },
  {
    titulo: 'inread Pro',
    paginas: [
      {
        slug: 'o-que-inclui-o-pro',
        titulo: 'O que inclui',
        html: `
<p>O inread Pro desbloqueia:</p>
<ul>
<li><strong>Armazenamento ilimitado</strong> — a caixa gratuita guarda 50 edições; no Pro ficam todas, para sempre;</li>
<li><strong>Resumos com IA e áudio diário</strong> (em rollout);</li>
<li><strong>Alias personalizado</strong> à tua escolha;</li>
<li><strong>Exportações avançadas</strong> (Notion, Obsidian) quando saírem.</li>
</ul>
<p><strong>Preço de lançamento:</strong> €4,99/mês ou €49,99/ano (antes €7,99/mês) — quem aderir até ao final do ano mantém este preço enquanto for assinante. <a href="https://inread.app/pro">Ativar o Pro →</a></p>`,
      },
      {
        slug: 'gerir-a-subscricao',
        titulo: 'Gerir a subscrição',
        html: `
<p>Em <a href="https://inread.app/definicoes">Definições</a> → <em>Plano Pro</em> → <strong>Gerir</strong> abres o portal de cliente (Stripe), onde podes:</p>
<ul>
<li>ver e descarregar faturas;</li>
<li>mudar o cartão;</li>
<li>trocar entre mensal e anual;</li>
<li>cancelar — mantém-te Pro até ao fim do período pago, e exportas tudo antes de sair.</li>
</ul>`,
      },
    ],
  },
  {
    titulo: 'FAQ e suporte',
    paginas: [
      {
        slug: 'perguntas-frequentes',
        titulo: 'Perguntas frequentes',
        html: `
<p><strong>O email de login não chegou.</strong> Verifica o spam e marca como "não é spam" — ajuda os próximos. Podes sempre pedir novo link.</p>
<p><strong>Subscrevi uma newsletter e não apareceu.</strong> Confirma primeiro o email de verificação que muitas newsletters enviam (ele chega à tua caixa inread). A caixa atualiza-se sozinha a cada minuto; o 🔄 força a verificação.</p>
<p><strong>Posso mudar o meu endereço @inread.app?</strong> O alias é fixo no plano gratuito; o alias personalizado faz parte do Pro. Escreve-nos para casos especiais.</p>
<p><strong>Como apago a conta?</strong> Escreve-nos de momento para <a href="mailto:suporte@inread.app">suporte@inread.app</a> — apagamos tudo, sem perguntas (podes exportar antes).</p>`,
      },
      {
        slug: 'contactar',
        titulo: 'Contactar o suporte',
        html: `
<p>Escreve para <a href="mailto:suporte@inread.app">suporte@inread.app</a> — lemos tudo e respondemos normalmente no próprio dia útil.</p>
<p>Sugestões de funcionalidades são especialmente bem-vindas: o inread está a ser construído com quem o usa. Vê o que está a caminho no <a href="https://inread.app/changelog">changelog</a>.</p>`,
      },
    ],
  },
];

export function todasAsPaginas(): (PaginaDoc & { seccao: string })[] {
  return DOCS.flatMap((s) => s.paginas.map((p) => ({ ...p, seccao: s.titulo })));
}

export function paginaPorSlug(slug: string) {
  return todasAsPaginas().find((p) => p.slug === slug) ?? null;
}
