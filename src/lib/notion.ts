/** Notion: ligação OAuth (integração pública) e criação de páginas com o artigo e os sublinhados. */
const API = 'https://api.notion.com/v1';
const VERSAO = '2022-06-28';

export const notionAtivo = Boolean(process.env.NOTION_CLIENT_ID && process.env.NOTION_CLIENT_SECRET);

export function urlAutorizar(redirect: string, state: string): string {
  const q = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID ?? '',
    response_type: 'code',
    owner: 'user',
    redirect_uri: redirect,
    state,
  });
  return `${API}/oauth/authorize?${q.toString()}`;
}

export async function trocarCodigo(code: string, redirect: string): Promise<{ token: string; workspace: string | null } | null> {
  try {
    const basic = Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64');
    const r = await fetch(`${API}/oauth/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/json', 'Notion-Version': VERSAO },
      body: JSON.stringify({ grant_type: 'authorization_code', code, redirect_uri: redirect }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const d = (await r.json()) as { access_token?: string; workspace_name?: string | null };
    return d.access_token ? { token: d.access_token, workspace: d.workspace_name ?? null } : null;
  } catch {
    return null;
  }
}

async function chamar(token: string, caminho: string, metodo: string, corpo?: unknown) {
  return fetch(`${API}${caminho}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': VERSAO },
    body: corpo ? JSON.stringify(corpo) : undefined,
    signal: AbortSignal.timeout(12000),
  });
}

/** Primeira página a que o utilizador deu acesso — é lá dentro que o inread cria as notas. */
export async function paginaMae(token: string): Promise<string | null> {
  try {
    const r = await chamar(token, '/search', 'POST', { filter: { property: 'object', value: 'page' }, page_size: 20 });
    if (!r.ok) return null;
    const d = (await r.json()) as { results?: { id: string; parent?: { type?: string } }[] };
    const res = d.results ?? [];
    return (res.find((p) => p.parent?.type === 'workspace') ?? res[0])?.id ?? null;
  } catch {
    return null;
  }
}

type Bloco = Record<string, unknown>;
const rt = (texto: string, italico = false) => [{ type: 'text', text: { content: texto.slice(0, 1900) }, annotations: italico ? { italic: true } : undefined }];
const paragrafo = (t: string, italico = false): Bloco => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: rt(t, italico) } });
const titulo2 = (t: string): Bloco => ({ object: 'block', type: 'heading_2', heading_2: { rich_text: rt(t) } });
const citacao = (t: string): Bloco => ({ object: 'block', type: 'quote', quote: { rich_text: rt(t) } });

function partir(texto: string): string[] {
  const saida: string[] = [];
  for (const p of texto.split(/\n{2,}/)) {
    let t = p.replace(/\s+\n/g, '\n').trim();
    while (t.length > 1900) {
      let corte = t.lastIndexOf(' ', 1900);
      if (corte < 800) corte = 1900;
      saida.push(t.slice(0, corte));
      t = t.slice(corte).trim();
    }
    if (t) saida.push(t);
  }
  return saida;
}

/** Cria a página no Notion. Devolve o URL da página, ou null se falhar. */
export async function criarPagina(
  token: string,
  paiId: string,
  n: { titulo: string; remetente: string; data: Date; texto: string; sublinhados: { text: string; note: string | null }[]; link: string }
): Promise<string | null> {
  const blocos: Bloco[] = [paragrafo(`${n.remetente} — ${n.data.toISOString().slice(0, 10)} · via inread (${n.link})`, true)];
  if (n.sublinhados.length) {
    blocos.push(titulo2('Sublinhados'));
    for (const h of n.sublinhados) {
      blocos.push(citacao(h.text));
      if (h.note) blocos.push(paragrafo(`Nota: ${h.note}`, true));
    }
  }
  blocos.push(titulo2('Artigo'));
  for (const p of partir(n.texto).slice(0, 380)) blocos.push(paragrafo(p));

  try {
    const r = await chamar(token, '/pages', 'POST', {
      parent: { page_id: paiId },
      properties: { title: { title: [{ type: 'text', text: { content: n.titulo.slice(0, 200) } }] } },
      children: blocos.slice(0, 100),
    });
    if (!r.ok) return null;
    const pagina = (await r.json()) as { id: string; url?: string };
    for (let i = 100; i < blocos.length; i += 100) {
      const a = await chamar(token, `/blocks/${pagina.id}/children`, 'PATCH', { children: blocos.slice(i, i + 100) });
      if (!a.ok) break; // a página já existe; o resto do artigo fica por acrescentar
    }
    return pagina.url ?? `https://www.notion.so/${pagina.id.replace(/-/g, '')}`;
  } catch {
    return null;
  }
}
