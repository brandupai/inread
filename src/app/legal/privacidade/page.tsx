import RodapeSite from '@/components/RodapeSite';

export const metadata = { title: 'Política de privacidade — inread' };

const h2 = { fontSize: 20, margin: '18px 0 0' };
const p = { margin: 0, fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-soft)' as const };

export default function Privacidade() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a href="/" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-dark)' }}>‹ inread.app</a>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(28px, 5vw, 38px)' }}>Política de privacidade</h1>
        <p style={{ ...p, color: 'var(--quiet)' }}>Última atualização: 3 de novembro de 2026</p>

        <p style={p}>
          O inread existe para leres newsletters com privacidade. Esta política explica, em linguagem simples, que dados tratamos e porquê. O princípio é um só: recolhemos o mínimo necessário para o serviço funcionar, e os teus dados não são vendidos nem usados para publicidade.
        </p>

        <h2 style={h2}>Que dados guardamos</h2>
        <p style={p}>
          <strong>Conta:</strong> o teu email de acesso, o nome (se entrares com Google) e o endereço @inread.app que escolheste.<br />
          <strong>Conteúdo:</strong> as newsletters enviadas para o teu endereço @inread.app, os teus favoritos, etiquetas e highlights.<br />
          <strong>Técnicos:</strong> registos mínimos de funcionamento (datas de receção e leitura), usados apenas para operar o serviço e as tuas estatísticas.
        </p>

        <h2 style={h2}>O que não fazemos</h2>
        <p style={p}>
          Não pedimos acesso à tua caixa de email pessoal. Não vendemos dados. Não mostramos anúncios. Removemos os pixels de rastreio e os parâmetros de tracking que vêm nos emails, para que os remetentes não saibam o que lês nem quando.
        </p>

        <h2 style={h2}>Com quem trabalhamos</h2>
        <p style={p}>
          Para operar o serviço usamos subcontratantes de confiança: alojamento e base de dados na Hostinger (UE), encaminhamento de email na Cloudflare, envio dos emails de acesso através da Resend, e autenticação opcional com a Google. Cada um recebe apenas o estritamente necessário à sua função.
        </p>

        <h2 style={h2}>Os teus direitos</h2>
        <p style={p}>
          Ao abrigo do RGPD podes aceder, corrigir, exportar ou apagar os teus dados a qualquer momento. A exportação em Markdown está disponível na própria app; para eliminação da conta ou qualquer outro pedido, escreve para{' '}
          <a href="mailto:suporte@inread.app" style={{ fontWeight: 600 }}>suporte@inread.app</a> e tratamos disso sem demoras.
        </p>

        <h2 style={h2}>Cookies</h2>
        <p style={p}>
          Usamos apenas cookies de sessão, estritamente necessários para manteres a sessão iniciada. Sem cookies de publicidade nem de tracking de terceiros.
        </p>

        <h2 style={h2}>Alterações</h2>
        <p style={p}>
          Se esta política mudar de forma relevante, avisamos-te por email ou na app antes de a alteração entrar em vigor.
        </p>
      </main>
      <RodapeSite />
    </div>
  );
}
