import { notFound } from 'next/navigation';
import { paginaPorSlug, todasAsPaginas } from '@/lib/docs';

export function generateStaticParams() {
  return todasAsPaginas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pag = paginaPorSlug(slug);
  return { title: pag ? `${pag.titulo} — Documentação inread` : 'Documentação — inread' };
}

export default async function PaginaDocs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pag = paginaPorSlug(slug);
  if (!pag) notFound();

  const todas = todasAsPaginas();
  const idx = todas.findIndex((p) => p.slug === pag.slug);
  const anterior = idx > 0 ? todas[idx - 1] : null;
  const seguinte = idx < todas.length - 1 ? todas[idx + 1] : null;

  return (
    <article>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#1BE03C', marginBottom: 8 }}>{pag.seccao}</div>
      <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(26px, 4vw, 34px)', lineHeight: 1.2, color: '#F4FAF5' }}>{pag.titulo}</h1>
      <div dangerouslySetInnerHTML={{ __html: pag.html }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 13.5, fontWeight: 600 }}>
        <span>{anterior && <a href={`/docs/${anterior.slug}`} style={{ color: 'rgba(232,242,234,0.75)' }}>← {anterior.titulo}</a>}</span>
        <span>{seguinte && <a href={`/docs/${seguinte.slug}`} style={{ color: '#1BE03C' }}>{seguinte.titulo} →</a>}</span>
      </div>
    </article>
  );
}
