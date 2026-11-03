import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cleanEmailHtml, detectFormat, estimateReadingTime, htmlToPlainText } from '@/lib/clean';
import { enforceQuota } from '@/lib/quota';

export const dynamic = 'force-dynamic';

/**
 * Ingestão de email. Os registos MX de inread.app apontam para o router
 * (Cloudflare Email Routing + Worker), que converte o email em JSON e faz
 * POST para este endpoint com o header x-inread-secret.
 *
 * Payload esperado:
 * { "to": "jorge_x9@inread.app", "from": "autor@newsletter.com",
 *   "fromName": "Semana Tech", "subject": "...", "html": "...", "text": "..." }
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-inread-secret');
  if (!secret || secret !== process.env.INBOUND_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { to?: string; from?: string; fromName?: string; subject?: string; html?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { to, from, fromName, subject, html, text } = body;
  if (!to || !from || !subject || !html) {
    return NextResponse.json({ error: 'missing fields (to, from, subject, html)' }, { status: 400 });
  }

  const inboxHash = to.split('@')[0]?.toLowerCase();
  const user = await prisma.user.findUnique({ where: { inboxHash } });
  if (!user) {
    // 200 para o router não re-tentar para sempre; alias desconhecido é descartado
    return NextResponse.json({ ok: true, dropped: 'unknown alias' });
  }

  const contentHtml = cleanEmailHtml(html);
  const plain = text?.trim() || htmlToPlainText(contentHtml);

  await enforceQuota(user.id, user.plan);

  const newsletter = await prisma.newsletter.create({
    data: {
      userId: user.id,
      senderEmail: from,
      senderName: fromName ?? null,
      subject,
      contentHtml,
      contentText: plain,
      format: detectFormat(subject, html),
      readingTime: estimateReadingTime(plain),
    },
  });

  return NextResponse.json({ ok: true, id: newsletter.id });
}
