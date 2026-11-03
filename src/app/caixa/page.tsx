import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, signOut, authEnabled } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * Caixa de leitura: lista à esquerda, leitor à direita.
 * Com autenticação configurada, cada utilizador vê apenas a sua caixa;
 * sem providers configurados corre em modo de desenvolvimento (1.º utilizador).
 */
export default async function Caixa({ searchParams }: { searchParams: Promise<{ n?: string }> }) {
  const { n } = await searchParams;

  let user = null;
  if (authEnabled) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) redirect('/login');
    if (!user.inboxHash) redirect('/bemvindo');
  } else {
    user = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  }

  if (!user) {
    return (
      <main style={{ padding: 48, maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24 }}>inread.</h1>
        <p>
          Ainda não há utilizadores. Corre <code>npm run db:seed</code> para criar o utilizador de
          desenvolvimento e uma newsletter de exemplo.
        </p>
      </main>
    );
  }

  async function sair() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  const newsletters = await prisma.newsletter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, senderName: true, senderEmail: true, subject: true, readingTime: true, isRead: true, createdAt: true },
  });

  const selected = n
    ? await prisma.newsletter.findFirst({ where: { id: n, userId: user.id } })
    : newsletters.length > 0
      ? await prisma.newsletter.findFirst({ where: { id: newsletters[0].id } })
      : null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh' }}>
      <aside style={{ flex: '1 1 320px', minWidth: 0, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, padding: '0 4px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="inread" style={{ height: 22, width: 'auto' }} />
            <span style={{ fontSize: 12, color: 'var(--quiet)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.inboxHash}@inread.app · {newsletters.length}/50
            </span>
          </div>
          {authEnabled && (
            <form action={sair}>
              <button type="submit" style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--quiet)', cursor: 'pointer', padding: 0 }}>
                Sair
              </button>
            </form>
          )}
        </div>
        {newsletters.map((item: { id: string; senderName: string | null; senderEmail: string; subject: string; readingTime: number | null; isRead: boolean; createdAt: Date }) => (
          <a
            key={item.id}
            href={`/caixa?n=${item.id}`}
            className="glass"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              padding: '12px 14px',
              borderRadius: 14,
              border: item.id === selected?.id ? '1.5px solid var(--brand)' : undefined,
            }}
          >
            <span style={{ fontSize: 11.5, fontWeight: 500, color: item.isRead ? 'var(--faint)' : 'var(--quiet)' }}>
              {item.senderName ?? item.senderEmail}
            </span>
            <span style={{ fontSize: 14, fontWeight: item.isRead ? 500 : 700 }}>{item.subject}</span>
            <span style={{ fontSize: 11, color: 'var(--faint)' }}>
              {item.createdAt.toLocaleDateString('pt-PT')} · {item.readingTime ?? 1} min
            </span>
          </a>
        ))}
        {newsletters.length === 0 && (
          <p style={{ fontSize: 14, color: 'var(--quiet)', padding: '0 4px' }}>
            A tua caixa está vazia. Subscreve newsletters com o alias{' '}
            <strong>{user.inboxHash}@inread.app</strong> e elas aparecem aqui, limpas.
          </p>
        )}
      </aside>
      <main style={{ flex: '999 1 560px', minWidth: 0, padding: 24 }}>
        {selected ? (
          <article className="glass" style={{ borderRadius: 24, padding: '36px clamp(24px, 6vw, 64px) 48px', maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <div style={{ fontSize: 13, color: 'var(--quiet)' }}>
                {selected.senderName ?? selected.senderEmail} · {selected.createdAt.toLocaleDateString('pt-PT')} ·{' '}
                {selected.readingTime ?? 1} min
              </div>
              <a
                href={`/api/export/${selected.id}`}
                style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '9px 16px', fontSize: 13, fontWeight: 600 }}
              >
                Exportar .md
              </a>
            </div>
            <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: '0 0 20px' }}>{selected.subject}</h1>
            <div className="artigo" dangerouslySetInnerHTML={{ __html: selected.contentHtml }} />
          </article>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 120, color: 'var(--quiet)' }}>
            <p style={{ fontWeight: 600, color: 'var(--ink)' }}>Nenhuma newsletter selecionada</p>
            <p style={{ fontSize: 14 }}>Seleciona uma newsletter para ler</p>
          </div>
        )}
      </main>
    </div>
  );
}
