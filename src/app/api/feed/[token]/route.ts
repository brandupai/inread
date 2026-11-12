import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { userPorFeedToken } from '@/lib/ligacoes';
import { baseUrl } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const x = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const limpo = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
const cdata = (s: string) => `<![CDATA[${limpo(s).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

/**
 * Feed RSS privado da caixa: as últimas 50 newsletters, para ler em qualquer leitor de RSS.
 * O token no URL é o segredo — quem o tiver lê o feed; o utilizador pode gerar outro nas Definições.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{48}$/.test(token)) return new Response('not found', { status: 404 });
  const user = await userPorFeedToken(token);
  if (!user) return new Response('not found', { status: 404 });

  const itens = await prisma.newsletter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, subject: true, senderName: true, senderEmail: true, contentHtml: true, contentText: true, createdAt: true },
  });
  const base = baseUrl();

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">\n<channel>\n` +
    `<title>inread — ${x(user.inboxHash ?? 'a minha caixa')}</title>\n<link>${base}/caixa</link>\n` +
    `<description>As tuas newsletters no inread (feed privado).</description>\n<language>pt</language>\n` +
    itens
      .map(
        (n: { id: string; subject: string; senderName: string | null; senderEmail: string; contentHtml: string; contentText: string | null; createdAt: Date }) =>
          `<item>\n<title>${x(n.subject)}</title>\n<link>${base}/caixa?n=${n.id}</link>\n<guid isPermaLink="false">inread-${n.id}</guid>\n` +
          `<pubDate>${n.createdAt.toUTCString()}</pubDate>\n<dc:creator>${x(n.senderName ?? n.senderEmail)}</dc:creator>\n` +
          `<description>${x((n.contentText ?? '').replace(/\s+/g, ' ').trim().slice(0, 300))}</description>\n` +
          `<content:encoded>${cdata(n.contentHtml)}</content:encoded>\n</item>`
      )
      .join('\n') +
    `\n</channel>\n</rss>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'private, max-age=600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
