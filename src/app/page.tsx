import type { CSSProperties } from 'react';
import { auth, authEnabled } from '@/auth';
import RodapeSite from '@/components/RodapeSite';

export const dynamic = 'force-dynamic';

const glassPill: CSSProperties = {
  border: '1px solid rgba(255,255,255,0.85)',
  borderRadius: 999,
};

const card: CSSProperties = {
  border: '1px solid rgba(255,255,255,0.85)',
  boxShadow: '0 16px 44px rgba(52,78,65,0.14)',
};

const eyebrow: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--brand-dark)',
  padding: '7px 16px',
};

function MiniRow({ delay, color, sender, subject }: { delay?: string; color: string; sender: string; subject: string }) {
  return (
    <div
      className="cardIn"
      style={{ animationDelay: delay, display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 12, padding: '10px 12px' }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 999, background: color, flex: '0 0 auto' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{sender}</span>
        <span style={{ fontSize: 11, color: 'var(--quiet)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject}</span>
      </div>
    </div>
  );
}

function ChipFlutuante({ texto, delay, style }: { texto: string; delay: string; style: CSSProperties }) {
  return (
    <span
      className="chip-pop"
      style={{ animationDelay: delay, position: 'absolute', zIndex: 2, background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(166,214,174,0.95)', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--brand-dark)', boxShadow: '0 12px 28px rgba(52,78,65,0.2)', whiteSpace: 'nowrap', ...style }}
    >
      {texto}
    </span>
  );
}

const PLATAFORMAS = ['Substack', 'beehiiv', 'Ghost', 'Mailchimp', 'Kit', 'Buttondown', 'MailerLite', 'Brevo', 'Campaign Monitor'];

export default async function Home() {
  const session = authEnabled ? await auth() : null;
  const entrou = Boolean(session?.user);
  const cta = entrou ? '/caixa' : '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'clip' }}>
      {/* faixa de anúncio */}
      <a href="/faq" style={{ display: 'block', textAlign: 'center', background: 'var(--deep, #152A20)', color: '#DFEEE2', fontSize: 13, padding: '9px 16px' }}>
        <strong style={{ color: '#fff' }}>Novo:</strong> highlights exportáveis para Obsidian e Notion, em Markdown limpo
      </a>

      {/* navegação */}
      <header
        className="glass"
        style={{ ...glassPill, position: 'sticky', top: 14, zIndex: 30, width: 'calc(100% - 32px)', maxWidth: 1120, margin: '18px auto 0', padding: '12px 22px', boxShadow: '0 10px 30px rgba(52,78,65,0.12)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="inread" style={{ height: 26, width: 'auto' }} />
        <nav aria-label="Navegação" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, fontSize: 14, fontWeight: 500 }}>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#precos">Preços</a>
          <a href="/faq">FAQ</a>
          {!entrou && <a href="/login">Entrar</a>}
          <a href={cta} style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '9px 18px', fontWeight: 600 }}>
            {entrou ? 'A minha caixa' : 'Criar endereço grátis'}
          </a>
        </nav>
      </header>

      {/* hero */}
      <section style={{ width: '100%', maxWidth: 1060, margin: '0 auto', padding: '72px 24px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, textAlign: 'center' }}>
        <div className="glass h-seq" style={{ ...glassPill, ...eyebrow }}>
          O leitor de newsletters que não pede acesso ao teu email
        </div>
        <h1 className="h-seq" style={{ animationDelay: '0.12s', margin: 0, fontSize: 'clamp(40px, 7.4vw, 76px)', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.02em', maxWidth: 900 }}>
          A tua caixa de entrada
          <br />
          não foi feita para ler.
          <br />
          <span className="voz" style={{ color: 'var(--brand)', fontWeight: 400 }}>O inread foi.</span>
        </h1>
        <p className="h-seq" style={{ animationDelay: '0.24s', margin: 0, fontSize: 18, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: 520 }}>
          Um endereço privado para as tuas newsletters, leitura sem rastreio e highlights que levas contigo. Tudo num lugar calmo, longe do trabalho.
        </p>
        <div className="h-seq" style={{ animationDelay: '0.36s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <a href={cta} style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '16px 30px', fontSize: 16.5, fontWeight: 600, boxShadow: '0 16px 36px rgba(48,73,63,0.32)' }}>
            {entrou ? 'Abrir a minha caixa' : 'Criar o meu endereço grátis'}
          </a>
          <span style={{ fontSize: 13.5, color: 'var(--quiet)' }}>Grátis até 50 newsletters · sem cartão</span>
        </div>

        {/* visual com chips flutuantes */}
        <div className="h-seq" style={{ animationDelay: '0.5s', position: 'relative', width: '100%', maxWidth: 560, marginTop: 18 }}>
          <ChipFlutuante texto="0 rastreadores" delay="0.9s" style={{ top: -16, left: '2%' }} />
          <ChipFlutuante texto="100% do texto" delay="1.1s" style={{ top: 40, right: '-2%' }} />
          <ChipFlutuante texto="sofia@inread.app" delay="1.3s" style={{ bottom: -14, left: '12%' }} />
          <div className="glass" style={{ ...card, borderRadius: 24, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700 }}>Caixa</span>
              <span style={{ fontSize: 12, color: 'var(--quiet)' }}>3 por ler</span>
            </div>
            <MiniRow color="linear-gradient(135deg,#A6D6AE,#679281)" sender="Semana Tech" subject="Nº 142 — O regresso da web calma" />
            <MiniRow delay="0.5s" color="linear-gradient(135deg,#E8DFC8,#B9A878)" sender="Café com Design" subject="Tipografia que respira" />
            <MiniRow delay="1s" color="linear-gradient(135deg,#C9D8E8,#7E99B5)" sender="Produto & Co" subject="Como definir preços em SaaS" />
          </div>
        </div>

        <div className="h-seq" style={{ animationDelay: '0.62s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, fontSize: 12, color: 'var(--brand-dark)' }}>
          {['Web', 'iPhone', 'Android', 'Mac', 'Windows'].map((p) => (
            <span key={p} className="glass" style={{ ...glassPill, padding: '5px 12px' }}>
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* marquee de plataformas */}
      <section aria-label="Plataformas compatíveis" style={{ width: '100%', maxWidth: 1120, margin: '26px auto 0', padding: '0 24px' }}>
        <p style={{ margin: '0 0 10px', textAlign: 'center', fontSize: 13, color: 'var(--quiet)' }}>Funciona com tudo o que envia email</p>
        <div className="marquee">
          <div className="marquee-track">
            {[...PLATAFORMAS, ...PLATAFORMAS].map((p, i) => (
              <span key={`${p}-${i}`} style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'rgba(48,73,63,0.42)', whiteSpace: 'nowrap' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* percurso: subscreves → limpamos → lês */}
      <section className="reveal" style={{ width: '100%', maxWidth: 1060, margin: '0 auto', padding: '88px 24px 20px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.015em' }}>
          Subscreves. Limpamos. <span className="voz" style={{ color: 'var(--brand)', fontWeight: 400 }}>Lês.</span>
        </h2>
        <div style={{ position: 'relative', marginTop: 44 }}>
          <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ position: 'absolute', top: 26, left: '6%', width: '88%', height: 60, overflow: 'visible' }}>
            <path className="trace-path" pathLength={1} d="M 0 30 C 180 -10, 320 70, 500 30 S 820 -10, 1000 30" fill="none" stroke="#679281" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1" />
          </svg>
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' }}>
            {[
              { n: '1', t: 'Subscreves', d: 'Usa o teu nome@inread.app em qualquer página de subscrição.' },
              { n: '2', t: 'Limpamos', d: 'Scripts, popups e pixels de rastreio ficam à porta. O texto entra inteiro.' },
              { n: '3', t: 'Lês', d: 'Num lugar calmo — e exportas o que importa em Markdown.' },
            ].map((p) => (
              <div key={p.n} className="trace-node glass" style={{ ...card, flex: '1 1 240px', minWidth: 0, borderRadius: 20, padding: '22px 20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--brand-dark)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>
                  {p.n}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700 }}>{p.t}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{p.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* bento de funcionalidades */}
      <section id="funcionalidades" style={{ width: '100%', maxWidth: 1060, margin: '0 auto', padding: '78px 24px 10px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.015em', textAlign: 'center' }}>
          Tudo o que uma newsletter <span className="voz" style={{ color: 'var(--brand)', fontWeight: 400 }}>merece.</span>
        </h2>

        <div className="bento">
          {/* alias */}
          <div className="glass" style={{ ...card, gridColumn: 'span 7', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Um endereço só para newsletters</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Escolhes o teu nome@inread.app e usa-lo em todas as subscrições. O teu email pessoal fica fora disto — e nós nunca lhe tocamos.
            </p>
            <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(166,214,174,0.9)', borderRadius: 999, padding: '7px 14px', fontSize: 14, fontWeight: 600, color: 'var(--brand-dark)' }}>
              sofia<span style={{ color: 'var(--brand)' }}>@inread.app</span>
            </div>
            <MiniRow color="linear-gradient(135deg,#A6D6AE,#679281)" sender="Semana Tech" subject="Nº 142 — O regresso da web calma" />
            <MiniRow delay="0.7s" color="linear-gradient(135deg,#E8DFC8,#B9A878)" sender="Café com Design" subject="Tipografia que respira" />
          </div>

          {/* leitura limpa */}
          <div className="glass" style={{ ...card, gridColumn: 'span 5', position: 'relative', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Leitura limpa</h3>
            <p style={{ margin: '0 0 6px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Anúncios, popups e rastreadores desaparecem. O artigo fica inteiro.
            </p>
            <div style={{ height: 9, width: '60%', borderRadius: 999, background: 'rgba(48,73,63,0.5)' }} />
            <div style={{ height: 7, width: '92%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div style={{ height: 7, width: '86%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div style={{ height: 52, borderRadius: 12, background: 'linear-gradient(135deg,#CDEBD2,#8FBFA6)' }} />
            <div style={{ height: 7, width: '88%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div className="vanish" style={{ position: 'absolute', top: 88, right: 16, background: 'rgba(255,255,255,0.92)', border: '1px solid #D9A0A0', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#8A3B3B', boxShadow: '0 10px 24px rgba(52,78,65,0.18)' }}>
              Popup de subscrição ✕
            </div>
            <div className="vanish" style={{ animationDelay: '0.7s', position: 'absolute', bottom: 46, right: 30, background: 'rgba(255,255,255,0.92)', border: '1px solid #D9C08F', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#7A5A1E', boxShadow: '0 10px 24px rgba(52,78,65,0.18)' }}>
              Pixel de rastreio ✕
            </div>
          </div>

          {/* resumos IA + áudio */}
          <div className="glass" style={{ ...card, gridColumn: 'span 5', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Resumo em três linhas, áudio em sete minutos</h3>
            <div className="sumIn" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(166,214,174,0.95)', borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--brand-dark)' }}>✦ Resumo</span>
              <div style={{ height: 7, width: '96%', borderRadius: 999, background: 'rgba(103,146,129,0.55)' }} />
              <div style={{ height: 7, width: '74%', borderRadius: 999, background: 'rgba(103,146,129,0.55)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 999, padding: '9px 14px' }}>
              <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--brand-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: '0 0 auto' }}>
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 3, height: 18 }}>
                {[0, 0.15, 0.3, 0.45, 0.6].map((d) => (
                  <span key={d} className="eqb" style={{ animationDelay: `${d}s`, width: 4, height: 16, borderRadius: 999, background: 'var(--brand)' }} />
                ))}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)' }}>O teu áudio de hoje</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--quiet)' }}>No plano Pro, decides em segundos o que merece a leitura inteira.</p>
          </div>

          {/* highlights */}
          <div className="glass" style={{ ...card, gridColumn: 'span 7', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Highlights que levas contigo</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: '#262A26' }}>
              <span className="sweep" style={{ padding: '1px 3px' }}>O futuro da leitura não é mais uma caixa de entrada</span> — é um lugar separado, sem pressa e sem rasto.
            </p>
            <div className="chipIn" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(166,214,174,0.95)', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--brand-dark)' }}>
              highlights.md guardado — pronto para o Obsidian e o Notion
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--quiet)' }}>Markdown limpo, sem formatos fechados. As tuas notas são tuas.</p>
          </div>

          {/* etiquetas duplas */}
          <div className="glass" style={{ ...card, gridColumn: 'span 6', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Organiza-se sozinha</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Cada edição chega com duas etiquetas automáticas: o formato e o contexto. Filtras com um toque.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Trabalho', 'Finanças', 'Tecnologia', 'Notícias', 'Lazer'].map((t, i) => (
                <span key={t} style={{ fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: '6px 13px', background: i === 2 ? 'var(--brand-dark)' : 'rgba(255,255,255,0.8)', color: i === 2 ? '#fff' : 'var(--brand-dark)', border: '1px solid rgba(166,214,174,0.8)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* unsubscribe */}
          <div className="glass" style={{ ...card, gridColumn: 'span 6', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Cancelar é um clique</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Quando uma newsletter deixa de interessar, cancelas na página de remetentes — sem caçar o link escondido no rodapé.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 14, padding: '10px 14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#C9D8E8,#7E99B5)', flex: '0 0 auto' }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Produto & Co</span>
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#8A3B3B', border: '1px solid rgba(217,160,160,0.7)', borderRadius: 999, padding: '6px 12px', background: 'rgba(255,255,255,0.7)', flex: '0 0 auto' }}>
                Cancelar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* painel escuro: privacidade */}
      <section style={{ width: '100%', maxWidth: 1060, margin: '0 auto', padding: '78px 24px 0' }}>
        <div style={{ borderRadius: 30, background: 'linear-gradient(150deg, #1C3528 0%, #152A20 60%, #16251D 100%)', color: '#E8F2EA', padding: 'clamp(36px, 6vw, 64px)', display: 'flex', flexDirection: 'column', gap: 22, boxShadow: '0 30px 70px rgba(21,42,32,0.4)' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-0.015em', color: '#fff' }}>
            Lê sem deixar <span className="voz" style={{ color: 'var(--brand-light)', fontWeight: 400 }}>rasto.</span>
          </h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, maxWidth: 560, color: 'rgba(232,242,234,0.85)' }}>
            Quase todas as newsletters trazem um pixel invisível que conta quando abres, onde estás e em que clicas. O inread remove-o antes de chegares a ler — os remetentes não sabem o que lês, e nós não vendemos dados nem mostramos anúncios.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 5vw, 60px)', marginTop: 8 }}>
            {[
              { n: '0', l: 'rastreadores sobrevivem' },
              { n: '100%', l: 'do texto preservado' },
              { n: '1', l: 'endereço privado, teu' },
            ].map((s) => (
              <div key={s.l} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, color: 'var(--brand-light)', lineHeight: 1 }}>{s.n}</span>
                <span style={{ fontSize: 13.5, color: 'rgba(232,242,234,0.75)' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* preços */}
      <section id="precos" style={{ width: '100%', maxWidth: 920, margin: '0 auto', padding: '84px 24px 10px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.015em', textAlign: 'center' }}>
          Começa grátis. <span className="voz" style={{ color: 'var(--brand)', fontWeight: 400 }}>Fica se gostares.</span>
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div className="glass" style={{ ...card, flex: '1 1 300px', minWidth: 0, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-soft)' }}>Free</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1 }}>€0</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
              <li>Endereço privado nome@inread.app</li>
              <li>50 newsletters ativas na caixa</li>
              <li>Etiquetas automáticas e pesquisa</li>
              <li>Highlights e exportação .md</li>
            </ul>
            <a href={cta} style={{ marginTop: 'auto', textAlign: 'center', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(48,73,63,0.3)', borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
              Começar grátis
            </a>
          </div>
          <div style={{ flex: '1 1 300px', minWidth: 0, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', gap: 14, background: 'linear-gradient(150deg, #1C3528, #152A20)', color: '#E8F2EA', boxShadow: '0 24px 56px rgba(21,42,32,0.38)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--brand-light)' }}>Pro</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#152A20', background: 'var(--brand-light)', borderRadius: 999, padding: '4px 11px' }}>Em breve</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, lineHeight: 1, color: '#fff' }}>€4,99</span>
              <span style={{ fontSize: 14, color: 'rgba(232,242,234,0.7)' }}>/mês · ou €49,99/ano</span>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, lineHeight: 1.5, color: 'rgba(232,242,234,0.9)' }}>
              <li>Armazenamento ilimitado</li>
              <li>Resumos com IA e áudio diário</li>
              <li>Alias personalizado à tua escolha</li>
              <li>Exportações avançadas (Notion, Obsidian)</li>
            </ul>
            <a href={cta} style={{ marginTop: 'auto', textAlign: 'center', background: 'var(--brand-light)', borderRadius: 999, padding: '13px 18px', fontSize: 15, fontWeight: 700, color: '#152A20' }}>
              Começar grátis
            </a>
          </div>
        </div>
        <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: 'var(--quiet)' }}>IVA incluído. Cancela quando quiseres — exportas tudo antes de sair.</p>
      </section>

      {/* CTA final */}
      <section style={{ width: '100%', maxWidth: 1060, margin: '0 auto', padding: '70px 24px 20px', textAlign: 'center' }}>
        <div className="glass" style={{ ...card, borderRadius: 30, padding: 'clamp(40px, 7vw, 72px) clamp(24px, 5vw, 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(30px, 4.6vw, 46px)', fontWeight: 700, letterSpacing: '-0.015em', maxWidth: 640 }}>
            As tuas newsletters merecem <span className="voz" style={{ color: 'var(--brand)', fontWeight: 400 }}>uma casa melhor.</span>
          </h2>
          <p style={{ margin: 0, fontSize: 15.5, color: 'var(--ink-soft)' }}>Demora menos de um minuto: escolhes o endereço e começas a subscrever.</p>
          <a href={cta} style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '16px 32px', fontSize: 16.5, fontWeight: 600, boxShadow: '0 16px 36px rgba(48,73,63,0.32)' }}>
            {entrou ? 'Abrir a minha caixa' : 'Criar o meu endereço grátis'}
          </a>
        </div>
      </section>

      <RodapeSite />

      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var els=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('in')});return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.3});els.forEach(function(el){io.observe(el)})}catch(err){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')})}})();",
        }}
      />
    </div>
  );
}
