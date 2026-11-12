import SiteShell from '@/components/SiteShell';

export const metadata = { title: 'Integrações — inread' };

type Estado = 'ativo' | 'via-md' | 'brevemente';

const PILL: Record<Estado, { t: string; bg: string; c: string }> = {
  ativo: { t: 'Disponível', bg: 'var(--brand-light)', c: '#072E18' },
  'via-md': { t: 'Via export .md', bg: 'rgba(21,184,50,0.14)', c: 'var(--brand-dark)' },
  brevemente: { t: 'Brevemente', bg: 'rgba(20,21,15,0.06)', c: 'var(--quiet)' },
};

const ENTRADA: Array<{ n: string; d: string; e: Estado }> = [
  { n: 'Endereço @inread.app', d: 'O teu email privado de newsletters — a forma mais limpa de receber.', e: 'ativo' },
  { n: 'Gmail', d: 'Passa as newsletters que já recebes com um filtro de reencaminhamento — sem dar acesso à tua caixa.', e: 'ativo' },
  { n: 'Microsoft Outlook', d: 'Uma regra de redirecionamento envia as newsletters para o inread e tira-as da caixa de entrada.', e: 'ativo' },
  { n: 'iCloud, Proton e outros', d: 'Regras de reencaminhamento ou troca do email da subscrição, com guia passo a passo.', e: 'ativo' },
];

const SAIDA: Array<{ n: string; d: string; e: Estado }> = [
  { n: 'Markdown (.md)', d: 'Qualquer newsletter exporta com os teus highlights no fim. A base de tudo.', e: 'ativo' },
  { n: 'Obsidian', d: '«Abrir no Obsidian» cria a nota com o artigo e os teus sublinhados.', e: 'ativo' },
  { n: 'Feed RSS privado', d: 'Lê a tua caixa em qualquer leitor de RSS, com um endereço secreto só teu.', e: 'ativo' },
  { n: 'Readwise', d: 'Os teus sublinhados seguem automaticamente para o Readwise.', e: 'ativo' },
  { n: 'Notion', d: '«Copiar em Markdown» cola-se direto no Notion; ligação direta à tua conta a caminho.', e: 'via-md' },
];

function Cartao({ n, d, e }: { n: string; d: string; e: Estado }) {
  const pill = PILL[e];
  return (
    <div className="glass" style={{ flex: '1 1 300px', minWidth: 0, borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{n}</span>
        <span style={{ flex: '0 0 auto', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '4px 10px', background: pill.bg, color: pill.c }}>{pill.t}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{d}</p>
    </div>
  );
}

export default function Integracoes() {
  return (
    <SiteShell>
      <main style={{ width: '100%', maxWidth: 860, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(30px, 5vw, 42px)' }}>Integrações</h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          O inread é um cidadão de primeira classe da web: o que entra é teu, o que sai é aberto. Sem formatos fechados.
        </p>

        <h2 style={{ margin: '10px 0 0', fontSize: 21 }}>Receber newsletters</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {ENTRADA.map((i) => (
            <Cartao key={i.n} {...i} />
          ))}
        </div>

        <h2 style={{ margin: '10px 0 0', fontSize: 21 }}>Exportar e ligar</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {SAIDA.map((i) => (
            <Cartao key={i.n} {...i} />
          ))}
        </div>

        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--quiet)' }}>
          Falta uma integração de que precisas? <a href="/contactos" style={{ fontWeight: 600 }}>Diz-nos</a> — as mais pedidas sobem no roadmap.
        </p>
      </main>
    </SiteShell>
  );
}
