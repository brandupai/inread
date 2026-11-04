import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import SidebarNav from '@/components/SidebarNav';

export const dynamic = 'force-dynamic';

const CATS = ['Em alta', 'Tecnologia', 'Notícias', 'Negócios', 'Produtividade', 'Cultura'];

export default async function Descobrir() {
  let userId: string | null = null;
  if (authEnabled) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');
    userId = session.user.id;
  } else {
    const u = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
    userId = u?.id ?? null;
  }
  const porLer = userId ? await prisma.newsletter.count({ where: { userId, isRead: false } }) : 0;

  return (
    <div className="app3">
      <SidebarNav ativo="descobrir" porLer={porLer} />
      <main style={{ flex: '1 1 0', minWidth: 0, padding: '22px 22px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, color: '#F4FAF5' }}>Descobrir</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATS.map((c, i) => (
            <span key={c} className={i === 0 ? 'f-chip on' : 'f-chip'}>{c}</span>
          ))}
        </div>
        <div style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '28px 22px', maxWidth: 720, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🧭</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F4FAF5', marginBottom: 6 }}>O diretório de newsletters está a ser construído</div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(232,242,234,0.6)', maxWidth: 480, margin: '0 auto' }}>
            Em breve vais poder explorar e subscrever newsletters por categoria com um clique, diretamente para o teu endereço @inread.app. És autor? Submete a tua em{' '}
            <a href="/parceiros" style={{ color: '#4ACC5F', fontWeight: 600 }}>inread.app/parceiros</a>.
          </div>
        </div>
      </main>
    </div>
  );
}
