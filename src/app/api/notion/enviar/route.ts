import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { donoAtual, gravarLigacoes, lerLigacoes } from '@/lib/ligacoes';
import { criarPagina, paginaMae } from '@/lib/notion';
import { htmlToPlainText } from '@/lib/clean';
import { baseUrl } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** Envia uma newsletter (artigo + sublinhados) para o Notion do utilizador: { id } */
export async function POST(req: NextRequest) {
  const uid = await donoAtual();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let id: string | undefined;
  try {
    id = ((await req.json()) as { id?: string }).id;
  } catch {}
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  const lig = await lerLigacoes(uid);
  if (!lig.notionToken) return NextResponse.json({ error: 'notion-desligado' }, { status: 409 });

  const n = await prisma.newsletter.findFirst({ where: { id, userId: uid }, include: { highlights: true } });
  if (!n) return NextResponse.json({ error: 'not found' }, { status: 404 });

  let pai = lig.notionPageId;
  if (!pai) {
    pai = await paginaMae(lig.notionToken);
    if (pai) await gravarLigacoes(uid, { notionPageId: pai });
  }
  if (!pai) return NextResponse.json({ error: 'notion-sempagina' }, { status: 409 });

  const url = await criarPagina(lig.notionToken, pai, {
    titulo: n.subject,
    remetente: n.senderName ?? n.senderEmail,
    data: n.createdAt,
    texto: n.contentText?.trim() || htmlToPlainText(n.contentHtml),
    sublinhados: n.highlights.map((h: { text: string; note: string | null }) => ({ text: h.text, note: h.note })),
    link: `${baseUrl()}/caixa?n=${n.id}`,
  });
  if (!url) return NextResponse.json({ error: 'notion-falhou' }, { status: 502 });
  return NextResponse.json({ ok: true, url });
}
