import RodapeSite from '@/components/RodapeSite';

export const metadata = { title: 'Integrações — inread' };

type Estado = 'ativo' | 'via-md' | 'brevemente';

const PILL: Record<Estado, { t: string; bg: string; c: string }> = {
  ativo: { t: 'Disponível', bg: 'var(--brand-light)', c: '#072E18' },
  'via-md': { t: 'Via export .md', bg: 'rgba(27,224,60,0.22)', c: 'var(--brand-light)' },
  brevemente: { t: 'Brevemente', bg: 'rgba(255,255,255,0.1)', c: 'var(--quiet)' },
};

const ENTRADA: Array<{ n: string; d: string; e: Estado }> = [
  { n: 'Endereço @inread.app', d: 'O teu email privado de newsletters — a forma mais limpa de receber.', e: 'ativo' },
  { n: 'Gmail', d: 'Ligação de leitura para importar as newsletters que já recebes. Opcional, só leitura.', e: 'brevemente' },
  { n: 'Microsoft Outlook', d: 'Ligação de leitura para importar as newsletters que já recebes. Opcional, só leitura.', e: 'brevemente' },
];

const SAIDA: Array<{ n: string; d: string; e: Estado }> = [
  { n: 'Markdown (.md)', d: 'Qualquer newsletter exporta com os teus highlights no fim. A base de tudo.', e: 'ativo' },
  { n: 'Obsidian', d: 'Abre os .md diretamente no teu vault — funciona hoje, integração direta a caminho.', e: 'via-md' },
  { n: 'Notion', d: 'Importar → Markdown funciona hoje; sincronização direta dos highlights a caminho.', e: 'via-md' },
  { n: 'Evernote', d: 'Envio direto dos teus highlights e artigos.', e: 'brevemente' },
  { n: 'Google Keep', d: 'Envio direto dos teus highlights.', e: 'brevemente' },
  { n: 'Apple Notes', d: 'Envio direto dos teus highlights e artigos.', e: 'brevemente' },
  { n: 'Zapier', d: 'Liga o inread a milhares de apps com automações.', e: 'brevemente' },
  { n: 'API e webhooks', d: 'Acesso programático à tua caixa, mesmo nos planos baratos.', e: 'brevemente' },
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ width: '100%', maxWidth: 860, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <a href="/" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-light)' }}>‹ inread.app</a>
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
      <RodapeSite />
    </div>
  );
}
