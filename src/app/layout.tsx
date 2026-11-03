import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'inread — as tuas newsletters, fora da caixa de entrada',
  description:
    'Leitor minimalista de newsletters com alias privado @inread.app, leitura limpa e highlights exportáveis em Markdown.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
