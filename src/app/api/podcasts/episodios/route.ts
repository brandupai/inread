import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Extrai o conteúdo de uma tag (com ou sem CDATA), sem precisar de dependências de XML. */
function extrairTag(bloco: string, tag: string): string | null {
  const m = bloco.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!m) return null;
  return m[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').trim();
}

function extrairAtributo(bloco: string, tag: string, atributo: string): string | null {
  const m = bloco.match(new RegExp(`<${tag}[^>]*${atributo}=["']([^"']+)["'][^>]*/?>`, 'i'));
  return m ? m[1] : null;
}

/**
 * Lê o RSS público de um podcast (o mesmo feed que qualquer app de podcasts
 * usa — Apple, Spotify, Overcast, etc.) e devolve os últimos episódios com o
 * link direto do áudio (enclosure), sem dependências nem custo.
 */
export async function GET(req: NextRequest) {
  const feed = req.nextUrl.searchParams.get('feed');
  if (!feed) return NextResponse.json({ episodios: [], erro: 'feed em falta' }, { status: 400 });

  try {
    const r = await fetch(feed, { next: { revalidate: 1800 } });
    if (!r.ok) throw new Error(`feed respondeu ${r.status}`);
    const xml = await r.text();

    const capa = extrairAtributo(xml, 'itunes:image', 'href');

    const itens = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
    const episodios = itens
      .slice(0, 15)
      .map((bloco) => {
        const titulo = extrairTag(bloco, 'title') ?? 'Sem título';
        const descricaoBruta = extrairTag(bloco, 'itunes:summary') ?? extrairTag(bloco, 'description') ?? '';
        const descricao = descricaoBruta.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240);
        const audioUrl = extrairAtributo(bloco, 'enclosure', 'url');
        const duracao = extrairTag(bloco, 'itunes:duration');
        const dataPublicacao = extrairTag(bloco, 'pubDate');
        return { titulo, descricao, audioUrl, duracao, dataPublicacao };
      })
      .filter((e): e is typeof e & { audioUrl: string } => Boolean(e.audioUrl));

    return NextResponse.json({ episodios, capa });
  } catch {
    return NextResponse.json({ episodios: [], erro: 'Não foi possível carregar os episódios deste podcast.' });
  }
}
