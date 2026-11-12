import { NextRequest, NextResponse } from 'next/server';
import { donoAtual, gravarLigacoes } from '@/lib/ligacoes';
import { notionAtivo, paginaMae, trocarCodigo } from '@/lib/notion';
import { baseUrl } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** Regresso do Notion: troca o código pelo token e guarda a página-mãe escolhida pelo utilizador. */
export async function GET(req: NextRequest) {
  const base = baseUrl();
  const volta = (estado: string) => {
    const res = NextResponse.redirect(`${base}/definicoes?c=ligacoes&lig=${estado}`);
    res.cookies.set('inread_notion_state', '', { maxAge: 0, path: '/api/notion' });
    return res;
  };
  if (!notionAtivo) return volta('notion-indisponivel');

  const uid = await donoAtual();
  if (!uid) return NextResponse.redirect(`${base}/login`);

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const esperado = req.cookies.get('inread_notion_state')?.value;
  if (!code || !state || !esperado || state !== esperado) return volta('notion-erro');

  const troca = await trocarCodigo(code, `${base}/api/notion/callback`);
  if (!troca) return volta('notion-erro');

  const pagina = await paginaMae(troca.token);
  await gravarLigacoes(uid, { notionToken: troca.token, notionWorkspace: troca.workspace, notionPageId: pagina });
  return volta(pagina ? 'notion-ok' : 'notion-sempagina');
}
