import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/caixa', '/audio', '/definicoes', '/remetentes', '/admin', '/api/', '/login', '/bemvindo'] }],
    sitemap: 'https://inread.app/sitemap.xml',
  };
}
