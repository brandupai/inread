import { prisma } from './db';

const FREE_LIMIT = parseInt(process.env.FREE_NEWSLETTER_LIMIT ?? '50', 10);

/**
 * Rotação FIFO do plano Free: quando entra a newsletter N+1,
 * apaga-se a mais antiga (não favorita). Pro = sem limite.
 */
export async function enforceQuota(userId: string, plan: string): Promise<void> {
  if (plan !== 'free') return;

  const count = await prisma.newsletter.count({ where: { userId } });
  if (count < FREE_LIMIT) return;

  const excess = count - FREE_LIMIT + 1; // abre espaço para a que vai entrar
  const oldest = await prisma.newsletter.findMany({
    where: { userId, isStarred: false },
    orderBy: { createdAt: 'asc' },
    take: excess,
    select: { id: true },
  });

  if (oldest.length > 0) {
    await prisma.newsletter.deleteMany({ where: { id: { in: oldest.map((n: { id: string }) => n.id) } } });
  }
}
