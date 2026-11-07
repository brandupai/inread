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
  if (!userId) return NextResponse.json({ guardados: [] }, { status: 401 });

  const guardados = await prisma.episodioGuardado.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ guardados });
}

export async function POST(req: NextRequest) {
  const userId = await utilizadorAtual();
  if (!userId) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });

  const corpo = await req.json().catch(() => null);
  const audioUrl = corpo?.audioUrl as string | undefined;
  const titulo = corpo?.titulo as string | undefined;
  const feedUrl = corpo?.feedUrl as string | undefined;
  const podcastNome = corpo?.podcastNome as string | undefined;
  if (!audioUrl || !titulo || !feedUrl || !podcastNome) {
    return NextResponse.json({ erro: 'campos em falta' }, { status: 400 });
  }

  const existente = await prisma.episodioGuardado.findFirst({ where: { userId, audioUrl } });
  if (existente) {
    await prisma.episodioGuardado.delete({ where: { id: existente.id } });
    return NextResponse.json({ guardado: false });
  }

  await prisma.episodioGuardado.create({
    data: {
      userId,
      audioUrl,
      titulo,
      feedUrl,
      podcastNome,
      podcastImagem: corpo?.podcastImagem ?? null,
      duracao: corpo?.duracao ?? null,
      dataPublicacao: corpo?.dataPublicacao ?? null,
    },
  });
  return NextResponse.json({ guardado: true });
}
