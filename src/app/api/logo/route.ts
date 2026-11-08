import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

/** Domínio "raiz" (mail.beehiiv.com → beehiiv.com). Heurística simples para .co.uk e afins. */
function raiz(host: string): string {
  const p = host.toLowerCase().split('.').filter(Boolean);
  if (p.length <= 2) return p.join('.');
  const ultimo = p[p.length - 1];
  const penultimo = p[p.length - 2];
  if (ultimo.length === 2 && penultimo.length <= 3) return p.slice(-3).join('.');
  return p.slice(-2).join('.');
}

/**
 * Logo de um remetente, obtido pelo servidor (o browser do utilizador nunca fala
 * com terceiros — mantém a privacidade). Devolve 404 se não houver.
 */
export async function GET(req: NextRequest) {
  const d = (req.nextUrl.searchParams.get('d') ?? '').trim();
  if (!/^[a-z0-9]([a-z0-9.-]{1,98})[a-z0-9]$/i.test(d) || !d.includes('.')) {
    return new Response('domínio inválido', { status: 400 });
  }
  const dominio = raiz(d);
  try {
    const r = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(dominio)}&sz=128`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return new Response('sem logo', { status: 404 });
    const tipo = r.headers.get('content-type') ?? 'image/png';
    if (!tipo.startsWith('image/')) return new Response('sem logo', { status: 404 });
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      headers: { 'Content-Type': tipo, 'Cache-Control': 'public, max-age=2592000, immutable' },
    });
  } catch {
    return new Response('sem logo', { status: 404 });
  }
}
