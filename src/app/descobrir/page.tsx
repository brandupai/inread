import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import DescobrirInterativo from './DescobrirInterativo';

export const dynamic = 'force-dynamic';

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
  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { inboxHash: true } });
  const alias = user?.inboxHash ? `${user.inboxHash}@inread.app` : 'o-teu-alias@inread.app';
  const porLer = await prisma.newsletter.count({ where: { userId, isRead: false } });

  return <DescobrirInterativo porLer={porLer} alias={alias} />;
}
