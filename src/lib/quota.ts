import { prisma } from './db';

const FREE_LIMIT = parseInt(process.env.FREE_NEWSLETTER_LIMIT ?? '50', 10);

// Guard-rail técnico do plano Pro — nunca comunicado ao utilizador (continua
// "armazenamento ilimitado" em toda a UI/copy). Apenas protecção contra abuso
// ou erro (ex. loop de webhook), não um limite de produto.
const PRO_SAFETY_LIMIT = parseInt(process.env.PRO_NEWSLETTER_SAFETY_LIMIT ?? '3000', 10);

/**
 * Rotação FIFO: quando entra a newsletter N+1 e o plano está no seu limite,
 * apaga-se a mais antiga (não favorita) para abrir espaço. Free usa
 * FREE_LIMIT (limite de produto, visível na UI). Pro usa PRO_SAFETY_LIMIT
 * (muito mais alto, invisível — só guarda contra uso abusivo).
 */
export async function enforceQuota(userId: string, plan: string): Promise<void> {
  const limite = plan === 'free' ? FREE_LIMIT : PRO_SAFETY_LIMIT;

  const count = await prisma.newsletter.count({ where: { userId } });
  if (count < limite) return;

  const excess = count - limite + 1; // abre espaço para a que vai entrar
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
