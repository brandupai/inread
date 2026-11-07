import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'inread — as tuas newsletters, fora da caixa de entrada',
  description:
    'Leitor minimalista de newsletters com alias privado @inread.app, leitura limpa e highlights exportáveis em Markdown.',
  icons: {
    icon: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
      { url: '/icon.png?v=3', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon.png?v=3',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" data-tema="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('inread-tema');document.documentElement.dataset.tema=(t==='light'||t==='dark')?t:'dark'}catch(e){}})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" />
      </head>
      <body>
        <div className="bg-blobs" aria-hidden="true">
          <div className="blob blobA" style={{ width: 640, height: 640, left: '50%', marginLeft: -320, top: '-16%', background: 'radial-gradient(circle at 50% 45%, rgba(21,184,50,0.5) 0%, rgba(24,100,40,0.3) 45%, rgba(11,20,15,0) 72%)' }} />
          <div className="blob blobB" style={{ width: 520, height: 520, right: '-14%', top: '24%', background: 'radial-gradient(circle at 50% 50%, rgba(27,224,60,0.22) 0%, rgba(11,20,15,0) 70%)' }} />
          <div className="blob blobC" style={{ width: 560, height: 560, left: '-16%', bottom: '-18%', background: 'radial-gradient(circle at 50% 40%, rgba(30,122,48,0.35) 0%, rgba(11,20,15,0) 70%)' }} />
        </div>
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}
