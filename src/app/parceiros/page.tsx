import RodapeSite from '@/components/RodapeSite';

export const metadata = { title: 'Programa de parceiros — inread' };

export default function Parceiros() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <a href="/" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-light)' }}>‹ inread.app</a>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(30px, 5vw, 42px)' }}>Programa de parceiros</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
          Escreves uma newsletter? O inread é onde os teus leitores mais dedicados a vão ler — sem anúncios à volta, sem disputar a caixa de entrada. Queremos crescer contigo.
        </p>

        <div className="glass" style={{ borderRadius: 18, padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 21 }}>Submete a tua newsletter</h2>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
            Estamos a preparar o <strong>Descobrir</strong> — o diretório onde os leitores do inread encontram novas publicações por tema. As newsletters submetidas agora entram na primeira fornada, com destaque de lançamento.
          </p>
          <a href="mailto:suporte@inread.app?subject=Submeter newsletter" style={{ alignSelf: 'flex-start', background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '11px 20px', fontSize: 14, fontWeight: 600 }}>
            Submeter newsletter
          </a>
        </div>

        <div className="glass" style={{ borderRadius: 18, padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 21 }}>Recomenda o inread aos teus leitores</h2>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
            Um leitor que lê num lugar calmo abre mais, lê até ao fim e fica mais tempo subscrito. Fala do inread na tua newsletter e os teus leitores ganham um lugar melhor para te ler — estamos a desenhar um programa de afiliados com partilha de receita para quem recomendar.
          </p>
        </div>

        <div className="glass" style={{ borderRadius: 18, padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 21 }}>O que o inread nunca fará</h2>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
            Removemos rastreadores, mas respeitamos o teu trabalho: o conteúdo chega por inteiro, com os teus links e as tuas chamadas à ação intactas, e nunca pomos anúncios nossos em cima das tuas edições. Cancelar a subscrição usa o teu mecanismo oficial.
          </p>
        </div>

        <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--quiet)' }}>
          Parcerias e imprensa: <a href="mailto:suporte@inread.app" style={{ fontWeight: 600 }}>suporte@inread.app</a>
        </p>
      </main>
      <RodapeSite />
    </div>
  );
}
