import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'inread — as tuas newsletters, fora da caixa de entrada',
  description:
    'Leitor minimalista de newsletters com alias privado @inread.app, leitura limpa e highlights exportáveis em Markdown.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <div className="bg-blobs" aria-hidden="true">
          <div className="blob blobA" style={{ width: 560, height: 560, left: '-10%', top: '-8%', background: 'radial-gradient(circle at 40% 40%, #A6D6AE 0%, rgba(166,214,174,0) 70%)' }} />
          <div className="blob blobB" style={{ width: 600, height: 600, right: '-12%', top: '10%', background: 'radial-gradient(circle at 50% 50%, rgba(103,146,129,0.55) 0%, rgba(103,146,129,0) 70%)' }} />
          <div className="blob blobC" style={{ width: 680, height: 680, left: '24%', bottom: '-24%', background: 'radial-gradient(circle at 50% 40%, #CDEBD2 0%, rgba(205,235,210,0) 70%)' }} />
          <div className="blob blobD" style={{ width: 420, height: 420, left: '46%', top: '-10%', background: 'radial-gradient(circle at 50% 50%, rgba(143,191,166,0.6) 0%, rgba(143,191,166,0) 70%)' }} />
        </div>
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}
