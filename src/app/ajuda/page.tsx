import RodapeSite from '@/components/RodapeSite';

export const metadata = { title: 'Ajuda — inread' };

const GRUPOS: Array<{ titulo: string; artigos: Array<{ p: string; r: string }> }> = [
  {
    titulo: 'Começar',
    artigos: [
      {
        p: 'Criar conta e escolher o teu endereço',
        r: 'Entra com o teu email (enviamos-te um link de acesso, sem passwords) ou com a Google. No primeiro acesso escolhes o teu endereço nome@inread.app — escolhe com calma, porque por agora não dá para mudar. A partir daí, tudo o que for enviado para esse endereço aparece na tua caixa.',
      },
      {
        p: 'Subscrever a primeira newsletter',
        r: 'Vai à página de subscrição de uma newsletter que gostes (Substack, beehiiv, Ghost, site próprio…) e usa o teu endereço @inread.app em vez do pessoal. Em poucos minutos a edição de boas-vindas aparece na tua caixa, já limpa.',
      },
      {
        p: 'Instalar no telemóvel',
        r: 'A web app funciona em qualquer dispositivo. No iPhone: abre inread.app no Safari → botão de partilha → "Adicionar ao ecrã principal". No Android: Chrome → menu ⋮ → "Adicionar ao ecrã principal". Fica com ícone e abre a ecrã inteiro, como uma app.',
      },
    ],
  },
  {
    titulo: 'Subscrições e remetentes',
    artigos: [
      {
        p: 'Mudar as newsletters que já recebes para o inread',
        r: 'Quase todas as newsletters têm no rodapé um link "update your preferences" ou "change email". Abre-o e substitui o teu email pelo teu endereço @inread.app. Nas que não têm, cancela e volta a subscrever com o novo endereço.',
      },
      {
        p: 'Cancelar a subscrição de uma newsletter',
        r: 'Abre a página Remetentes (ícone de pessoas no dock, ou nas Definições) e toca em "Cancelar" na publicação que já não queres. Usamos o mecanismo oficial de cancelamento do email — sem procurar links escondidos.',
      },
      {
        p: 'Porque é que uma newsletter não chegou?',
        r: 'Confirma que a subscrição usa exatamente o teu endereço @inread.app (sem erros de escrita) e vê se a publicação pede confirmação por email — essa mensagem de confirmação também chega à tua caixa inread, abre-a e confirma. Se continuar sem aparecer, escreve-nos para suporte@inread.app.',
      },
    ],
  },
  {
    titulo: 'Leitura, etiquetas e highlights',
    artigos: [
      {
        p: 'Como funcionam as etiquetas automáticas',
        r: 'Cada edição recebe duas etiquetas ao chegar: o formato (newsletter, vídeo, thread) e o contexto (Trabalho, Finanças, Tecnologia, Notícias, Lazer). Os filtros aparecem como botões no topo da caixa — toca num para veres só esse tema.',
      },
      {
        p: 'Sublinhar e guardar highlights',
        r: 'Dentro de uma newsletter, seleciona o texto que queres guardar e toca no botão "✦ Sublinhar" que aparece. Os teus highlights ficam no fim do artigo e todos juntos em Guardados › Highlights.',
      },
      {
        p: 'Exportar para Obsidian, Notion e outros',
        r: 'Em qualquer newsletter, toca em "Exportar .md" — recebes um ficheiro Markdown limpo com o artigo e os teus highlights no fim. O Obsidian abre-o diretamente; no Notion usa Importar → Markdown. Integrações diretas estão a caminho (vê a página Integrações).',
      },
    ],
  },
  {
    titulo: 'Conta e planos',
    artigos: [
      {
        p: 'Como funciona o limite do plano Free',
        r: 'O Free mantém até 50 newsletters ativas na caixa. Quando chega a 50 e entra uma nova, a mais antiga que não esteja guardada sai para dar lugar. As que marcares com ★ Guardar nunca são removidas.',
      },
      {
        p: 'O que traz o inread Pro',
        r: 'Armazenamento ilimitado, resumos com IA no topo de cada edição, um apanhado diário em áudio e exportações avançadas. Preço de lançamento: €4,99/mês ou €49,99/ano (em vez de €7,99) para quem aderir até ao final do ano.',
      },
      {
        p: 'Apagar a conta e levar os teus dados',
        r: 'Exporta primeiro o que quiseres guardar (Exportar .md). Depois escreve para suporte@inread.app a pedir a eliminação — apagamos a conta e os dados conforme a política de privacidade.',
      },
    ],
  },
];

export default function Ajuda() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ width: '100%', maxWidth: 760, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <a href="/" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-dark)' }}>‹ inread.app</a>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(30px, 5vw, 42px)' }}>Ajuda</h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          Guias curtos para tirares tudo do inread. Não encontras o que procuras? <a href="/contactos" style={{ fontWeight: 600 }}>Fala connosco</a>.
        </p>
        {GRUPOS.map((g) => (
          <section key={g.titulo} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <h2 style={{ margin: 0, fontSize: 21 }}>{g.titulo}</h2>
            {g.artigos.map((a) => (
              <details key={a.p} className="glass" style={{ borderRadius: 16, padding: '4px 18px' }}>
                <summary style={{ cursor: 'pointer', padding: '13px 0', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{a.p}</summary>
                <p style={{ margin: '0 0 15px', fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{a.r}</p>
              </details>
            ))}
          </section>
        ))}
        <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--quiet)' }}>
          Vê também as <a href="/faq" style={{ fontWeight: 600 }}>perguntas frequentes</a> e o <a href="/changelog" style={{ fontWeight: 600 }}>changelog</a>.
        </p>
      </main>
      <RodapeSite />
    </div>
  );
}
