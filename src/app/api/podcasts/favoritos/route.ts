import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';

async function utilizadorAtual(): Promise<string | null> {
  if (authEnabled) {
    const sessao = await auth();
    return sessao?.user?.id ?? null;
  }
  const u = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  return u?.id ?? null;
}

export async function GET() {
  const userId = await utilizadorAtual();
  if (!userId) return NextResponse.json({ favoritos: [] }, { status: 401 });

  const favoritos = await prisma.podcastFavorito.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ favoritos });
}

export async function POST(req: NextRequest) {
  const userId = await utilizadorAtual();
  if (!userId) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });

  const corpo = await req.json().catch(() => null);
  const feedUrl = corpo?.feedUrl as string | undefined;
  const nome = corpo?.nome as string | undefined;
  if (!feedUrl || !nome) return NextResponse.json({ erro: 'feedUrl e nome são obrigatórios' }, { status: 400 });

  const existente = await prisma.podcastFavorito.findFirst({ where: { userId, feedUrl } });
  if (existente) {
    await prisma.podcastFavorito.delete({ where: { id: existente.id } });
    return NextResponse.json({ seguido: false });
  }

  await prisma.podcastFavorito.create({
    data: {
      userId,
      feedUrl,
      nome,
      autor: corpo?.autor ?? null,
      imagem: corpo?.imagem ?? null,
      ultimaDataVista: corpo?.ultimaDataVista ?? null,
    },
  });
  return NextResponse.json({ seguido: true });
}

export async function PATCH(req: NextRequest) {
  const userId = await utilizadorAtual();
  if (!userId) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });

  const corpo = await req.json().catch(() => null);
  const feedUrl = corpo?.feedUrl as string | undefined;
  const ultimaDataVista = corpo?.ultimaDataVista as string | undefined;
  if (!feedUrl || !ultimaDataVista) return NextResponse.json({ erro: 'feedUrl e ultimaDataVista são obrigatórios' }, { status: 400 });

  await prisma.podcastFavorito.updateMany({ where: { userId, feedUrl }, data: { ultimaDataVista } });
  return NextResponse.json({ ok: true });
}
