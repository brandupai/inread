import { NextRequest, NextResponse } from 'next/server';
import TurndownService from 'turndown';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * Exportação aberta: GET /api/export/<id> devolve a newsletter
 * (com os highlights no fim) em Markdown limpo, pronto para
 * Obsidian/Notion. "As tuas notas são tuas."
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const n = await prisma.newsletter.findUnique({
    where: { id },
    include: { highlights: true },
  });
  if (!n) return NextResponse.json({ error: 'not found' }, { status: 404 });

  if (authEnabled) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== n.userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const turndown = new TurndownService({ headingStyle: 'atx' });
  const bodyMd = turndown.turndown(n.contentHtml);

  const highlightsMd =
    n.highlights.length > 0
      ? '\n\n## Highlights\n\n' +
        n.highlights
          .map((h: { text: string; note: string | null }) => `> ${h.text}` + (h.note ? `\n>\n> **Nota:** ${h.note}` : ''))
          .join('\n\n')
      : '';

  const md = `# ${n.subject}\n\n*${n.senderName ?? n.senderEmail} — ${n.createdAt.toISOString().slice(0, 10)}*\n\n${bodyMd}${highlightsMd}\n`;

  const filename = n.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'newsletter';

  return new NextResponse(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.md"`,
    },
  });
}
