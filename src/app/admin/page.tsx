import type { CSSProperties } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'brandup.pt@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const cartao: CSSProperties = { borderRadius: 18, padding: '18px 20px' };
const kpiNum: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, lineHeight: 1.1 };
const kpiLabel: CSSProperties = { fontSize: 12, color: 'var(--quiet)' };
const seccao: CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--quiet)', padding: '14px 4px 0' };

function dia(d: Date) {
  return d.toISOString().slice(0, 10);
}

function Barras({ titulo, dados }: { titulo: string; dados: Array<{ label: string; n: number }> }) {
  const max = Math.max(1, ...dados.map((d) => d.n));
  return (
    <div className="glass" style={{ ...cartao, flex: '1 1 300px', minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12 }}>{titulo}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90 }}>
        {dados.map((d) => (
          <div key={d.label} title={`${d.label}: ${d.n}`} style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
            <div style={{ width: '100%', borderRadius: 6, background: 'linear-gradient(180deg,#A6D6AE,#679281)', height: `${Math.max(4, (d.n / max) * 78)}px`, opacity: d.n === 0 ? 0.25 : 1 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'var(--faint)' }}>
        <span>{dados[0]?.label.slice(5)}</span>
        <span>{dados[dados.length - 1]?.label.slice(5)}</span>
      </div>
    </div>
  );
}

export default async function Admin() {
  if (authEnabled) {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');
    if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) redirect('/caixa');
  }

  const agora = Date.now();
  const d7 = new Date(agora - 7 * 86400000);
  const d30 = new Date(agora - 30 * 86400000);
  const d14 = new Date(agora - 13 * 86400000);
  d14.setUTCHours(0, 0, 0, 0);

  const [totalUsers, proUsers, novos7, novos30, comAlias, totalNl, nl24h, totalHl] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: 'pro' } }),
    prisma.user.count({ where: { createdAt: { gte: d7 } } }),
    prisma.user.count({ where: { createdAt: { gte: d30 } } }),
    prisma.user.count({ where: { inboxHash: { not: null } } }),
    prisma.newsletter.count(),
    prisma.newsletter.count({ where: { createdAt: { gte: new Date(agora - 86400000) } } }),
    prisma.highlight.count(),
  ]);

  const [signupsRecentes, nlRecentes] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: d14 } }, select: { createdAt: true } }),
    prisma.newsletter.findMany({ where: { createdAt: { gte: d14 } }, select: { createdAt: true } }),
  ]);

  const dias: Array<{ label: string; n: number }> = [];
  const diasNl: Array<{ label: string; n: number }> = [];
  for (let i = 13; i >= 0; i--) {
    const label = dia(new Date(agora - i * 86400000));
    dias.push({ label, n: signupsRecentes.filter((u: { createdAt: Date }) => dia(u.createdAt) === label).length });
    diasNl.push({ label, n: nlRecentes.filter((u: { createdAt: Date }) => dia(u.createdAt) === label).length });
  }

  type Cliente = {
    email: string;
    inboxHash: string | null;
    plan: string;
    createdAt: Date;
    _count: { newsletters: number };
    newsletters: Array<{ createdAt: Date }>;
  };

  const clientes: Cliente[] = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      email: true, inboxHash: true, plan: true, createdAt: true,
      _count: { select: { newsletters: true } },
      newsletters: { orderBy: { createdAt: 'desc' }, take: 1, select: { createdAt: true } },
    },
  });

  const freeUsers = totalUsers - proUsers;
  const mrr = (proUsers * 4.99).toFixed(2);

  const td: CSSProperties = { padding: '9px 10px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.6)', whiteSpace: 'nowrap' };
  const th: CSSProperties = { ...td, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--quiet)', textAlign: 'left' };

  return (
    <main style={{ minHeight: '100vh', padding: '24px 16px 64px', maxWidth: 1060, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="inread" style={{ height: 24, width: 'auto' }} />
          <h1 style={{ margin: 0, fontSize: 28 }}>Admin</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, fontWeight: 600 }}>
          <a href="#clientes" className="glass" style={{ borderRadius: 999, padding: '7px 14px' }}>Clientes</a>
          <a href="#analytics" className="glass" style={{ borderRadius: 999, padding: '7px 14px' }}>Analytics</a>
          <a href="#financeiro" className="glass" style={{ borderRadius: 999, padding: '7px 14px' }}>Financeiro</a>
          <a href="/caixa" className="glass" style={{ borderRadius: 999, padding: '7px 14px', color: 'var(--brand-dark)' }}>← App</a>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {[
          { n: totalUsers, l: 'Utilizadores' },
          { n: freeUsers, l: 'Free' },
          { n: proUsers, l: 'Pro' },
          { n: novos7, l: 'Novos · 7 dias' },
          { n: novos30, l: 'Novos · 30 dias' },
          { n: comAlias, l: 'Com alias escolhido' },
          { n: totalNl, l: 'Newsletters recebidas' },
          { n: nl24h, l: 'Últimas 24h' },
          { n: totalHl, l: 'Highlights' },
        ].map((k) => (
          <div key={k.l} className="glass" style={{ ...cartao, flex: '1 1 140px', minWidth: 0 }}>
            <div style={kpiNum}>{k.n}</div>
            <div style={kpiLabel}>{k.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Barras titulo="Registos por dia (14 dias)" dados={dias} />
        <Barras titulo="Newsletters recebidas por dia (14 dias)" dados={diasNl} />
      </div>

      {/* Clientes */}
      <div id="clientes" style={seccao}>Clientes registados</div>
      <div className="glass" style={{ borderRadius: 18, padding: '6px 10px', overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={th}>Email</th>
              <th style={th}>Alias</th>
              <th style={th}>Plano</th>
              <th style={th}>Registo</th>
              <th style={th}>Newsletters</th>
              <th style={th}>Última receção</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.email}>
                <td style={td}>{c.email}</td>
                <td style={td}>{c.inboxHash ? `${c.inboxHash}@inread.app` : <span style={{ color: 'var(--faint)' }}>— por escolher</span>}</td>
                <td style={td}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '3px 10px', background: c.plan === 'pro' ? 'var(--brand-dark)' : 'rgba(166,214,174,0.5)', color: c.plan === 'pro' ? '#fff' : 'var(--brand-dark)' }}>
                    {c.plan.toUpperCase()}
                  </span>
                </td>
                <td style={td}>{c.createdAt.toLocaleDateString('pt-PT')}</td>
                <td style={td}>{c._count.newsletters}</td>
                <td style={td}>{c.newsletters[0] ? c.newsletters[0].createdAt.toLocaleDateString('pt-PT') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics */}
      <div id="analytics" style={seccao}>Analytics do site</div>
      <div className="glass" style={{ ...cartao, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
        <strong>Por ligar.</strong> Para visitas, origens de tráfego e conversão recomendo o <strong>Plausible</strong> ou o <strong>Umami</strong> — analytics sem cookies, alinhados com o posicionamento de privacidade do inread (e sem banner de cookies). Liga-se com um script de uma linha no site e dá: visitas, fontes (Google, redes, direto), países, páginas mais vistas e conversões no funil registo → alias → 1.ª newsletter. Diz-me qual preferes e eu integro.
      </div>

      {/* Financeiro */}
      <div id="financeiro" style={seccao}>Financeiro</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <div className="glass" style={{ ...cartao, flex: '1 1 180px' }}>
          <div style={kpiNum}>€{mrr}</div>
          <div style={kpiLabel}>MRR estimado ({proUsers} Pro × €4,99)</div>
        </div>
        <div className="glass" style={{ ...cartao, flex: '3 1 320px', fontSize: 14, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
          <strong>Pagamentos (Stripe)</strong> — subscrições Pro mensal/anual com Stripe Checkout + Customer Portal (o cliente gere cartão e cancelamento sozinho). Webhooks atualizam o plano na base de dados automaticamente.<br />
          <strong>Faturação (Moloni)</strong> — a cada pagamento Stripe, o webhook cria a fatura-recibo na Moloni via API e envia-a por email ao cliente. Preciso das tuas chaves de API de ambos para ativar.
        </div>
      </div>
    </main>
  );
}
