import type { CSSProperties } from 'react';
import { auth, authEnabled } from '@/auth';
import { billingEnabled } from '@/lib/stripe';
import RodapeSite from '@/components/RodapeSite';

export const dynamic = 'force-dynamic';

const ACID = '#15B832';
const ACID_LIGHT = '#1BE03C';
const ACID_INK = '#086B21';
const INK = '#15160F';
const INK_SOFT = '#62624F';
const INK_FAINT = '#9A9A86';
const SURFACE = '#FFFFFF';
const SURFACE_SUNK = '#F6F5F0';
const BORDER = 'rgba(20,21,15,0.08)';

const dcard: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  boxShadow: '0 10px 28px rgba(20,21,15,0.07), 0 2px 6px rgba(20,21,15,0.04)',
};

const quiet: CSSProperties = { color: INK_SOFT };
const faint: CSSProperties = { color: INK_FAINT };

const ctaAcid: CSSProperties = {
  background: ACID,
  color: '#fff',
  borderRadius: 999,
  padding: '16px 30px',
  fontSize: 16.5,
  fontWeight: 700,
  boxShadow: '0 0 0 1px rgba(21,184,50,0.3), 0 18px 40px rgba(21,184,50,0.22)',
};

function MiniRow({ delay, img, sender, subject }: { delay?: string; img: string; sender: string; subject: string }) {
  return (
    <div
      className="cardIn"
      style={{ animationDelay: delay, display: 'flex', gap: 10, alignItems: 'center', background: SURFACE_SUNK, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 12px' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" style={{ width: 34, height: 34, borderRadius: 9, flex: '0 0 auto', objectFit: 'cover', boxShadow: '0 4px 10px rgba(20,21,15,0.12)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>{sender}</span>
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
        style={{ animationDelay: floatDelay, display: 'inline-block', background: SURFACE, border: `1px solid rgba(21,184,50,0.4)`, borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: ACID_INK, boxShadow: '0 10px 26px rgba(20,21,15,0.1)', whiteSpace: 'nowrap' }}
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
  background: forte ? 'rgba(20,21,15,0.4)' : 'rgba(20,21,15,0.1)',
});

export default async function Home() {
  const session = authEnabled ? await auth() : null;
  const entrou = Boolean(session?.user);
  const cta = entrou ? '/caixa' : '/login';
  const ctaLabel = entrou ? 'Abrir a minha caixa' : 'Criar o meu endereço grátis';
  const proHref = entrou && billingEnabled ? '/pro' : cta;
  const proLabel = entrou && billingEnabled ? 'Ativar o Pro' : 'Começar grátis';

  return (
    <div className="sd" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* auroras — glow suave sobre o fundo claro */}
      <div className="sd-aurora" aria-hidden="true">
        <div className="sd-orb" style={{ width: 760, height: 760, top: -260, left: '50%', marginLeft: -380, opacity: 0.55, background: 'radial-gradient(circle at 50% 45%, rgba(21,184,50,0.22) 0%, rgba(21,184,50,0.08) 45%, rgba(241,240,235,0) 72%)' }} />
        <div className="sd-orb sd-orb2" style={{ width: 520, height: 520, top: 480, right: -180, opacity: 0.45, background: 'radial-gradient(circle at 50% 50%, rgba(21,184,50,0.16) 0%, rgba(241,240,235,0) 70%)' }} />
        <div className="sd-orb" style={{ width: 560, height: 560, bottom: 420, left: -220, opacity: 0.4, background: 'radial-gradient(circle at 50% 50%, rgba(21,184,50,0.18) 0%, rgba(241,240,235,0) 70%)' }} />
      </div>

      {/* faixa de anúncio (acento ácido) */}
      <a href="/faq" style={{ position: 'relative', zIndex: 1, display: 'block', textAlign: 'center', background: ACID, color: '#fff', fontSize: 13, fontWeight: 600, padding: '9px 16px' }}>
        Novo: highlights exportáveis para Obsidian e Notion, em Markdown limpo
      </a>

      {/* navegação */}
      <header
        style={{ position: 'sticky', top: 14, zIndex: 30, width: 'calc(100% - 32px)', maxWidth: 1120, margin: '18px auto 0', padding: '12px 22px', background: 'rgba(255,255,255,0.86)', border: `1px solid ${BORDER}`, borderRadius: 999, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 18px 40px rgba(20,21,15,0.08)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg?v=2" alt="inread" style={{ height: 26, width: 'auto' }} />
        <nav aria-label="Navegação" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, fontSize: 14, fontWeight: 500, color: INK }}>
          <a href="#funcionalidades" style={{ color: INK }}>Funcionalidades</a>
          <a href="#precos" style={{ color: INK }}>Preços</a>
          <a href="/faq" style={{ color: INK }}>FAQ</a>
          {!entrou && <a href="/login" style={{ color: INK }}>Entrar</a>}
          <a href={cta} style={{ background: INK, color: '#fff', borderRadius: 999, padding: '9px 18px', fontWeight: 600 }}>
            {entrou ? 'A minha caixa' : 'Criar endereço grátis'}
          </a>
        </nav>
      </header>

      {/* hero */}
      <section style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '76px 24px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, textAlign: 'center' }}>
        <div className="h-seq" style={{ fontSize: 13, fontWeight: 600, color: ACID_INK, border: '1px solid rgba(21,184,50,0.35)', borderRadius: 999, padding: '7px 16px', background: 'rgba(21,184,50,0.08)' }}>
          A box de conhecimento que não pede acesso ao teu email
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(40px, 7.4vw, 78px)', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.02em', maxWidth: 920, color: INK }}>
          <span className="h-seq" style={{ display: 'block', animationDelay: '0.1s' }}>A tua caixa de entrada</span>
          <span className="h-seq" style={{ display: 'block', animationDelay: '0.24s' }}>não foi feita para acompanhar.</span>
          <span className="voz h-seq" style={{ display: 'block', animationDelay: '0.42s', color: ACID, fontWeight: 400 }}>O inread foi.</span>
        </h1>
        <p className="h-seq" style={{ animationDelay: '0.24s', margin: 0, fontSize: 18, lineHeight: 1.6, ...quiet, maxWidth: 540 }}>
          Uma box privada para as newsletters, podcasts e feeds que acompanhas — organizados sozinhos, sem rastreio, com highlights que levas contigo.
        </p>
        <div className="h-seq" style={{ animationDelay: '0.36s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <a href={cta} style={ctaAcid}>{ctaLabel}</a>
          <span style={{ fontSize: 13.5, ...faint }}>Grátis até 50 fontes · sem cartão</span>
        </div>

        {/* produto com chips em órbita */}
        <div className="h-seq" style={{ animationDelay: '0.5s', position: 'relative', width: '100%', maxWidth: 560, marginTop: 26 }}>
          <svg aria-hidden="true" viewBox="0 0 560 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <path d="M 150 30 C 90 20, 50 0, 40 -8" fill="none" stroke="rgba(21,184,50,0.4)" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
            <path d="M 440 70 C 500 65, 540 55, 560 48" fill="none" stroke="rgba(21,184,50,0.4)" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
            <path d="M 150 260 C 110 280, 90 292, 75 300" fill="none" stroke="rgba(21,184,50,0.4)" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
          </svg>
          <ChipOrbita texto="0 rastreadores" delay="0.9s" floatDelay="0s" style={{ top: -22, left: '-1%' }} />
          <ChipOrbita texto="100% do conteúdo" delay="1.1s" floatDelay="1.4s" style={{ top: 30, right: '-4%' }} />
          <ChipOrbita texto="sofia@inread.app" delay="1.3s" floatDelay="0.7s" style={{ bottom: -18, left: '8%' }} />
          <div style={{ ...dcard, borderRadius: 24, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', boxShadow: '0 30px 70px rgba(20,21,15,0.12), 0 2px 8px rgba(20,21,15,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: INK }}>Caixa</span>
              <span style={{ fontSize: 12, ...faint }}>3 por ler</span>
            </div>
            <MiniRow img="/demo/nl-tech.png" sender="Semana Tech" subject="Nº 142 — O regresso da web calma" />
            <MiniRow delay="0.5s" img="/demo/nl-design.png" sender="Café com Design" subject="Tipografia que respira" />
            <MiniRow delay="1s" img="/demo/nl-produto.png" sender="Produto & Co" subject="Como definir preços em SaaS" />
          </div>
        </div>

        <div className="h-seq" style={{ animationDelay: '0.62s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, fontSize: 12, ...quiet }}>
          {['Web', 'iPhone', 'Android', 'Mac', 'Windows'].map((p) => (
            <span key={p} style={{ border: `1px solid ${BORDER}`, borderRadius: 999, padding: '5px 12px' }}>
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
              <span key={`${p}-${i}`} style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'rgba(20,21,15,0.16)', whiteSpace: 'nowrap' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* percurso */}
      <section className="reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '92px 24px 20px', textAlign: 'center' }}>
        <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em', color: INK }}>
          Subscreves. Organizamos. <span className="voz" style={{ color: ACID, fontWeight: 400 }}>Acompanhas.</span>
        </h2>
        <div style={{ position: 'relative', marginTop: 46 }}>
          <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ position: 'absolute', top: 26, left: '6%', width: '88%', height: 60, overflow: 'visible' }}>
            <path className="trace-path" pathLength={1} d="M 0 30 C 180 -10, 320 70, 500 30 S 820 -10, 1000 30" fill="none" stroke={ACID} strokeWidth="2" strokeLinecap="round" strokeDasharray="1" />
          </svg>
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' }}>
            {[
              { n: '1', t: 'Subscreves', d: 'Usa o teu nome@inread.app em qualquer página de subscrição, podcast ou feed.' },
              { n: '2', t: 'Organizamos', d: 'Scripts, popups e pixels de rastreio ficam à porta. O conteúdo é categorizado sozinho.' },
              { n: '3', t: 'Acompanhas', d: 'Num lugar calmo — lês, ouves, e exportas o que importa em Markdown.' },
            ].map((p) => (
              <div key={p.n} className="trace-node" style={{ ...dcard, flex: '1 1 240px', minWidth: 0, borderRadius: 20, padding: '22px 20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, background: ACID, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>
                  {p.n}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700, color: INK }}>{p.t}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, ...quiet }}>{p.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* bento */}
      <section id="funcionalidades" className="reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '82px 24px 10px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em', textAlign: 'center', color: INK }}>
          Uma box de conhecimento <span className="voz" style={{ color: ACID, fontWeight: 400 }}>com superpoderes.</span>
        </h2>

        <div className="bento">
          {/* alias */}
          <div style={{ ...dcard, gridColumn: 'span 7', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: INK }}>Um endereço só para o que queres acompanhar</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Escolhes o teu nome@inread.app e usa-lo em newsletters, podcasts e feeds. O teu email pessoal fica fora disto — e nós nunca lhe tocamos.
            </p>
            <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(21,184,50,0.08)', border: '1px solid rgba(21,184,50,0.35)', borderRadius: 999, padding: '7px 14px', fontSize: 14, fontWeight: 600, color: ACID_INK }}>
              sofia@inread.app
            </div>
            <MiniRow img="/demo/nl-tech.png" sender="Semana Tech" subject="Nº 142 — O regresso da web calma" />
            <MiniRow delay="0.7s" img="/demo/nl-news.png" sender="Manhãs de Notícias" subject="O que importa esta terça-feira" />
          </div>

          {/* leitura limpa */}
          <div style={{ ...dcard, gridColumn: 'span 5', position: 'relative', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: INK }}>Leitura limpa</h3>
            <p style={{ margin: '0 0 6px', fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Anúncios, popups e rastreadores desaparecem. O conteúdo fica inteiro.
            </p>
            <div style={barra('60%', true)} />
            <div style={barra('92%')} />
            <div style={barra('86%')} />
            <div style={{ height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${ACID_LIGHT}, ${ACID})` }} />
            <div style={barra('88%')} />
            <div className="vanish" style={{ position: 'absolute', top: 88, right: 16, background: SURFACE, border: '1px solid rgba(178,58,58,0.3)', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#B23A3A', boxShadow: '0 6px 16px rgba(20,21,15,0.08)' }}>
              Popup de subscrição ✕
            </div>
            <div className="vanish" style={{ animationDelay: '0.7s', position: 'absolute', bottom: 46, right: 30, background: SURFACE, border: '1px solid rgba(156,107,26,0.3)', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#9C6B1A', boxShadow: '0 6px 16px rgba(20,21,15,0.08)' }}>
              Pixel de rastreio ✕
            </div>
          </div>

          {/* resumos IA + áudio */}
          <div style={{ ...dcard, gridColumn: 'span 5', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: INK }}>Resumo em três linhas, áudio em sete minutos</h3>
            <div className="sumIn" style={{ background: 'rgba(21,184,50,0.07)', border: '1px solid rgba(21,184,50,0.3)', borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: ACID_INK }}>✦ Resumo</span>
              <div style={{ height: 7, width: '96%', borderRadius: 999, background: 'rgba(21,184,50,0.35)' }} />
              <div style={{ height: 7, width: '74%', borderRadius: 999, background: 'rgba(21,184,50,0.35)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: SURFACE_SUNK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: '9px 14px' }}>
              <span style={{ width: 28, height: 28, borderRadius: 999, background: ACID, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: '0 0 auto' }}>
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 3, height: 18 }}>
                {[0, 0.15, 0.3, 0.45, 0.6].map((d) => (
                  <span key={d} className="eqb" style={{ animationDelay: `${d}s`, width: 4, height: 16, borderRadius: 999, background: ACID }} />
                ))}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: ACID_INK }}>O teu áudio de hoje</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, ...faint }}>No plano Pro, decides em segundos o que merece a atenção inteira.</p>
          </div>

          {/* highlights */}
          <div style={{ ...dcard, gridColumn: 'span 7', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: INK }}>Highlights que levas contigo</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: INK }}>
              <span className="sweep" style={{ padding: '1px 3px', backgroundImage: 'linear-gradient(rgba(21,184,50,0.22), rgba(21,184,50,0.22))' }}>O futuro de acompanhar conhecimento não é mais uma caixa de entrada</span> — é um lugar separado, sem pressa e sem rasto.
            </p>
            <div className="chipIn" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(21,184,50,0.08)', border: '1px solid rgba(21,184,50,0.35)', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: ACID_INK }}>
              highlights.md guardado — pronto para o Obsidian e o Notion
            </div>
            <p style={{ margin: 0, fontSize: 13, ...faint }}>Markdown limpo, sem formatos fechados. As tuas notas são tuas.</p>
          </div>

          {/* etiquetas */}
          <div style={{ ...dcard, gridColumn: 'span 6', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: INK }}>Organiza-se sozinha</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Cada edição chega com categorias automáticas: trabalho, finanças, tecnologia, notícias. Filtras com um toque.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Trabalho', 'Finanças', 'Tecnologia', 'Notícias', 'Lazer'].map((t, i) => (
                <span key={t} style={{ fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: '6px 13px', background: i === 2 ? ACID : SURFACE_SUNK, color: i === 2 ? '#fff' : INK_SOFT, border: i === 2 ? `1px solid ${ACID}` : `1px solid ${BORDER}` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* unsubscribe + descoberta */}
          <div style={{ ...dcard, gridColumn: 'span 6', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: INK }}>Cancelar — ou descobrir — é um clique</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, ...quiet }}>
              Quando algo deixa de interessar, cancelas na página de remetentes. E quando queres mais, descobres novas fontes sugeridas para ti.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: SURFACE_SUNK, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '10px 14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo/nl-produto.png" alt="" style={{ width: 30, height: 30, borderRadius: 9, flex: '0 0 auto', objectFit: 'cover' }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Produto & Co</span>
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#B23A3A', border: '1px solid rgba(178,58,58,0.35)', borderRadius: 999, padding: '6px 12px', flex: '0 0 auto' }}>
                Cancelar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* painel: privacidade (inversão de contraste — verde sobre o creme) */}
      <section className="reveal" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '82px 24px 0' }}>
        <div className="luz" style={{ borderRadius: 30, background: 'linear-gradient(150deg, #EAF7ED 0%, #BDEECA 55%, #A8F7B9 100%)', padding: 'clamp(36px, 6vw, 64px)', display: 'flex', flexDirection: 'column', gap: 22, boxShadow: '0 24px 60px rgba(20,21,15,0.1)' }}>
          <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--brand-deep)' }}>
            Acompanha sem deixar <span className="voz" style={{ color: 'var(--brand)', fontWeight: 400 }}>rasto.</span>
          </h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, maxWidth: 560, color: 'var(--ink-soft)' }}>
            Quase todas as newsletters trazem um pixel invisível que conta quando abres, onde estás e em que clicas. O inread remove-o antes de chegares a ver — os remetentes não sabem o que consomes, e nós não vendemos dados nem mostramos anúncios.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 5vw, 60px)', marginTop: 8 }}>
            {[
              { n: '0', l: 'rastreadores sobrevivem' },
              { n: '100%', l: 'do conteúdo preservado' },
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
        <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em', textAlign: 'center', color: INK }}>
          Começa grátis. <span className="voz" style={{ color: ACID, fontWeight: 400 }}>Fica se gostares.</span>
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ ...dcard, flex: '1 1 300px', minWidth: 0, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, ...quiet }}>Free</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1, color: INK }}>€0</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, lineHeight: 1.5, ...quiet }}>
              <li>Endereço privado nome@inread.app</li>
              <li>50 fontes ativas na caixa</li>
              <li>Etiquetas automáticas e pesquisa</li>
              <li>Highlights e exportação .md</li>
            </ul>
            <a href={cta} style={{ marginTop: 'auto', textAlign: 'center', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 600, color: INK }}>
              Começar grátis
            </a>
          </div>
          <div style={{ flex: '1 1 300px', minWidth: 0, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', gap: 14, background: `linear-gradient(160deg, ${ACID_LIGHT}, ${ACID})`, color: INK, boxShadow: '0 0 50px rgba(21,184,50,0.22), 0 20px 48px rgba(20,21,15,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Pro</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: ACID_LIGHT, background: INK, borderRadius: 999, padding: '4px 11px' }}>Preço de lançamento</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(21,22,15,0.5)', textDecoration: 'line-through' }}>€7,99</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1 }}>€4,99</span>
              <span style={{ fontSize: 14, color: 'rgba(21,22,15,0.65)' }}>/mês · ou €49,99/ano</span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(21,22,15,0.7)' }}>Garante este preço até ao final do ano — fica teu para sempre.</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, lineHeight: 1.5, color: 'rgba(21,22,15,0.85)' }}>
              <li>Armazenamento ilimitado</li>
              <li>Resumos com IA e áudio diário</li>
              <li>Alias personalizado à tua escolha</li>
              <li>Exportações avançadas (Notion, Obsidian)</li>
            </ul>
            <a href={proHref} style={{ marginTop: 'auto', textAlign: 'center', background: INK, borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 700, color: ACID_LIGHT }}>
              {proLabel}
            </a>
          </div>
        </div>
        <p style={{ margin: 0, textAlign: 'center', fontSize: 13, ...faint }}>IVA incluído. Cancela quando quiseres — exportas tudo antes de sair.</p>
      </section>

      {/* CTA final */}
      <section style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1060, margin: '0 auto', padding: '84px 24px 72px', textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div className="sd-orb" aria-hidden="true" style={{ width: 480, height: 480, top: -140, left: '50%', marginLeft: -240, position: 'absolute', opacity: 0.4, background: 'radial-gradient(circle at 50% 50%, rgba(21,184,50,0.2) 0%, rgba(241,240,235,0) 70%)' }} />
          <div className="reveal" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <h2 className="t-rise" style={{ margin: 0, fontSize: 'clamp(34px, 5.4vw, 56px)', fontWeight: 700, letterSpacing: '-0.015em', maxWidth: 700, color: INK }}>
              O teu conhecimento merece <span className="voz" style={{ color: ACID, fontWeight: 400 }}>uma casa melhor.</span>
            </h2>
            <p style={{ margin: 0, fontSize: 15.5, ...quiet }}>Demora menos de um minuto: escolhes o endereço e começas a acompanhar.</p>
            <a href={cta} style={ctaAcid}>{ctaLabel}</a>
          </div>
        </div>
      </section>

      {/* rodapé */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 10 }}>
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
