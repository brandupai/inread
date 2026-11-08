import SiteShell from '@/components/SiteShell';

export const metadata = { title: 'Blog — inread' };

const POSTS = [
  {
    slug: 'porque-construimos-o-inread',
    data: '3 de novembro de 2026',
    titulo: 'Porque construímos o inread',
    resumo: 'A caixa de entrada tornou-se um lugar de trabalho. As newsletters que escolhemos ler merecem melhor do que disputar atenção com faturas e reuniões — e do que serem lidas com um pixel a contar tudo.',
  },
];

export default function Blog() {
  return (
    <SiteShell>
      <main style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(30px, 5vw, 42px)' }}>Blog</h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          Notas sobre leitura calma, privacidade e a construção do inread.
        </p>
        {POSTS.map((p) => (
          <a key={p.slug} href={`/blog/${p.slug}`} className="glass" style={{ borderRadius: 18, padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand)' }}>{p.data}</span>
            <h2 style={{ margin: 0, fontSize: 23, color: 'var(--ink)' }}>{p.titulo}</h2>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{p.resumo}</p>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--brand-dark)' }}>Ler o artigo</span>
          </a>
        ))}
      </main>
    </SiteShell>
  );
}
