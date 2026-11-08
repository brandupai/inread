import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { enviarPush } from '@/lib/push';

export const dynamic = 'force-dynamic';

async function donoId(): Promise<string | null> {
  if (!authEnabled) return (await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } }))?.id ?? null;
  return (await auth())?.user?.id ?? null;
}

type Sub = { endpoint?: string; keys?: { p256dh?: string; auth?: string } };

/** Regista (ou atualiza) o dispositivo. Body: PushSubscription JSON. ?teste=1 envia uma notificação de teste. */
export async function POST(req: NextRequest) {
  const uid = await donoId();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (req.nextUrl.searchParams.get('teste')) {
    await enviarPush(uid, { titulo: 'inread', corpo: 'As notificações estão a funcionar.', url: '/caixa', tag: 'teste' });
    return NextResponse.json({ ok: true });
  }

  let b: Sub;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const { endpoint, keys } = b;
  if (!endpoint || endpoint.length > 700 || !/^https:\/\//.test(endpoint) || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'subscrição inválida' }, { status: 400 });
  }
  const ua = (req.headers.get('user-agent') ?? '').slice(0, 250);
  await prisma.pushSub.upsert({
    where: { endpoint },
    create: { userId: uid, endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent: ua },
    update: { userId: uid, p256dh: keys.p256dh, auth: keys.auth, userAgent: ua },
  });
  return NextResponse.json({ ok: true });
}

/** Remove o dispositivo. Body: { endpoint } */
export async function DELETE(req: NextRequest) {
  const uid = await donoId();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { endpoint?: string };
  if (b.endpoint) await prisma.pushSub.deleteMany({ where: { endpoint: b.endpoint, userId: uid } });
  return NextResponse.json({ ok: true });
}
