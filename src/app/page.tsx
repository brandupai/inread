import type { CSSProperties } from 'react';
import { auth, authEnabled } from '@/auth';

export const dynamic = 'force-dynamic';

const glassPill: CSSProperties = {
  border: '1px solid rgba(255,255,255,0.85)',
  borderRadius: 999,
};

const card: CSSProperties = {
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.85)',
  boxShadow: '0 16px 44px rgba(52,78,65,0.14)',
};

function MiniRow({ delay, color, sender, subject }: { delay?: string; color: string; sender: string; subject: string }) {
  return (
    <div
      className="cardIn"
      style={{ animationDelay: delay, display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 12, padding: '10px 12px' }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 999, background: color }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{sender}</span>
        <span style={{ fontSize: 11, color: 'var(--quiet)' }}>{subject}</span>
      </div>
    </div>
  );
}

export default async function Home() {
  const session = authEnabled ? await auth() : null;
  const cta = session?.user ? '/caixa' : '/login';
  const ctaLabel = session?.user ? 'A minha caixa' : 'Criar alias grátis';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header
        className="glass"
        style={{ ...glassPill, width: 'calc(100% - 32px)', maxWidth: 1120, margin: '20px auto 0', padding: '12px 22px', boxShadow: '0 10px 30px rgba(52,78,65,0.1)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="inread" style={{ height: 26, width: 'auto' }} />
        <nav aria-label="Navegação" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, fontSize: 14, fontWeight: 500 }}>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#precos">Preços</a>
          {!session?.user && <a href="/login">Entrar</a>}
          <a href={cta} style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '9px 18px', fontWeight: 600 }}>
            {ctaLabel}
          </a>
        </nav>
      </header>

      <section style={{ width: '100%', maxWidth: 820, margin: '0 auto', padding: '64px 24px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
        <div className="glass" style={{ ...glassPill, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-dark)', padding: '7px 16px' }}>
          Sem acesso ao teu Gmail ou Outlook
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(38px, 7vw, 58px)', lineHeight: 1.08, fontWeight: 700 }}>As tuas newsletters, fora da caixa de entrada.</h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: 560 }}>
          Recebe tudo num email privado @inread.app, lê sem scripts nem pixels de rastreio, e leva os teus highlights contigo em Markdown.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <a href={cta} style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '15px 28px', fontSize: 16, fontWeight: 600, boxShadow: '0 14px 34px rgba(48,73,63,0.3)' }}>
            {session?.user ? 'Abrir a minha caixa' : 'Criar o meu alias grátis'}
          </a>
          <span style={{ fontSize: 13, color: 'var(--quiet)' }}>Grátis até 50 newsletters · sem cartão</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, fontSize: 12, color: 'var(--brand-dark)' }}>
          {['Web', 'iPhone', 'Android', 'Mac', 'Windows'].map((p) => (
            <span key={p} className="glass" style={{ ...glassPill, padding: '5px 12px' }}>
              {p}
            </span>
          ))}
        </div>
      </section>

      <section id="funcionalidades" style={{ width: '100%', maxWidth: 1060, margin: '0 auto', padding: '16px 24px 8px', display: 'flex', flexDirection: 'column', gap: 56 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 38, fontWeight: 700 }}>Tudo o que precisas para ler melhor</h2>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--quiet)', maxWidth: 520 }}>Do email exclusivo aos resumos com IA — vê como funciona.</p>
        </div>

        {/* F1 — alias */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 36 }}>
          <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand)' }}>Grátis</div>
            <h3 style={{ margin: 0, fontSize: 27, fontWeight: 700, lineHeight: 1.2 }}>O teu email de newsletters: nome@inread.app</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Cria a conta, escolhe o teu endereço e usa-o em todas as subscrições: as newsletters aparecem aqui, limpas — nunca na tua caixa de trabalho.
            </p>
          </div>
          <div className="glass" style={{ ...card, flex: '1 1 380px', minWidth: 0, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(166,214,174,0.9)', borderRadius: 999, padding: '7px 14px', fontSize: 14, fontWeight: 600, color: 'var(--brand-dark)' }}>
              sofia<span style={{ color: 'var(--brand)' }}>@inread.app</span>
            </div>
            <MiniRow color="linear-gradient(135deg,#A6D6AE,#679281)" sender="Semana Tech" subject="Nº 142 — O regresso da web calma" />
            <MiniRow delay="0.5s" color="linear-gradient(135deg,#E8DFC8,#B9A878)" sender="Café com Design" subject="Tipografia que respira" />
            <MiniRow delay="1s" color="linear-gradient(135deg,#C9D8E8,#7E99B5)" sender="Produto & Co" subject="Como definir preços em SaaS" />
          </div>
        </div>

        {/* F2 — leitura limpa */}
        <div style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: 36, flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand)' }}>Privacidade</div>
            <h3 style={{ margin: 0, fontSize: 27, fontWeight: 700, lineHeight: 1.2 }}>Leitura limpa, artigo completo</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Antes de chegares a ler, removemos scripts, popups e pixels de rastreio — e mantemos 100% do texto e das imagens originais. Sem feeds parciais, sem ninguém a saber o que lês.
            </p>
          </div>
          <div className="glass" style={{ ...card, flex: '1 1 380px', minWidth: 0, position: 'relative', padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 10, width: '62%', borderRadius: 999, background: 'rgba(48,73,63,0.5)' }} />
            <div style={{ height: 8, width: '94%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div style={{ height: 8, width: '88%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div style={{ height: 8, width: '91%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div style={{ height: 64, borderRadius: 12, background: 'linear-gradient(135deg,#CDEBD2,#8FBFA6)' }} />
            <div style={{ height: 8, width: '86%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div style={{ height: 8, width: '90%', borderRadius: 999, background: 'rgba(48,73,63,0.22)' }} />
            <div className="vanish" style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.92)', border: '1px solid #D9A0A0', borderRadius: 10, padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#8A3B3B', boxShadow: '0 10px 24px rgba(52,78,65,0.18)' }}>
              Popup de subscrição ✕
            </div>
            <div className="vanish" style={{ animationDelay: '0.6s', position: 'absolute', bottom: 52, right: 30, background: 'rgba(255,255,255,0.92)', border: '1px solid #D9C08F', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#7A5A1E', boxShadow: '0 10px 24px rgba(52,78,65,0.18)' }}>
              Pixel de rastreio 1x1 ✕
            </div>
            <div className="vanish" style={{ animationDelay: '1.2s', position: 'absolute', top: 78, left: 18, background: 'rgba(255,255,255,0.92)', border: '1px solid #B9B2D9', borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600, color: '#4A3E8A', boxShadow: '0 10px 24px rgba(52,78,65,0.18)' }}>
              Script externo ✕
            </div>
          </div>
        </div>

        {/* F3 — resumos IA + áudio */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 36 }}>
          <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand)' }}>Pro</div>
            <h3 style={{ margin: 0, fontSize: 27, fontWeight: 700, lineHeight: 1.2 }}>Resumos com IA e áudio diário</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Cada edição pode começar com um resumo de três linhas gerado por IA — decides em segundos se vale a leitura inteira. E todos os dias tens um apanhado em áudio das tuas newsletters.
            </p>
          </div>
          <div className="glass" style={{ ...card, flex: '1 1 380px', minWidth: 0, padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 8, width: '92%', borderRadius: 999, background: 'rgba(48,73,63,0.2)' }} />
            <div style={{ height: 8, width: '88%', borderRadius: 999, background: 'rgba(48,73,63,0.2)' }} />
            <div style={{ height: 8, width: '90%', borderRadius: 999, background: 'rgba(48,73,63,0.2)' }} />
            <div className="sumIn" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(166,214,174,0.95)', borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-dark)' }}>✦ Resumo IA</div>
              <div style={{ height: 8, width: '96%', borderRadius: 999, background: 'rgba(103,146,129,0.55)' }} />
              <div style={{ height: 8, width: '78%', borderRadius: 999, background: 'rgba(103,146,129,0.55)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 999, padding: '9px 14px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--brand-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 3, height: 20 }}>
                {[0, 0.15, 0.3, 0.45, 0.6].map((d) => (
                  <span key={d} className="eqb" style={{ animationDelay: `${d}s`, width: 4, height: 18, borderRadius: 999, background: 'var(--brand)' }} />
                ))}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)' }}>O teu áudio de hoje · 7 min</span>
            </div>
          </div>
        </div>

        {/* F4 — highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: 36, flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand)' }}>Ecossistema aberto</div>
            <h3 style={{ margin: 0, fontSize: 27, fontWeight: 700, lineHeight: 1.2 }}>Highlights que levas contigo</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Sublinha e anota enquanto lês. Tudo exporta em Markdown limpo para o Obsidian e o Notion — as tuas notas são tuas, sem custos extra nem formatos fechados.
            </p>
          </div>
          <div className="glass" style={{ ...card, flex: '1 1 380px', minWidth: 0, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#262A26' }}>
              <span className="sweep" style={{ padding: '1px 3px' }}>O futuro da leitura na web não é mais uma caixa de entrada</span> — é um lugar separado, sem pressa e sem rasto.
            </p>
            <div className="chipIn" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(166,214,174,0.95)', borderRadius: 999, padding: '8px 14px', fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)' }}>
              ↓ highlights.md → Obsidian · Notion
            </div>
          </div>
        </div>

        {/* organização */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ margin: 0, fontSize: 27, fontWeight: 700, textAlign: 'center' }}>Organização sem caos</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              { t: 'Etiquetas e filtros', d: 'Agrupa por tema ou remetente; a caixa mostra só o que escolheres.' },
              { t: 'Unsubscribe num clique', d: 'Cancela qualquer subscrição sem procurar o link escondido no rodapé.' },
              { t: 'Pesquisa e favoritos', d: 'Encontra qualquer edição antiga e guarda as melhores para reler.' },
            ].map((f) => (
              <div key={f.t} className="glass" style={{ flex: '1 1 260px', minWidth: 0, border: '1px solid rgba(255,255,255,0.85)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{f.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)' }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* preços */}
      <section id="precos" style={{ width: '100%', maxWidth: 880, margin: '0 auto', padding: '64px 24px 72px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={{ margin: 0, fontSize: 36, fontWeight: 700, textAlign: 'center' }}>Um preço justo, sem surpresas</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <div className="glass" style={{ ...card, flex: '1 1 300px', minWidth: 0, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-soft)' }}>Free</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700 }}>€0</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
              <li>Email privado nome@inread.app</li>
              <li>50 newsletters ativas na caixa</li>
              <li>Etiquetas e highlights</li>
              <li>Leitura limpa, sem rastreio</li>
            </ul>
            <a href={cta} style={{ marginTop: 'auto', textAlign: 'center', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(48,73,63,0.3)', borderRadius: 999, padding: '12px 18px', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
              Começar grátis
            </a>
          </div>
          <div className="glass" style={{ ...card, flex: '1 1 300px', minWidth: 0, border: '2px solid var(--brand)', padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--brand-dark)' }}>Pro</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-dark)', background: 'rgba(166,214,174,0.6)', borderRadius: 999, padding: '4px 10px' }}>Em breve</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700 }}>€4,99</span>
              <span style={{ fontSize: 14, color: 'var(--quiet)' }}>/mês · ou €49,99/ano</span>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
              <li>Armazenamento ilimitado</li>
              <li>Alias personalizado à tua escolha</li>
              <li>Resumos com IA e áudio diário</li>
              <li>Exportações avançadas (.md, Notion, Obsidian)</li>
            </ul>
            <a href={cta} style={{ marginTop: 'auto', textAlign: 'center', background: 'var(--brand-dark)', borderRadius: 999, padding: '12px 18px', fontSize: 15, fontWeight: 600, color: '#fff' }}>
              Começar grátis
            </a>
          </div>
        </div>
      </section>

      <footer style={{ width: '100%', maxWidth: 1120, margin: 'auto auto 0', padding: 24, borderTop: '1px solid rgba(255,255,255,0.7)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 13, color: 'var(--quiet)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="" style={{ width: 22, height: 22, borderRadius: 6 }} />© 2026 inread.app
        </span>
        <span style={{ display: 'flex', gap: 16 }}>
          <a href="/login" style={{ color: 'var(--quiet)' }}>Entrar</a>
        </span>
      </footer>
    </div>
  );
}
