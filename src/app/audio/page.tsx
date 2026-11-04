import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import SidebarNav from '@/components/SidebarNav';

export const dynamic = 'force-dynamic';

export default async function Audio() {
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
      <SidebarNav ativo="audio" porLer={porLer} />
      <main style={{ flex: '1 1 0', minWidth: 0, padding: '22px 22px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, color: '#F4FAF5' }}>Áudio</h1>
        <div style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', maxWidth: 720 }}>
          <span style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #143D20, #4ACC5F)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0B140F', flex: '0 0 auto' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zm10-2a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </span>
          <span style={{ flex: '1 1 260px', minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#F4FAF5' }}>Um podcast diário, feito para ti</span>
            <span style={{ display: 'block', fontSize: 13, color: 'rgba(232,242,234,0.6)', marginTop: 3 }}>
              O apanhado em áudio das tuas newsletters do dia — a chegar com o inread Pro.
            </span>
          </span>
          <span style={{ flex: '0 0 auto', fontSize: 12.5, fontWeight: 700, color: '#0B140F', background: '#4ACC5F', borderRadius: 999, padding: '8px 16px' }}>Brevemente</span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(232,242,234,0.45)', maxWidth: 720, lineHeight: 1.6 }}>
          Resumos diários por tema (Tecnologia, Notícias, Produtividade, Negócios) gerados a partir do que chega à tua caixa. Diz-nos em suporte@inread.app que vozes e formatos gostavas de ouvir.
        </div>
      </main>
    </div>
  );
}
