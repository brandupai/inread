import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';

export const dynamic = 'force-dynamic';

async function donoId(): Promise<string | null> {
  if (!authEnabled) {
    const u = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
    return u?.id ?? null;
  }
  const session = await auth();
  return session?.user?.id ?? null;
}

/** Cria um highlight: { newsletterId, text, note? } */
export async function POST(req: NextRequest) {
  const uid = await donoId();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { newsletterId?: string; text?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!body.newsletterId || !text) {
    return NextResponse.json({ error: 'missing fields (newsletterId, text)' }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: 'highlight too long' }, { status: 400 });
  }

  const dona = await prisma.newsletter.findFirst({ where: { id: body.newsletterId, userId: uid } });
  if (!dona) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const h = await prisma.highlight.create({
    data: { newsletterId: dona.id, text, note: body.note?.trim() || null },
  });
  return NextResponse.json({ ok: true, id: h.id });
}

/** Apaga um highlight: /api/highlights?id=... */
export async function DELETE(req: NextRequest) {
  const uid = await donoId();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  const h = await prisma.highlight.findFirst({ where: { id }, include: { newsletter: true } });
  if (!h || h.newsletter.userId !== uid) return NextResponse.json({ error: 'not found' }, { status: 404 });

  await prisma.highlight.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
