import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, signOut, authEnabled } from '@/auth';

export const dynamic = 'force-dynamic';

/** Miniatura determinística por remetente (gradiente a partir do email). */
const GRADS = [
  ['#A6D6AE', '#679281'],
  ['#BFE3C6', '#4F7D69'],
  ['#CDE8D8', '#86A98F'],
  ['#9FC6B4', '#30493F'],
  ['#D4EBD2', '#6FA183'],
  ['#B2D8C4', '#54836E'],
];

function grad(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const [a, b] = GRADS[h % GRADS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).slice(0, 2);
  return partes.map((p) => p[0]?.toUpperCase() ?? '').join('');
}

type ListItem = {
  id: string;
  senderName: string | null;
  senderEmail: string;
  subject: string;
  readingTime: number | null;
  isRead: boolean;
  isStarred: boolean;
  createdAt: Date;
};

function DockIcon({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  caixa: 'M3 8l9-5 9 5v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm0 1l9 6 9-6',
  guardados: 'M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z',
  audio: 'M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zm10-2a3 3 0 11-6 0 3 3 0 016 0z',
  descobrir: 'M12 21a9 9 0 110-18 9 9 0 010 18zm3.5-12.5L14 14l-5.5 1.5L10 10l5.5-1.5z',
  remetentes: 'M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m14-13a4 4 0 11-8 0 4 4 0 018 0zm4 13v-1a4 4 0 00-3-3.87M16 3.13A4 4 0 0116 11',
};

export default async function Caixa({ searchParams }: { searchParams: Promise<{ n?: string; f?: string }> }) {
  const { n, f } = await searchParams;
  const soFavoritos = f === 'fav';

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

  if (!user) {
    return (
      <main style={{ padding: 48, maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24 }}>inread.</h1>
        <p>
          Ainda não há utilizadores. Corre <code>npm run db:seed</code> para criar o utilizador de
          desenvolvimento e uma newsletter de exemplo.
        </p>
      </main>
    );
  }

  const userId = user.id;

  async function sair() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  async function alternarFavorito(formData: FormData) {
    'use server';
    const id = String(formData.get('id') ?? '');
    const voltar = String(formData.get('voltar') ?? '/caixa');
    let dono = userId;
    if (authEnabled) {
      const sessao = await auth();
      if (!sessao?.user?.id) redirect('/login');
      dono = sessao.user.id;
    }
    const alvo = await prisma.newsletter.findFirst({ where: { id, userId: dono } });
    if (alvo) {
      await prisma.newsletter.update({ where: { id: alvo.id }, data: { isStarred: !alvo.isStarred } });
    }
    redirect(voltar);
  }

  const todas: ListItem[] = await prisma.newsletter.findMany({
    where: { userId: user.id, ...(soFavoritos ? { isStarred: true } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, senderName: true, senderEmail: true, subject: true, readingTime: true, isRead: true, isStarred: true, createdAt: true },
  });

  const porLer = await prisma.newsletter.count({ where: { userId: user.id, isRead: false } });

  const selecionadaId = n ?? todas[0]?.id ?? null;
  const selected = selecionadaId
    ? await prisma.newsletter.findFirst({ where: { id: selecionadaId, userId: user.id } })
    : null;

  // Abrir uma newsletter marca-a como lida (só quando foi mesmo aberta pelo utilizador).
  if (selected && n && !selected.isRead) {
    await prisma.newsletter.update({ where: { id: selected.id }, data: { isRead: true } });
    selected.isRead = true;
  }

  const base = soFavoritos ? '/caixa?f=fav' : '/caixa';
  const linkPara = (id: string) => (soFavoritos ? `/caixa?f=fav&n=${id}` : `/caixa?n=${id}`);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh', paddingBottom: 110 }}>
      <aside style={{ flex: '1 1 340px', minWidth: 0, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '0 4px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="inread" style={{ height: 22, width: 'auto' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--quiet)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.inboxHash}@inread.app{user.plan === 'free' ? ` · ${todas.length}/50` : ''}
            </span>
            {authEnabled && (
              <form action={sair}>
                <button type="submit" style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--quiet)', cursor: 'pointer', padding: 0 }}>
                  Sair
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{ padding: '10px 4px 2px', display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1 }}>{soFavoritos ? 'Guardados' : 'Caixa'}</h1>
          {!soFavoritos && (
            <span style={{ fontSize: 13, color: 'var(--quiet)' }}>
              {porLer > 0 ? `${porLer} por ler` : 'tudo lido'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '2px 4px 8px' }}>
          <a
            href="/caixa"
            className="glass"
            style={{ borderRadius: 999, padding: '7px 16px', fontSize: 13, fontWeight: 600, color: !soFavoritos ? '#fff' : 'var(--ink)', background: !soFavoritos ? 'var(--brand-dark)' : undefined, border: !soFavoritos ? '1px solid var(--brand-dark)' : undefined }}
          >
            Tudo
          </a>
          <a
            href="/caixa?f=fav"
            className="glass"
            style={{ borderRadius: 999, padding: '7px 16px', fontSize: 13, fontWeight: 600, color: soFavoritos ? '#fff' : 'var(--ink)', background: soFavoritos ? 'var(--brand-dark)' : undefined, border: soFavoritos ? '1px solid var(--brand-dark)' : undefined }}
          >
            Favoritos
          </a>
        </div>

        {todas.map((item) => {
          const nome = item.senderName ?? item.senderEmail;
          return (
            <a
              key={item.id}
              href={linkPara(item.id)}
              className="glass"
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 16,
                border: item.id === selected?.id ? '1.5px solid var(--brand)' : undefined,
              }}
            >
              <span style={{ flex: '0 0 auto', width: 44, height: 44, borderRadius: 13, background: grad(item.senderEmail), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.95)', boxShadow: '0 6px 14px rgba(52,78,65,0.18)' }}>
                {iniciais(nome)}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: '1 1 auto' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, color: item.isRead ? 'var(--faint)' : 'var(--quiet)' }}>
                  {!item.isRead && <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--brand)', flex: '0 0 auto' }} />}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nome}</span>
                  {item.isStarred && <span aria-label="Favorito" style={{ color: 'var(--brand)', flex: '0 0 auto' }}>★</span>}
                </span>
                <span style={{ fontSize: 14, fontWeight: item.isRead ? 500 : 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subject}</span>
                <span style={{ fontSize: 11, color: 'var(--faint)' }}>
                  {item.createdAt.toLocaleDateString('pt-PT')} · {item.readingTime ?? 1} min
                </span>
              </span>
            </a>
          );
        })}

        {todas.length === 0 && !soFavoritos && (
          <div className="glass" style={{ borderRadius: 16, padding: '18px 16px', fontSize: 14, lineHeight: 1.6, color: 'var(--quiet)' }}>
            A tua caixa está vazia. Subscreve newsletters com o endereço{' '}
            <strong style={{ color: 'var(--brand-dark)' }}>{user.inboxHash}@inread.app</strong> e elas aparecem aqui, limpas.
          </div>
        )}
        {todas.length === 0 && soFavoritos && (
          <div className="glass" style={{ borderRadius: 16, padding: '18px 16px', fontSize: 14, lineHeight: 1.6, color: 'var(--quiet)' }}>
            Ainda não guardaste nenhuma newsletter. Abre uma e toca em ☆ para a guardares aqui.
          </div>
        )}
      </aside>

      <main style={{ flex: '999 1 560px', minWidth: 0, padding: 24 }}>
        {selected ? (
          <article className="glass" style={{ borderRadius: 24, padding: '36px clamp(24px, 6vw, 64px) 48px', maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ flex: '0 0 auto', width: 34, height: 34, borderRadius: 10, background: grad(selected.senderEmail), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                  {iniciais(selected.senderName ?? selected.senderEmail)}
                </span>
                <span style={{ fontSize: 13, color: 'var(--quiet)' }}>
                  {selected.senderName ?? selected.senderEmail} · {selected.createdAt.toLocaleDateString('pt-PT')} · {selected.readingTime ?? 1} min
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <form action={alternarFavorito}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="voltar" value={linkPara(selected.id)} />
                  <button
                    type="submit"
                    title={selected.isStarred ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
                    style={{ height: 36, border: '1px solid rgba(48,73,63,0.3)', borderRadius: 999, background: selected.isStarred ? 'var(--highlight)' : 'rgba(255,255,255,0.75)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--brand-dark)', cursor: 'pointer', padding: '0 14px' }}
                  >
                    {selected.isStarred ? '★ Guardada' : '☆ Guardar'}
                  </button>
                </form>
                <a
                  href={`/api/export/${selected.id}`}
                  style={{ background: 'var(--brand-dark)', color: '#fff', borderRadius: 999, padding: '9px 16px', fontSize: 13, fontWeight: 600 }}
                >
                  Exportar .md
                </a>
              </div>
            </div>
            <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: '0 0 20px' }}>{selected.subject}</h1>
            <div className="artigo" dangerouslySetInnerHTML={{ __html: selected.contentHtml }} />
          </article>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 120, color: 'var(--quiet)' }}>
            <p style={{ fontWeight: 600, color: 'var(--ink)' }}>Nenhuma newsletter selecionada</p>
            <p style={{ fontSize: 14 }}>Seleciona uma newsletter para ler</p>
          </div>
        )}
      </main>

      {/* dock liquid glass */}
      <nav
        aria-label="Navegação principal"
        className="glass"
        style={{ position: 'fixed', left: '50%', bottom: 18, transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 10, padding: 10, borderRadius: 26, boxShadow: '0 18px 44px rgba(52,78,65,0.22)' }}
      >
        <a href="/caixa" className="gicon" title="Caixa" aria-current={!soFavoritos ? 'page' : undefined} style={{ width: 52, height: 52, borderRadius: 17, color: !soFavoritos ? '#fff' : 'var(--brand-dark)' }}>
          <span className={!soFavoritos ? 'gi-blob gi-on' : 'gi-blob'} />
          <span className="gi-glass" style={{ background: !soFavoritos ? 'rgba(48,73,63,0.28)' : undefined }} />
          <DockIcon d={ICONS.caixa} />
        </a>
        <a href="/caixa?f=fav" className="gicon" title="Guardados" aria-current={soFavoritos ? 'page' : undefined} style={{ width: 52, height: 52, borderRadius: 17, color: soFavoritos ? '#fff' : 'var(--brand-dark)' }}>
          <span className={soFavoritos ? 'gi-blob gi-on' : 'gi-blob'} />
          <span className="gi-glass" style={{ background: soFavoritos ? 'rgba(48,73,63,0.28)' : undefined }} />
          <DockIcon d={ICONS.guardados} />
        </a>
        <span className="gicon" title="Áudio — brevemente" style={{ width: 52, height: 52, borderRadius: 17, color: 'var(--brand-dark)', opacity: 0.45 }}>
          <span className="gi-blob" />
          <span className="gi-glass" />
          <DockIcon d={ICONS.audio} />
        </span>
        <span className="gicon" title="Descobrir — brevemente" style={{ width: 52, height: 52, borderRadius: 17, color: 'var(--brand-dark)', opacity: 0.45 }}>
          <span className="gi-blob" />
          <span className="gi-glass" />
          <DockIcon d={ICONS.descobrir} />
        </span>
        <span className="gicon" title="Remetentes — brevemente" style={{ width: 52, height: 52, borderRadius: 17, color: 'var(--brand-dark)', opacity: 0.45 }}>
          <span className="gi-blob" />
          <span className="gi-glass" />
          <DockIcon d={ICONS.remetentes} />
        </span>
      </nav>
    </div>
  );
}
