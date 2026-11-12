import { NextRequest, NextResponse } from 'next/server';
import PostalMime from 'postal-mime';
import { prisma } from '@/lib/db';
import { cleanEmailHtml, detectContext, detectFormat, estimateReadingTime, htmlToPlainText } from '@/lib/clean';
import { enforceQuota } from '@/lib/quota';
import { enviarPush } from '@/lib/push';

export const dynamic = 'force-dynamic';

/**
 * Ingestão de email. Os registos MX de inread.app apontam para o router
 * (Cloudflare Email Routing + Worker), que faz POST para este endpoint
 * com o header x-inread-secret.
 *
 * Dois formatos aceites:
 * 1. Email em bruto (preferido — o Worker fica mínimo):
 *    { "to": "jorge_x9@inread.app", "from": "autor@news.com", "raw": "<MIME completo>" }
 *    O MIME é interpretado aqui (postal-mime): subject, html, text, nome do remetente.
 * 2. Já interpretado: { to, from, fromName?, subject, html, text? }
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-inread-secret');
  if (!secret || secret !== process.env.INBOUND_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { to?: string; from?: string; fromName?: string; subject?: string; html?: string; text?: string; raw?: string; listUnsubscribe?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  let { to, from, fromName, subject, html, text, listUnsubscribe } = body;

  if (body.raw) {
    try {
      const parsed = await PostalMime.parse(body.raw);
      subject = subject ?? parsed.subject ?? '(sem assunto)';
      html = parsed.html ?? (parsed.text ? `<pre>${parsed.text}</pre>` : undefined);
      text = parsed.text ?? undefined;
      // o From do cabeçalho é o remetente real; o do envelope pode ser um endereço de bounce
      // ou, num reencaminhamento automático (Gmail/Outlook), o email de quem reencaminha
      fromName = fromName ?? parsed.from?.name ?? undefined;
      from = parsed.from?.address ?? from ?? undefined;
      to = to ?? parsed.to?.[0]?.address ?? undefined;
      listUnsubscribe =
        listUnsubscribe ??
        parsed.headers?.find((h: { key: string; value: string }) => h.key?.toLowerCase() === 'list-unsubscribe')?.value ??
        undefined;
    } catch {
      return NextResponse.json({ error: 'invalid raw mime' }, { status: 400 });
    }
  }

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
      contextTag: detectContext(from, fromName ?? null, subject, plain),
      listUnsubscribe: listUnsubscribe ?? null,
      readingTime: estimateReadingTime(plain),
    },
  });

  // aviso no telemóvel/desktop (best-effort; só o remetente e o assunto)
  await enviarPush(user.id, {
    titulo: fromName?.trim() || from,
    corpo: subject,
    url: `/caixa?n=${newsletter.id}`,
    tag: 'nl-' + newsletter.id,
  });

  return NextResponse.json({ ok: true, id: newsletter.id });
}
