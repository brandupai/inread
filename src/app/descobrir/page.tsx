import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import AppShell from '@/components/AppShell';

export const dynamic = 'force-dynamic';

const CATS = ['Em alta', 'Tecnologia', 'Notícias', 'Negócios', 'Produtividade', 'Cultura'];

export default async function Descobrir() {
  let userId: string | null = null;
  if (authEnabled) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');
    userId = session.user.id;
  } else {
    const u = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
    userId = u?.id ?? null;
  }
  const porLer = userId ? await prisma.newsletter.count({ where: { userId, isRead: false } }) : 0;

  // sugestões a partir das etiquetas que já recebe
  const etiquetas = userId
    ? await prisma.newsletter.groupBy({
        by: ['contextTag'],
        where: { userId, contextTag: { not: null } },
        _count: { contextTag: true },
      })
    : [];
  const topo = etiquetas
    .map((e: { contextTag: string | null; _count: { contextTag: number } }) => ({ tag: e.contextTag, n: e._count.contextTag }))
    .filter((e: { tag: string | null }) => Boolean(e.tag))
    .sort((a: { n: number }, b: { n: number }) => b.n - a.n)
    .slice(0, 3);

  return (
    <AppShell
      ativo="descobrir"
      porLer={porLer}
      titulo="Descobrir"
      acima={
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '0 2px 4px' }}>
          {CATS.map((c, i) => (
            <span key={c} className={i === 0 ? 'f-chip on' : 'f-chip'}>{c}</span>
          ))}
        </div>
      }
      leitor={
        <div style={{ margin: 'auto', textAlign: 'center', padding: 32, maxWidth: 440, color: 'var(--leitor-txt-fraco)' }}>
          <div style={{ fontSize: 30, marginBottom: 10 }}>🧭</div>
          <p style={{ fontWeight: 700, color: 'var(--leitor-txt)', marginBottom: 6 }}>O diretório está a ser construído</p>
          <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            Vais poder subscrever newsletters e podcasts por categoria com um clique, direto para o teu endereço
            @inread.app. És autor? Submete a tua em <a href="/parceiros">inread.app/parceiros</a>.
          </p>
        </div>
      }
    >
      {topo.length > 0 && (
        <div className="m-carta" style={{ flexDirection: 'column', gap: 7, alignItems: 'stretch' }}>
          <span className="t-app-forte" style={{ fontSize: 13, fontWeight: 700 }}>✦ A pensar em ti</span>
          <span className="t-app-fraco" style={{ fontSize: 12, lineHeight: 1.55 }}>
            Lês sobretudo {topo.map((t: { tag: string | null }) => t.tag).join(', ')}. Vamos sugerir newsletters, feeds e
            podcasts desses temas assim que o diretório abrir.
          </span>
        </div>
      )}
      {['Semana Tech', 'Café com Design', 'Manhãs de Notícias', 'Produto & Co'].map((n) => (
        <div key={n} className="m-carta" style={{ alignItems: 'center' }}>
          <span style={{ width: 42, height: 42, borderRadius: 11, background: 'linear-gradient(135deg, #1BE03C, #09572C)', flex: '0 0 auto' }} />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: '1 1 auto' }}>
            <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700 }}>{n}</span>
            <span className="t-app-tenue" style={{ fontSize: 11 }}>Exemplo — diretório em construção</span>
          </span>
        </div>
      ))}
    </AppShell>
  );
}
