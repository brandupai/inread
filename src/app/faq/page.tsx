import SiteShell from '@/components/SiteShell';

export const metadata = { title: 'Perguntas frequentes — inread' };

const FAQS: Array<{ p: string; r: string }> = [
  {
    p: 'O que é o inread?',
    r: 'Um leitor de newsletters: um lugar calmo, separado da tua caixa de entrada, onde as tuas newsletters chegam limpas — sem anúncios, popups nem pixels de rastreio — prontas para ler, sublinhar e exportar.',
  },
  {
    p: 'Preciso de dar acesso ao meu Gmail ou Outlook?',
    r: 'Não — essa é a diferença essencial. Crias um endereço privado (nome@inread.app) e usa-lo nas subscrições. Nunca pedimos acesso ao teu email. Mais tarde vais poder, opcionalmente, ligar o Gmail/Outlook em modo de leitura para importar o que já recebes.',
  },
  {
    p: 'Como adiciono as minhas newsletters?',
    r: 'Nas páginas de subscrição (Substack, beehiiv, Mailchimp, etc.), usa o teu endereço @inread.app em vez do pessoal. Nas newsletters que já recebes, atualiza o email da subscrição — quase todas têm um link "update your preferences" no rodapé.',
  },
  {
    p: 'O que inclui o plano Free?',
    r: 'O endereço privado @inread.app, leitura limpa, etiquetas automáticas, pesquisa, favoritos, highlights e exportação em Markdown — com até 50 newsletters ativas na caixa (as mais antigas não guardadas vão rodando). As guardadas nunca são removidas.',
  },
  {
    p: 'E o inread Pro?',
    r: 'Preço de lançamento: €4,99/mês ou €49,99/ano (em vez de €7,99/mês), garantido para quem aderir até ao final do ano. Inclui armazenamento ilimitado, resumos com IA no topo de cada edição, um apanhado diário em áudio e exportações avançadas. Está a chegar — o plano Free já dá para usar o produto todo no dia a dia.',
  },
  {
    p: 'Posso exportar os meus highlights para o Obsidian ou Notion?',
    r: 'Sim. Qualquer newsletter exporta em Markdown limpo (botão "Exportar .md"), com os teus highlights incluídos no fim — o Obsidian e o Notion importam diretamente. Integrações diretas e API estão no roadmap.',
  },
  {
    p: 'Como cancelo a subscrição de uma newsletter?',
    r: 'Na página Remetentes tens um botão "Cancelar" por publicação — usamos o mecanismo oficial de cancelamento do email, sem teres de procurar o link escondido no rodapé.',
  },
  {
    p: 'Os meus dados estão seguros? Vocês leem os meus emails?',
    r: 'As tuas newsletters são tuas. Não vendemos dados, não mostramos anúncios e removemos os rastreadores que vêm nos emails. Podes exportar tudo em Markdown e sair quando quiseres.',
  },
  {
    p: 'Há apps para telemóvel e desktop?',
    r: 'A web app funciona em qualquer dispositivo (e podes adicioná-la ao ecrã inicial). As apps nativas para iPhone, Android, Mac e Windows estão no roadmap.',
  },
];

export default function FAQ() {
  return (
    <SiteShell>
      <main style={{ width: '100%', maxWidth: 760, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: '4px 0 6px', fontSize: 'clamp(30px, 5vw, 42px)' }}>Perguntas frequentes</h1>
        {FAQS.map((f) => (
          <details key={f.p} className="glass" style={{ borderRadius: 16, padding: '4px 18px' }}>
            <summary style={{ cursor: 'pointer', padding: '14px 0', fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{f.p}</summary>
            <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{f.r}</p>
          </details>
        ))}
        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--quiet)' }}>
          Não encontraste a resposta? <a href="/contactos" style={{ fontWeight: 600 }}>Fala connosco</a>.
        </p>
      </main>
    </SiteShell>
  );
}
