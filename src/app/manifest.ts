import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'inread',
    short_name: 'inread',
    description: 'A tua box de conhecimento: newsletters, podcasts e feeds, sem rastreio.',
    lang: 'pt-PT',
    start_url: '/caixa',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ece9e0',
    theme_color: '#ece9e0',
    categories: ['news', 'productivity'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Caixa', url: '/caixa', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Áudio', url: '/audio', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Descobrir', url: '/descobrir', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
    ],
  };
}
