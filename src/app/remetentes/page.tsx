import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { grad, iniciais } from '@/lib/visual';

export const dynamic = 'force-dynamic';

/** Extrai o melhor link do header List-Unsubscribe: https primeiro, mailto como recurso. */
function linkUnsubscribe(header: string | null): string | null {
  if (!header) return null;
  const urls = [...header.matchAll(/<([^>]+)>/g)].map((m) => m[1].trim());
  const candidatos = urls.length > 0 ? urls : [header.trim()];
  const https = candidatos.find((u) => u.startsWith('https://') || u.startsWith('http://'));
  if (https) return https;
  const mailto = candidatos.find((u) => u.startsWith('mailto:'));
  return mailto ?? null;
}

export default async function Remetentes() {
  let user = null;
  if (authEnabled) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) redirect('/login');
    if (!user.inboxHash) redirect('/bemvindo');
  } else {
    user = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  }
  if (!user) redirect('/');

  const newsletters = await prisma.newsletter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { senderEmail: true, senderName: true, isRead: true, createdAt: true, listUnsubscribe: true },
  });

  type Remetente = {
    email: string;
    nome: string;
    total: number;
    porLer: number;
    ultima: Date;
    unsubscribe: string | null;
  };

  const porRemetente = new Map<string, Remetente>();
  for (const nl of newsletters) {
    const chave = nl.senderEmail.toLowerCase();
    const atual = porRemetente.get(chave);
    if (!atual) {
      porRemetente.set(chave, {
        email: nl.senderEmail,
        nome: nl.senderName ?? nl.senderEmail,
        total: 1,
        porLer: nl.isRead ? 0 : 1,
        ultima: nl.createdAt,
        unsubscribe: linkUnsubscribe(nl.listUnsubscribe),
      });
    } else {
      atual.total += 1;
      if (!nl.isRead) atual.porLer += 1;
      if (nl.createdAt > atual.ultima) atual.ultima = nl.createdAt;
      if (!atual.unsubscribe) atual.unsubscribe = linkUnsubscribe(nl.listUnsubscribe);
    }
  }
  const remetentes = [...porRemetente.values()].sort((a, b) => b.ultima.getTime() - a.ultima.getTime());

  return (
    <main style={{ minHeight: '100vh', padding: '24px 16px 64px', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 4px 6px' }}>
        <a href="/caixa" className="glass" title="Voltar à caixa" style={{ width: 38, height: 38, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-light)', fontSize: 18 }}>
          ‹
        </a>
        <h1 style={{ margin: 0, fontSize: 26 }}>Remetentes</h1>
        <span style={{ fontSize: 12.5, color: 'var(--quiet)' }}>{remetentes.length}</span>
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: '14px 16px', fontSize: 13, lineHeight: 1.55, color: 'var(--quiet)', border: '1px solid rgba(166,214,174,0.8)' }}>
        Todas as publicações que escrevem para <strong style={{ color: 'var(--brand-light)' }}>{user.inboxHash}@inread.app</strong>.
        Quando uma deixa de interessar, cancela a subscrição num clique — sem procurar o link escondido no rodapé.
      </div>

      {remetentes.map((r) => (
        <div key={r.email} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 16 }}>
          <span style={{ flex: '0 0 auto', width: 44, height: 44, borderRadius: 13, background: grad(r.email), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.95)', boxShadow: '0 6px 14px rgba(52,78,65,0.18)' }}>
            {iniciais(r.nome)}
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: '1 1 auto' }}>
            <span style={{ fontSize: 14.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nome}</span>
            <span style={{ fontSize: 11.5, color: 'var(--faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</span>
            <span style={{ fontSize: 11.5, color: 'var(--quiet)' }}>
              {r.total} edição{r.total === 1 ? '' : 'es'}{r.porLer > 0 ? ` · ${r.porLer} por ler` : ''} · última a {r.ultima.toLocaleDateString('pt-PT')}
            </span>
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '0 0 auto', alignItems: 'flex-end' }}>
            <a
              href={`/caixa?q=${encodeURIComponent(r.email)}`}
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)', border: '1px solid rgba(48,73,63,0.3)', borderRadius: 999, padding: '6px 12px', background: 'rgba(255,255,255,0.7)' }}
            >
              Ver edições
            </a>
            {r.unsubscribe && (
              <a
                href={r.unsubscribe}
                target="_blank"
                rel="noopener noreferrer"
                title="Cancelar subscrição"
                style={{ fontSize: 12, fontWeight: 600, color: '#8A3B3B', border: '1px solid rgba(217,160,160,0.7)', borderRadius: 999, padding: '6px 12px', background: 'rgba(255,255,255,0.7)' }}
              >
                Cancelar
              </a>
            )}
          </span>
        </div>
      ))}

      {remetentes.length === 0 && (
        <div className="glass" style={{ borderRadius: 16, padding: '18px 16px', fontSize: 14, lineHeight: 1.6, color: 'var(--quiet)' }}>
          Ainda não recebeste newsletters. Subscreve com o endereço{' '}
          <strong style={{ color: 'var(--brand-light)' }}>{user.inboxHash}@inread.app</strong> e os remetentes aparecem aqui.
        </div>
      )}
    </main>
  );
}
