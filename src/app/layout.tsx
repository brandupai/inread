import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RegistarPWA } from '@/components/Instalar';

export const metadata: Metadata = {
  metadataBase: new URL('https://inread.app'),
  openGraph: { type: 'website', siteName: 'inread', locale: 'pt_PT', url: '/', title: 'inread — as tuas newsletters, fora da caixa de entrada', description: 'Uma box privada para as newsletters, podcasts e feeds que acompanhas — sem rastreio, com highlights que levas contigo.', images: [{ url: '/icon.png', width: 512, height: 512 }] },
  twitter: { card: 'summary', title: 'inread', description: 'As tuas newsletters, fora da caixa de entrada.' },
  title: 'inread — as tuas newsletters, fora da caixa de entrada',
  description:
    'Leitor minimalista de newsletters com alias privado @inread.app, leitura limpa e highlights exportáveis em Markdown.',
  icons: {
    icon: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
      { url: '/icon.png?v=3', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, title: 'inread', statusBarStyle: 'black' },
};

export const viewport: Viewport = {
  themeColor: '#0b140f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" data-tema="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('inread-tema');var m=(t==='light')?'light':'dark';document.documentElement.dataset.tema=m;document.documentElement.style.background=m==='light'?'#f1f0eb':'#0b140f'}catch(e){}})();",
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: "html{background:#0b140f}" }} />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="b9f0b8f7-dff6-488d-bbad-2573f5c7d837" />
        <link rel="preload" href="/fonts/Stang-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Stang-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="bg-blobs" aria-hidden="true">
          <div className="blob blobA" style={{ width: 640, height: 640, left: '50%', marginLeft: -320, top: '-16%', background: 'radial-gradient(circle at 50% 45%, rgba(21,184,50,0.5) 0%, rgba(24,100,40,0.3) 45%, rgba(11,20,15,0) 72%)' }} />
          <div className="blob blobB" style={{ width: 520, height: 520, right: '-14%', top: '24%', background: 'radial-gradient(circle at 50% 50%, rgba(27,224,60,0.22) 0%, rgba(11,20,15,0) 70%)' }} />
          <div className="blob blobC" style={{ width: 560, height: 560, left: '-16%', bottom: '-18%', background: 'radial-gradient(circle at 50% 40%, rgba(30,122,48,0.35) 0%, rgba(11,20,15,0) 70%)' }} />
        </div>
        <RegistarPWA />
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}
