/** Readwise: envio de sublinhados com o token de acesso do próprio utilizador (readwise.io/access_token). */
const API = 'https://readwise.io/api/v2';

export type SublinhadoRw = { text: string; note?: string | null; title: string; author?: string | null; url?: string; quando?: Date };

export async function validarReadwise(token: string): Promise<boolean> {
  try {
    const r = await fetch(`${API}/auth/`, { headers: { Authorization: `Token ${token}` }, signal: AbortSignal.timeout(6000) });
    return r.status === 204;
  } catch {
    return false;
  }
}

/** Envia sublinhados. O Readwise ignora duplicados (mesmo texto + título + autor + url). */
export async function enviarReadwise(token: string, itens: SublinhadoRw[]): Promise<boolean> {
  if (itens.length === 0) return true;
  try {
    for (let i = 0; i < itens.length; i += 200) {
      const r = await fetch(`${API}/highlights/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          highlights: itens.slice(i, i + 200).map((h) => ({
            text: h.text.slice(0, 8000),
            title: h.title.slice(0, 500),
            author: h.author?.slice(0, 1000) || undefined,
            note: h.note?.slice(0, 8000) || undefined,
            source_type: 'inread',
            category: 'articles',
            source_url: h.url,
            highlighted_at: h.quando?.toISOString(),
          })),
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) return false;
    }
    return true;
  } catch {
    return false;
  }
}
