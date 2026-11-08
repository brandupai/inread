import SiteShell from '@/components/SiteShell';

export const metadata = { title: 'Porque construímos o inread — Blog' };

const p = { margin: 0, fontSize: 16, lineHeight: 1.75, color: 'var(--ink-soft)' as const };

export default function Post() {
  return (
    <SiteShell>
      <main style={{ width: '100%', maxWidth: 680, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <a href="/blog" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-dark)' }}>‹ Blog</a>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand)' }}>3 de novembro de 2026</span>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px, 5vw, 44px)', lineHeight: 1.15 }}>Porque construímos o inread</h1>
        <p style={p}>
          A caixa de entrada tornou-se um lugar de trabalho. É onde chegam faturas, reuniões, pedidos e prazos — e, espremidas no meio disso tudo, as newsletters que escolhemos de propósito para aprender e para pensar. O resultado conhece-o qualquer pessoa: ou são lidas à pressa, ou marcadas como lidas sem culpa, ou arquivadas "para o fim de semana" que nunca chega.
        </p>
        <p style={p}>
          As ferramentas que já existiam resolviam metade do problema. Umas pedem acesso total ao Gmail ou ao Outlook — um preço alto para quem só quer ler. Outras guardam as tuas notas em formatos fechados, com subscrições que crescem todos os anos. E quase nenhuma fala a sério do rasto: a maioria das newsletters traz um pixel invisível que regista quando abres, onde estás e em que clicas.
        </p>
        <p style={p}>
          O inread parte de três decisões simples. Primeiro, <strong>um endereço só para leitura</strong>: escolhes o teu nome@inread.app e usa-lo nas subscrições — nunca tocamos no teu email pessoal. Segundo, <strong>leitura limpa a sério</strong>: cada edição é despida de scripts, popups e rastreadores antes de chegar a ti, mantendo o texto e as imagens por inteiro. Terceiro, <strong>as tuas notas são tuas</strong>: sublinhas, e tudo exporta em Markdown limpo para o Obsidian, o Notion ou onde quiseres — sem ficar refém de ninguém, nem de nós.
        </p>
        <p style={p}>
          Estamos a construir em público, a partir de Portugal, com um plano gratuito que dá para usar todos os dias e um Pro a preço honesto. Se isto te soa à forma como gostavas de ler, cria o teu endereço — demora menos de um minuto — e diz-nos o que falta. O roadmap ouve.
        </p>
        <a href="/login" style={{ alignSelf: 'flex-start', background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '13px 24px', fontSize: 15, fontWeight: 600 }}>
          Criar o meu endereço grátis
        </a>
      </main>
    </SiteShell>
  );
}
