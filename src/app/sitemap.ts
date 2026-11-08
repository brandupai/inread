import type { MetadataRoute } from 'next';
import { DOCS } from '@/lib/docs';

const BASE = 'https://inread.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ['', '/blog', '/blog/porque-construimos-o-inread', '/faq', '/ajuda', '/changelog', '/contactos', '/integracoes', '/parceiros', '/docs', '/legal/privacidade', '/legal/termos'];
  const docs = DOCS.flatMap((s) => s.paginas.map((p) => `/docs/${p.slug}`));
  return [...fixas, ...docs].map((p) => ({ url: BASE + p, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.6 }));
}
