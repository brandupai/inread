import type { CSSProperties } from 'react';
import { auth, authEnabled } from '@/auth';
import RodapeSite from '@/components/RodapeSite';

export const dynamic = 'force-dynamic';

const ACID = '#A6D6AE';
const INK_DARK = '#0B1410';

const dcard: CSSProperties = {
  background: 'rgba(255,255,255,0.055)',
  border: '1px solid rgba(255,255,255,0.12)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
};

const quiet: CSSProperties = { color: 'rgba(232,242,234,0.66)' };
const faint: CSSProperties = { color: 'rgba(232,242,234,0.45)' };

const ctaAcid: CSSProperties = {
  background: ACID,
  color: INK_DARK,
  borderRadius: 999,
  padding: '16px 30px',
  fontSize: 16.5,
  fontWeight: 700,
  boxShadow: '0 0 0 1px rgba(166,214,174,0.4), 0 18px 44px rgba(166,214,174,0.22)',
};

function MiniRow({ delay, img, sender, subject }: { delay?: string; img: string; sender: string; subject: string }) {
  return (
    <div
      className="cardIn"
      style={{ animationDelay: delay, display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 12px' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" style={{ width: 34, height: 34, borderRadius: 9, flex: '0 0 auto', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#E8F2EA' }}>{sender}</span>
        <span style={{ fontSize: 11, ...quiet, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject}</span>
      </div>
    </div>
  );
}

function ChipOrbita({ texto, delay, floatDelay, style }: { texto: string; delay: string; floatDelay: string; style: CSSProperties }) {
  return (
    <span className="chip-pop" style={{ animationDelay: delay, position: 'absolute', zIndex: 2, ...style }}>
      <span
        className="floatY"
        style={{ animationDelay: floatDelay, display: 'inline-block', background: 'rgba(11,20,16,0.75)', border: '1px solid rgba(166,214,174,0.5)', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: ACID, boxShadow: '0 0 22px rgba(166,214,174,0.22)', whiteSpace: 'nowrap', backdropFilter: 'blur(8px)' }}
      >
        {texto}
      </span>
    </span>
  );
}

const PLATAFORMAS = ['Substack', 'beehiiv', 'Ghost', 'Mailchimp', 'Kit', 'Buttondown', 'MailerLite', 'Brevo', 'Campaign Monitor'];

const barra = (w: string, forte = false): CSSProperties => ({
  height: forte ? 9 : 7,
  width: w,
  borderRadius: 999,
  background: forte ? 'rgba(232,242,234,0.55)' : 'rgba(232,242,234,0.16)',
});

export default async function Home() {
  const session = authEnabled ? await auth() : null;
  const entrou = Boolean(session?.user);
  const cta = entrou ? '/caixa' : '/login';
  const ctaLabel = entrou ? 'Abrir a minha caixa' : 'Criar o meu endereço grátis';

  return (
    <div className="sd" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* auroras */}
      <div className="sd-aurora" aria-hidden="true">
        <div className="sd-orb" style={{ width: 760, height: 760, top: -220, left: '50%', marginLeft: -380, background: 'radial-gradient(circle at 50% 45%, rgba(103,146,129,0.55) 0%, rgba(47,93,76,0.35) 45%, rgba(11,20,16,0) 72%)' }} />
        <div className="sd-orb sd-orb2" style={{ width: 520, height: 520, top: 480, right: -180, opacity: 0.7, background: 'radial-gradient(circle at 50% 50%, rgba(166,214,174,0.28) 0%, rgba(11,20,16,0) 70%)' }} />
        <div className="sd-orb" style={{ width: 560, height: 560, bottom: 420, left: -220, opacity: 0.6, background: 'radial-gradient(circle at 50% 50%, rgba(63,110,91,0.4) 0%, rgba(11,20,16,0) 70%)' }} />
      </div>

      {/* faixa de anúncio (acento ácido) */}
      <a href="/faq" style={{ position: 'relative', zIndex: 1, display: 'block', textAlign: 'center', background: ACID, color: INK_DARK, fontSize: 13, fontWeight: 600, padding: '9px 16px' }}>
        Novo: highlights exportáveis para Obsidian e Notion, em Markdown limpo
      </a>

      {/* navegação — pílula clara para o logo original */}
      <header
        style={{ position: 'sticky', top: 14, zIndex: 30, width: 'calc(100% - 32px)', maxWidth: 1120, margin: '18px auto 0', padding: '12px 22px', background: 'rgba(239,243,238,0.92)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 999, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 18px 40px rgba(0,0,0,0.35)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="inread" style={{ height: 26, width: 'auto' }} />
        <nav aria-label="Navegação" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
          <a href="#funcionalidades" style={{ color: 'var(--ink)' }}>Funcionalidades</a>
          <a href="#precos" style={{ color: 'var(--ink)' }}>Preços</a>
          <a href="/faq" style={{ color: 'var(--ink)' }}>FAQ</a>
          {!entrou && <a href="/login" style={{ color: 'var(--ink)' }}>Entrar</a>}
          <a href={cta} style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '9px 18px', fontWeight: 600 }}>
            {entrou ? 'A minha caixa' : 'Criar endereço grátis'}
          </a>
        </nav>
      </header>

      {/* hero */}
      <section style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '76px 24px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, textAlign: 'center' }}>
        <div className="h-seq" style={{ fontSize: 13, fontWeight: 600, color: ACID, border: '1px solid rgba(166,214,174,0.4)', borderRadius: 999, padding: '7px 16px', background: 'rgba(166,214,174,0.07)' }}>
          O leitor de newsletters que não pede acesso ao teu email
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(40px, 7.4vw, 78px)', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.02em', maxWidth: 920, color: '#F4FAF5' }}>
          <span className="h-seq" style={{ display: 'block', animationDelay: '0.1s' }}>A tua caixa de entrada</span>
          <span className="h-seq" style={{ display: 'block', animationDelay: '0.24s' }}>não foi feita para ler.</span>
          <span className="voz h-seq" style={{ display: 'block', animationDelay: '0.42s', color: ACID, fontWeight: 400 }}>O inread foi.</span>
        </h1>
        <p className="h-seq" style={{ animationDelay: '0.24s', margin: 0, fontSize: 18, lineHeight: 1.6, ...quiet, maxWidth: 520 }}>
          Um endereço privado para as tuas newsletters, leitura sem rastreio e highlights que levas contigo. Tudo num lugar calmo, longe do trabalho.
        </p>
        <div className="h-seq" style={{ animationDelay: '0.36s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <a href={cta} style={ctaAcid}>{ctaLabel}</a>
          <span style={{ fontSize: 13.5, ...faint }}>Grátis até 50 newsletters · sem cartão</span>
        </div>

        {/* produto com chips em órbita */}
        <div className="h-seq" style={{ animationDelay: '0.5s', position: 'relative', width: '100%', maxWidth: 560, marginTop: 26 }}>
          <svg aria-hidden="true" viewBox="0 0 560 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <path d="M 150 30 C 90 20, 50 0, 40 -8" fill="none" stroke="rgba(166,214,174,0.45)" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
            <path d="M 440 70 C 500 65, 540 55, 560 48" fill="none" stroke="rgba(166,214,174,0.45)" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
            <path d="M 150 260 C 110 280, 90 292, 75 300" fill="none" stroke="rgba(166,214,174,0.45)" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
          </svg>
          <ChipOrbita texto="0 rastreadores" delay="0.9s" floatDelay="0s" style={{ top: -22, left: '-1%' }} />
          <ChipOrbita texto="100% do texto" delay="1.1s" floatDelay="1.4s" style={{ top: 30, right: '-4%' }} />
          <ChipOrbita texto="sofia@inread.app" delay="1.3s" floatDelay="0.7s" style={{ bottom: -18, left: '8%' }} />
          <div style={{ ...dcard, borderRadius: 24, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: '#F4FAF5' }}>Caixa</span>
              <span style={{ fontSize: 12, ...faint }}>3 por ler</span>
            </div>
            <MiniRow img="/demo/nl-tech.png" sender="Semana Tech" subject="Nº 142 — O regresso da web calma" />
            <MiniRow delay="0.5s" img="/demo/nl-design.png" sender="Café com Design" subject="Tipografia que respira" />
            <MiniRow delay="1s" img="/demo/nl-produto.png" sender="Produto & Co" subject="Como definir preços em SaaS" />
          </div>
        </div>

        <div className="h-seq" style={{ animationDelay: '0.62s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, fontSize: 12, ...quiet }}>
          {['Web', 'iPhone', 'Android', 'Mac', 'Windows'].map((p) => (
            <span key={p} style={{ border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: '5px 12px' }}>
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* marquee */}
      <section aria-label="Plataformas compatíveis" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1120, margin: '30px auto 0', padding: '0 24px' }}>
        <div className="marquee">
          <div className="marquee-track">
            {[...PLATAFORMAS, ...PLATAFORMAS].map((p, i) => (
              <span key={`${p}-${i}`} style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'rgba(232,242,234,0.2)', whiteSpace: 'nowrap' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* percurso */}
      <section className="reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '92px 24px 20px', textAlign: 'center' }}>
        <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em', color: '#F4FAF5' }}>
          Subscreves. Limpamos. <span className="voz" style={{ color: ACID, fontWeight: 400 }}>Lês.</span>
        </h2>
        <div style={{ position: 'relative', marginTop: 46 }}>
          <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ position: 'absolute', top: 26, left: '6%', width: '88%', height: 60, overflow: 'visible' }}>
            <path className="trace-path" pathLength={1} d="M 0 30 C 180 -10, 320 70, 500 30 S 820 -10, 1000 30" fill="none" stroke={ACID} strokeWidth="2" strokeLinecap="round" strokeDasharray="1" />
          </svg>
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' }}>
            {[
              { n: '1', t: 'Subscreves', d: 'Usa o teu nome@inread.app em qualquer página de subscrição.' },
              { n: '2', t: 'Limpamos', d: 'Scripts, popups e pixels de rastreio ficam à porta. O texto entra inteiro.' },
              { n: '3', t: 'Lês', d: 'Num lugar calmo — e exportas o que importa em Markdown.' },
            ].map((p) => (
              <div key={p.n} className="trace-node" style={{ ...dcard, flex: '1 1 240px', minWidth: 0, borderRadius: 20, padding: '22px 20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, background: ACID, color: INK_DARK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>
                  {p.n}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700, color: '#F4FAF5' }}>{p.t}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, ...quiet }}>{p.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* bento */}
      <section id="funcionalidades" className="reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '82px 24px 10px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em', textAlign: 'center', color: '#F4FAF5' }}>
          Tudo o que uma newsletter <span className="voz" style={{ color: ACID, fontWeight: 400 }}>merece.</span>
        </h2>

        <div className="bento">
          {/* alias */}
          <div style={{ ...dcard, gridColumn: 'span 7', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F4FAF5' }}>Um endereço só para newsletters</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Escolhes o teu nome@inread.app e usa-lo em todas as subscrições. O teu email pessoal fica fora disto — e nós nunca lhe tocamos.
            </p>
            <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(166,214,174,0.1)', border: '1px solid rgba(166,214,174,0.45)', borderRadius: 999, padding: '7px 14px', fontSize: 14, fontWeight: 600, color: ACID }}>
              sofia@inread.app
            </div>
            <MiniRow img="/demo/nl-tech.png" sender="Semana Tech" subject="Nº 142 — O regresso da web calma" />
            <MiniRow delay="0.7s" img="/demo/nl-news.png" sender="Manhãs de Notícias" subject="O que importa esta terça-feira" />
          </div>

          {/* leitura limpa */}
          <div style={{ ...dcard, gridColumn: 'span 5', position: 'relative', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F4FAF5' }}>Leitura limpa</h3>
            <p style={{ margin: '0 0 6px', fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Anúncios, popups e rastreadores desaparecem. O artigo fica inteiro.
            </p>
            <div style={barra('60%', true)} />
            <div style={barra('92%')} />
            <div style={barra('86%')} />
            <div style={{ height: 52, borderRadius: 12, background: 'linear-gradient(135deg, rgba(166,214,174,0.5), rgba(63,110,91,0.55))' }} />
            <div style={barra('88%')} />
            <div className="vanish" style={{ position: 'absolute', top: 88, right: 16, background: 'rgba(11,20,16,0.85)', border: '1px solid rgba(217,130,130,0.6)', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#E3A9A9' }}>
              Popup de subscrição ✕
            </div>
            <div className="vanish" style={{ animationDelay: '0.7s', position: 'absolute', bottom: 46, right: 30, background: 'rgba(11,20,16,0.85)', border: '1px solid rgba(217,186,130,0.6)', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#E3CBA0' }}>
              Pixel de rastreio ✕
            </div>
          </div>

          {/* resumos IA + áudio */}
          <div style={{ ...dcard, gridColumn: 'span 5', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F4FAF5' }}>Resumo em três linhas, áudio em sete minutos</h3>
            <div className="sumIn" style={{ background: 'rgba(166,214,174,0.09)', border: '1px solid rgba(166,214,174,0.4)', borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: ACID }}>✦ Resumo</span>
              <div style={{ height: 7, width: '96%', borderRadius: 999, background: 'rgba(166,214,174,0.45)' }} />
              <div style={{ height: 7, width: '74%', borderRadius: 999, background: 'rgba(166,214,174,0.45)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '9px 14px' }}>
              <span style={{ width: 28, height: 28, borderRadius: 999, background: ACID, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: INK_DARK, flex: '0 0 auto' }}>
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 3, height: 18 }}>
                {[0, 0.15, 0.3, 0.45, 0.6].map((d) => (
                  <span key={d} className="eqb" style={{ animationDelay: `${d}s`, width: 4, height: 16, borderRadius: 999, background: ACID }} />
                ))}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: ACID }}>O teu áudio de hoje</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, ...faint }}>No plano Pro, decides em segundos o que merece a leitura inteira.</p>
          </div>

          {/* highlights */}
          <div style={{ ...dcard, gridColumn: 'span 7', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F4FAF5' }}>Highlights que levas contigo</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: '#DCEADF' }}>
              <span className="sweep" style={{ padding: '1px 3px', backgroundImage: 'linear-gradient(rgba(166,214,174,0.3), rgba(166,214,174,0.3))' }}>O futuro da leitura não é mais uma caixa de entrada</span> — é um lugar separado, sem pressa e sem rasto.
            </p>
            <div className="chipIn" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(166,214,174,0.1)', border: '1px solid rgba(166,214,174,0.45)', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: ACID }}>
              highlights.md guardado — pronto para o Obsidian e o Notion
            </div>
            <p style={{ margin: 0, fontSize: 13, ...faint }}>Markdown limpo, sem formatos fechados. As tuas notas são tuas.</p>
          </div>

          {/* etiquetas */}
          <div style={{ ...dcard, gridColumn: 'span 6', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F4FAF5' }}>Organiza-se sozinha</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Cada edição chega com duas etiquetas automáticas: o formato e o contexto. Filtras com um toque.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Trabalho', 'Finanças', 'Tecnologia', 'Notícias', 'Lazer'].map((t, i) => (
                <span key={t} style={{ fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: '6px 13px', background: i === 2 ? ACID : 'rgba(255,255,255,0.06)', color: i === 2 ? INK_DARK : 'rgba(232,242,234,0.8)', border: i === 2 ? `1px solid ${ACID}` : '1px solid rgba(255,255,255,0.14)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* unsubscribe */}
          <div style={{ ...dcard, gridColumn: 'span 6', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F4FAF5' }}>Cancelar é um clique</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Quando uma newsletter deixa de interessar, cancelas na página de remetentes — sem caçar o link escondido no rodapé.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo/nl-produto.png" alt="" style={{ width: 30, height: 30, borderRadius: 9, flex: '0 0 auto', objectFit: 'cover' }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#E8F2EA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Produto & Co</span>
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#E3A9A9', border: '1px solid rgba(217,130,130,0.5)', borderRadius: 999, padding: '6px 12px', flex: '0 0 auto' }}>
                Cancelar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* painel claro: privacidade (inversão de contraste) */}
      <section className="reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '82px 24px 0' }}>
        <div style={{ borderRadius: 30, background: 'linear-gradient(150deg, #E4F0E5 0%, #CDEBD2 55%, #BFE3C6 100%)', color: 'var(--ink)', padding: 'clamp(36px, 6vw, 64px)', display: 'flex', flexDirection: 'column', gap: 22, boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
          <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--brand-deep)' }}>
            Lê sem deixar <span className="voz" style={{ color: 'var(--brand)', fontWeight: 400 }}>rasto.</span>
          </h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, maxWidth: 560, color: 'var(--ink-soft)' }}>
            Quase todas as newsletters trazem um pixel invisível que conta quando abres, onde estás e em que clicas. O inread remove-o antes de chegares a ler — os remetentes não sabem o que lês, e nós não vendemos dados nem mostramos anúncios.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 5vw, 60px)', marginTop: 8 }}>
            {[
              { n: '0', l: 'rastreadores sobrevivem' },
              { n: '100%', l: 'do texto preservado' },
              { n: '1', l: 'endereço privado, teu' },
            ].map((s) => (
              <div key={s.l} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 700, color: 'var(--brand-deep)', lineHeight: 1 }}>{s.n}</span>
                <span style={{ fontSize: 13.5, color: 'var(--quiet)' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* preços */}
      <section id="precos" className="reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 920, margin: '0 auto', padding: '88px 24px 10px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em', textAlign: 'center', color: '#F4FAF5' }}>
          Começa grátis. <span className="voz" style={{ color: ACID, fontWeight: 400 }}>Fica se gostares.</span>
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ ...dcard, flex: '1 1 300px', minWidth: 0, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, ...quiet }}>Free</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1, color: '#F4FAF5' }}>€0</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, lineHeight: 1.5, ...quiet }}>
              <li>Endereço privado nome@inread.app</li>
              <li>50 newsletters ativas na caixa</li>
              <li>Etiquetas automáticas e pesquisa</li>
              <li>Highlights e exportação .md</li>
            </ul>
            <a href={cta} style={{ marginTop: 'auto', textAlign: 'center', border: '1px solid rgba(232,242,234,0.35)', borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 600, color: '#E8F2EA' }}>
              Começar grátis
            </a>
          </div>
          <div style={{ flex: '1 1 300px', minWidth: 0, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', gap: 14, background: `linear-gradient(160deg, ${ACID}, #8FC9A0)`, color: INK_DARK, boxShadow: '0 0 60px rgba(166,214,174,0.3), 0 24px 56px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Pro</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: ACID, background: INK_DARK, borderRadius: 999, padding: '4px 11px' }}>Preço de lançamento</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(11,20,16,0.5)', textDecoration: 'line-through' }}>€7,99</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1 }}>€4,99</span>
              <span style={{ fontSize: 14, color: 'rgba(11,20,16,0.65)' }}>/mês · ou €49,99/ano</span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(11,20,16,0.7)' }}>Garante este preço até ao final do ano — fica teu para sempre.</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, lineHeight: 1.5, color: 'rgba(11,20,16,0.85)' }}>
              <li>Armazenamento ilimitado</li>
              <li>Resumos com IA e áudio diário</li>
              <li>Alias personalizado à tua escolha</li>
              <li>Exportações avançadas (Notion, Obsidian)</li>
            </ul>
            <a href={cta} style={{ marginTop: 'auto', textAlign: 'center', background: INK_DARK, borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 700, color: ACID }}>
              Começar grátis
            </a>
          </div>
        </div>
        <p style={{ margin: 0, textAlign: 'center', fontSize: 13, ...faint }}>IVA incluído. Cancela quando quiseres — exportas tudo antes de sair.</p>
      </section>

      {/* CTA final */}
      <section style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '84px 24px 72px', textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div className="sd-orb" aria-hidden="true" style={{ width: 480, height: 480, top: -140, left: '50%', marginLeft: -240, position: 'absolute', background: 'radial-gradient(circle at 50% 50%, rgba(166,214,174,0.26) 0%, rgba(11,20,16,0) 70%)' }} />
          <div className="reveal" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(34px, 5.4vw, 56px)', fontWeight: 700, letterSpacing: '-0.015em', maxWidth: 700, color: '#F4FAF5' }}>
              As tuas newsletters merecem <span className="voz" style={{ color: ACID, fontWeight: 400 }}>uma casa melhor.</span>
            </h2>
            <p style={{ margin: 0, fontSize: 15.5, ...quiet }}>Demora menos de um minuto: escolhes o endereço e começas a subscrever.</p>
            <a href={cta} style={ctaAcid}>{ctaLabel}</a>
          </div>
        </div>
      </section>

      {/* rodapé claro */}
      <div style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(165deg, #E4F0E5 0%, #EFF3EE 60%, #E9F1EC 100%)', borderRadius: '34px 34px 0 0', marginTop: 10 }}>
        <RodapeSite />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var els=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('in')});return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.3});els.forEach(function(el){io.observe(el)})}catch(err){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')})}})();",
        }}
      />
    </div>
  );
}
