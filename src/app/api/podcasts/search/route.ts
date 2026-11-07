import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type ResultadoItunes = {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  feedUrl?: string;
};

/**
 * Pesquisa de podcasts via iTunes Search API (Apple) — pública, grátis, sem
 * chave. Devolve, para cada podcast, o feedUrl do RSS público, que depois
 * lemos em /api/podcasts/episodios.
 */
export async function GET(req: NextRequest) {
  const termo = (req.nextUrl.searchParams.get('termo') ?? '').trim();
  if (!termo) return NextResponse.json({ podcasts: [] });

  const url = `https://itunes.apple.com/search?media=podcast&limit=12&country=PT&term=${encodeURIComponent(termo)}`;

  try {
    const r = await fetch(url, { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(`iTunes respondeu ${r.status}`);
    const dados: { results?: ResultadoItunes[] } = await r.json();

    const podcasts = (dados.results ?? [])
      .filter((p) => p.feedUrl)
      .map((p) => ({
        id: String(p.collectionId),
        nome: p.collectionName,
        autor: p.artistName,
        imagem: p.artworkUrl600 ?? p.artworkUrl100 ?? null,
        feedUrl: p.feedUrl as string,
      }));

    return NextResponse.json({ podcasts });
  } catch {
    return NextResponse.json({ podcasts: [], erro: 'Não foi possível pesquisar podcasts agora.' });
  }
}
