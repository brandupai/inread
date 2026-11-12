import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { grad, iniciais } from '@/lib/visual';
import AppShell from '@/components/AppShell';
import LogoRemetente from '@/components/LogoRemetente';
import Ico from '@/components/Ico';

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

  const porLer = await prisma.newsletter.count({ where: { userId: user.id, isRead: false } });

  return (
    <AppShell
      ativo="remetentes"
      porLer={porLer}
      titulo={`Remetentes (${remetentes.length})`}
      leitor={
        <div style={{ margin: 'auto', textAlign: 'center', padding: 32, maxWidth: 430, color: 'var(--leitor-txt-fraco)' }}>
          <div style={{ marginBottom: 10 }}><Ico n="building" s={30} /></div>
          <p style={{ fontWeight: 700, color: 'var(--leitor-txt)', marginBottom: 6 }}>Quem te escreve</p>
          <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            Todas as publicações que escrevem para o teu endereço. Escolhe uma à esquerda para veres as edições, ou
            cancela a subscrição num clique — sem procurar o link escondido no rodapé.
          </p>
        </div>
      }
    >
      {remetentes.map((r) => (
        <div key={r.email} className="m-carta" style={{ alignItems: 'center' }}>
          <LogoRemetente email={r.email} iniciais={iniciais(r.nome)} fundo={grad(r.email)} />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: '1 1 auto' }}>
            <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nome}</span>
            <span className="t-app-tenue" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</span>
            <span className="t-app-tenue" style={{ fontSize: 11 }}>
              {r.total} edição{r.total === 1 ? '' : 'es'}{r.porLer > 0 ? ` · ${r.porLer} por ler` : ''}
            </span>
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: '0 0 auto', alignItems: 'flex-end' }}>
            <a href={`/caixa?q=${encodeURIComponent(r.email)}`} className="f-chip" style={{ padding: '5px 10px', fontSize: 11 }}>
              Ver edições
            </a>
            {r.unsubscribe && (
              <a href={r.unsubscribe} target="_blank" rel="noopener noreferrer" className="f-chip" style={{ padding: '5px 10px', fontSize: 11, color: '#e2574f', borderColor: 'rgba(226,87,79,0.4)' }}>
                Cancelar
              </a>
            )}
          </span>
        </div>
      ))}

      {remetentes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '44px 18px' }} className="t-app-fraco">
          <div style={{ marginBottom: 10 }}><Ico n="building" s={28} /></div>
          <div className="t-app-forte" style={{ fontWeight: 700, marginBottom: 6 }}>Ainda ninguém te escreve</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Subscreve com o endereço <strong style={{ color: '#1BE03C' }}>{user.inboxHash}@inread.app</strong> e os
            remetentes aparecem aqui.
          </div>
        </div>
      )}
    </AppShell>
  );
}
