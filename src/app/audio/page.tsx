import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import AppShell from '@/components/AppShell';

export const dynamic = 'force-dynamic';

const RESUMOS = [
  { nome: 'Apanhado de hoje', detalhe: '4 edições · 7 min', cor: 'linear-gradient(135deg, #0A4424, #1BE03C)' },
  { nome: 'Tecnologia', detalhe: 'Semanal · 5 min', cor: 'linear-gradient(135deg, #15B832, #072E18)' },
  { nome: 'Notícias', detalhe: 'Diário · 4 min', cor: 'linear-gradient(135deg, #2ACB49, #0A4424)' },
  { nome: 'Trabalho & Produto', detalhe: 'Semanal · 6 min', cor: 'linear-gradient(135deg, #0B6B34, #1BE03C)' },
];

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
    <AppShell
      ativo="audio"
      porLer={porLer}
      titulo="Áudio"
      leitor={
        <div style={{ margin: 'auto', textAlign: 'center', padding: 32, maxWidth: 420, color: 'var(--leitor-txt-fraco)' }}>
          <div style={{ fontSize: 30, marginBottom: 10 }}>🎧</div>
          <p style={{ fontWeight: 700, color: 'var(--leitor-txt)', marginBottom: 6 }}>Um podcast diário, feito para ti</p>
          <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            O apanhado em áudio das tuas newsletters, com vozes naturais. Chega com o inread Pro — entretanto, qualquer
            edição pode ser ouvida no leitor com o botão de voz.
          </p>
        </div>
      }
    >
      {RESUMOS.map((r) => (
        <div key={r.nome} className="m-carta" style={{ alignItems: 'center' }}>
          <span style={{ width: 42, height: 42, borderRadius: 11, background: r.cor, flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#06220F' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: '1 1 auto' }}>
            <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700 }}>{r.nome}</span>
            <span className="t-app-tenue" style={{ fontSize: 11 }}>{r.detalhe}</span>
          </span>
          <span style={{ flex: '0 0 auto', fontSize: 10.5, fontWeight: 700, color: '#1BE03C', border: '1px solid rgba(27,224,60,0.45)', borderRadius: 999, padding: '4px 9px' }}>
            Brevemente
          </span>
        </div>
      ))}
      <p className="t-app-tenue" style={{ fontSize: 12, lineHeight: 1.6, padding: '6px 2px' }}>
        Diz-nos em suporte@inread.app que vozes e formatos gostavas de ouvir.
      </p>
    </AppShell>
  );
}
