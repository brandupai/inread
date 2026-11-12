import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { donoAtual } from '@/lib/ligacoes';
import { notionAtivo, urlAutorizar } from '@/lib/notion';
import { baseUrl } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** Inicia a ligação ao Notion (OAuth). O `state` fica num cookie httpOnly e é conferido no regresso. */
export async function GET() {
  const base = baseUrl();
  if (!notionAtivo) return NextResponse.redirect(`${base}/definicoes?c=ligacoes&lig=notion-indisponivel`);
  if (!(await donoAtual())) return NextResponse.redirect(`${base}/login`);

  const state = randomBytes(16).toString('hex');
  const res = NextResponse.redirect(urlAutorizar(`${base}/api/notion/callback`, state));
  res.cookies.set('inread_notion_state', state, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/api/notion' });
  return res;
}
