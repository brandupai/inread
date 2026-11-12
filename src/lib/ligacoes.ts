import { randomBytes } from 'crypto';
import { prisma } from './db';
import { auth, authEnabled } from '@/auth';

/** Campos de ligações externas guardados no utilizador (ver prisma/schema.prisma). */
export type Ligacoes = {
  feedToken: string | null;
  readwiseToken: string | null;
  notionToken: string | null;
  notionWorkspace: string | null;
  notionPageId: string | null;
};

export function deUser(u: unknown): Ligacoes {
  const x = (u ?? {}) as Partial<Ligacoes>;
  return {
    feedToken: x.feedToken ?? null,
    readwiseToken: x.readwiseToken ?? null,
    notionToken: x.notionToken ?? null,
    notionWorkspace: x.notionWorkspace ?? null,
    notionPageId: x.notionPageId ?? null,
  };
}

export async function lerLigacoes(userId: string): Promise<Ligacoes> {
  return deUser(await prisma.user.findUnique({ where: { id: userId } }));
}

export async function gravarLigacoes(userId: string, dados: Partial<Ligacoes>): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: dados as never });
}

export async function userPorFeedToken(token: string) {
  return prisma.user.findFirst({ where: { feedToken: token } as never });
}

export function novoToken(): string {
  return randomBytes(24).toString('hex');
}

/** Id do utilizador com sessão (ou o primeiro, em modo sem autenticação). */
export async function donoAtual(): Promise<string | null> {
  if (!authEnabled) {
    const u = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
    return u?.id ?? null;
  }
  const s = await auth();
  return s?.user?.id ?? null;
}
