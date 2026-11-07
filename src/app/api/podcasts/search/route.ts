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

function mapear(p: ResultadoItunes) {
  return {
    id: String(p.collectionId),
    nome: p.collectionName,
    autor: p.artistName,
    imagem: p.artworkUrl600 ?? p.artworkUrl100 ?? null,
    feedUrl: p.feedUrl as string,
  };
}

async function pesquisarCatalogo(termo: string, country: string): Promise<ResultadoItunes[]> {
  const url = `https://itunes.apple.com/search?media=podcast&limit=15&country=${country}&term=${encodeURIComponent(termo)}`;
  const r = await fetch(url, { next: { revalidate: 3600 } });
  if (!r.ok) throw new Error(`iTunes (${country}) respondeu ${r.status}`);
  const dados: { results?: ResultadoItunes[] } = await r.json();
  return dados.results ?? [];
}

/**
 * Pesquisa de podcasts via iTunes Search API (Apple) — pública, grátis, sem
 * chave. Devolve, para cada podcast, o feedUrl do RSS público, que depois
 * lemos em /api/podcasts/episodios.
 *
 * Combina o catálogo "US" (o mais completo — cobre também a generalidade dos
 * podcasts internacionais em inglês) com o catálogo "PT" (melhor cobertura
 * de podcasts portugueses), para não perder nem os grandes nomes
 * internacionais nem as produções nacionais.
 */
export async function GET(req: NextRequest) {
  const termo = (req.nextUrl.searchParams.get('termo') ?? '').trim();
  if (!termo) return NextResponse.json({ podcasts: [] });

  try {
    const [us, pt] = await Promise.allSettled([
      pesquisarCatalogo(termo, 'US'),
      pesquisarCatalogo(termo, 'PT'),
    ]);

    const vistos = new Set<number>();
    const combinados: ResultadoItunes[] = [];
    for (const resultado of [us, pt]) {
      if (resultado.status !== 'fulfilled') continue;
      for (const p of resultado.value) {
        if (vistos.has(p.collectionId)) continue;
        vistos.add(p.collectionId);
        combinados.push(p);
      }
    }

    if (us.status === 'rejected' && pt.status === 'rejected') {
      throw new Error('ambos os catálogos falharam');
    }

    const podcasts = combinados.filter((p) => p.feedUrl).slice(0, 18).map(mapear);
    return NextResponse.json({ podcasts });
  } catch {
    return NextResponse.json({ podcasts: [], erro: 'Não foi possível pesquisar podcasts agora.' });
  }
}
