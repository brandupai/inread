import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { grad, iniciais } from '@/lib/visual';
import Sublinhador from './Sublinhador';

export const dynamic = 'force-dynamic';

type ListItem = {
  id: string;
  senderName: string | null;
  senderEmail: string;
  subject: string;
  readingTime: number | null;
  isRead: boolean;
  isStarred: boolean;
  contextTag: string | null;
  format: string;
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

const FORMATOS: Record<string, string> = { newsletter: 'Newsletter', video: 'Vídeo', thread: 'Thread', artigo: 'Artigo' };

export default async function Caixa({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; f?: string; q?: string; t?: string }>;
}) {
  const { n, f, q, t } = await searchParams;
  const soFavoritos = f === 'fav';
  const soHighlights = f === 'high';
  const emGuardados = soFavoritos || soHighlights;
  const pesquisa = q?.trim() || '';
  const etiqueta = t?.trim() || '';

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

  async function apagarHighlight(formData: FormData) {
    'use server';
    const id = String(formData.get('id') ?? '');
    const voltar = String(formData.get('voltar') ?? '/caixa');
    let dono = userId;
    if (authEnabled) {
      const sessao = await auth();
      if (!sessao?.user?.id) redirect('/login');
      dono = sessao.user.id;
    }
    const h = await prisma.highlight.findFirst({ where: { id }, include: { newsletter: true } });
    if (h && h.newsletter.userId === dono) {
      await prisma.highlight.delete({ where: { id } });
    }
    redirect(voltar);
  }

  const filtroTexto = pesquisa
    ? {
        OR: [
          { subject: { contains: pesquisa } },
          { senderName: { contains: pesquisa } },
          { senderEmail: { contains: pesquisa } },
          { contentText: { contains: pesquisa } },
        ],
      }
    : {};

  const todas: ListItem[] = soHighlights
    ? []
    : await prisma.newsletter.findMany({
        where: {
          userId: user.id,
          ...(soFavoritos ? { isStarred: true } : {}),
          ...(etiqueta ? { contextTag: etiqueta } : {}),
          ...filtroTexto,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true, senderName: true, senderEmail: true, subject: true, readingTime: true,
          isRead: true, isStarred: true, contextTag: true, format: true, createdAt: true,
        },
      });

  type HighlightComOrigem = {
    id: string;
    text: string;
    newsletter: { id: string; subject: string; senderName: string | null; senderEmail: string };
  };

  const meusHighlights: HighlightComOrigem[] = soHighlights
    ? await prisma.highlight.findMany({
        where: { newsletter: { userId: user.id } },
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { newsletter: { select: { id: true, subject: true, senderName: true, senderEmail: true } } },
      })
    : [];

  const porLer = await prisma.newsletter.count({ where: { userId: user.id, isRead: false } });

  const etiquetasBrutas = await prisma.newsletter.groupBy({
    by: ['contextTag'],
    where: { userId: user.id, contextTag: { not: null } },
    _count: { contextTag: true },
  });
  const etiquetasExistentes: string[] = etiquetasBrutas
    .map((e: { contextTag: string | null }) => e.contextTag)
    .filter((x: string | null): x is string => Boolean(x));

  const selecionadaId = soHighlights ? (n ?? null) : (n ?? todas[0]?.id ?? null);
  const selected = selecionadaId
    ? await prisma.newsletter.findFirst({ where: { id: selecionadaId, userId: user.id }, include: { highlights: { orderBy: { createdAt: 'asc' } } } })
    : null;

  // Abrir uma newsletter marca-a como lida (só quando foi mesmo aberta pelo utilizador).
  if (selected && n && !selected.isRead) {
    await prisma.newsletter.update({ where: { id: selected.id }, data: { isRead: true } });
    selected.isRead = true;
  }

  const baseParams = new URLSearchParams();
  if (f) baseParams.set('f', f);
  if (pesquisa) baseParams.set('q', pesquisa);
  if (etiqueta) baseParams.set('t', etiqueta);
  const base = `/caixa${baseParams.size ? `?${baseParams}` : ''}`;
  const linkPara = (id: string) => {
    const p = new URLSearchParams(baseParams);
    p.set('n', id);
    return `/caixa?${p}`;
  };
  const linkEtiqueta = (tag: string | null) => {
    const p = new URLSearchParams();
    if (f) p.set('f', f);
    if (pesquisa) p.set('q', pesquisa);
    if (tag) p.set('t', tag);
    return `/caixa${p.size ? `?${p}` : ''}`;
  };

  const chipAtivo = (ativo: boolean) =>
    ({
      borderRadius: 999,
      padding: '7px 16px',
      fontSize: 13,
      fontWeight: 600,
      color: ativo ? '#fff' : 'var(--ink)',
      background: ativo ? 'var(--brand-dark)' : undefined,
      border: ativo ? '1px solid var(--brand-dark)' : undefined,
      whiteSpace: 'nowrap' as const,
    });

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh', paddingBottom: 110 }}>
      <aside style={{ flex: '1 1 340px', minWidth: 0, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '0 4px' }}>
          <span style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', background: 'rgba(239,243,238,0.94)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 999, padding: '6px 14px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="inread" style={{ height: 20, width: 'auto' }} />
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <form action="/caixa" style={{ display: 'flex', minWidth: 0 }}>
              {f && <input type="hidden" name="f" value={f} />}
              <input
                name="q"
                type="search"
                defaultValue={pesquisa}
                placeholder="Pesquisar…"
                aria-label="Pesquisar newsletters"
                className="glass"
                style={{ width: '100%', maxWidth: 170, height: 36, border: '1px solid rgba(255,255,255,0.85)', borderRadius: 999, padding: '0 14px', fontSize: 13, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none' }}
              />
            </form>
            <a
              href="/definicoes"
              title="Definições"
              className="glass"
              style={{ flex: '0 0 auto', width: 36, height: 36, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-light)' }}
            >
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </a>
          </div>
        </div>

        <div style={{ padding: '10px 4px 2px', display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1 }}>{emGuardados ? 'Guardados' : 'Caixa'}</h1>
          {!emGuardados && (
            <span style={{ fontSize: 13, color: 'var(--quiet)' }}>
              {pesquisa ? `${todas.length} resultado${todas.length === 1 ? '' : 's'}` : porLer > 0 ? `${porLer} por ler` : 'tudo lido'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '2px 4px 8px', overflowX: 'auto' }}>
          {emGuardados ? (
            <>
              <a href={pesquisa ? `/caixa?f=fav&q=${encodeURIComponent(pesquisa)}` : '/caixa?f=fav'} className="glass" style={chipAtivo(soFavoritos)}>Newsletters</a>
              <a href="/caixa?f=high" className="glass" style={chipAtivo(soHighlights)}>Highlights</a>
              <a href="/caixa" className="glass" style={chipAtivo(false)}>← Caixa</a>
            </>
          ) : (
            <>
              <a href={linkEtiqueta(null)} className="glass" style={chipAtivo(!etiqueta)}>Tudo</a>
              {etiquetasExistentes.map((tag) => (
                <a key={tag} href={linkEtiqueta(tag)} className="glass" style={chipAtivo(etiqueta === tag)}>
                  {tag}
                </a>
              ))}
            </>
          )}
        </div>

        {soHighlights ? (
          <>
            {meusHighlights.map((h) => (
              <a key={h.id} href={`/caixa?n=${h.newsletter.id}`} className="glass" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', borderRadius: 16 }}>
                <span style={{ fontSize: 13.5, lineHeight: 1.5, color: '#262A26' }}>
                  <mark>{h.text.length > 180 ? `${h.text.slice(0, 180)}…` : h.text}</mark>
                </span>
                <span style={{ fontSize: 11, color: 'var(--faint)' }}>
                  {h.newsletter.senderName ?? h.newsletter.senderEmail} · {h.newsletter.subject}
                </span>
              </a>
            ))}
            {meusHighlights.length === 0 && (
              <div className="glass" style={{ borderRadius: 16, padding: '18px 16px', fontSize: 14, lineHeight: 1.6, color: 'var(--quiet)' }}>
                Ainda não tens highlights. Abre uma newsletter e seleciona um trecho de texto para o sublinhares — depois exporta tudo em .md.
              </div>
            )}
          </>
        ) : (
          <>
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
                      {' · '}{FORMATOS[item.format] ?? item.format}
                      {item.contextTag ? ` · ${item.contextTag}` : ''}
                    </span>
                  </span>
                </a>
              );
            })}
            {todas.length === 0 && (
              <div className="glass" style={{ borderRadius: 16, padding: '18px 16px', fontSize: 14, lineHeight: 1.6, color: 'var(--quiet)' }}>
                {pesquisa ? (
                  <>Nenhum resultado para “{pesquisa}”.</>
                ) : soFavoritos ? (
                  <>Ainda não guardaste nenhuma newsletter. Abre uma e toca em ☆ para a guardares aqui.</>
                ) : (
                  <>
                    A tua caixa está vazia. Subscreve newsletters com o endereço{' '}
                    <strong style={{ color: 'var(--brand-light)' }}>{user.inboxHash}@inread.app</strong> e elas aparecem aqui, limpas.
                  </>
                )}
              </div>
            )}
          </>
        )}
      </aside>

      <main style={{ flex: '999 1 560px', minWidth: 0, padding: 24 }}>
        {selected ? (
          <article className="glass luz" style={{ borderRadius: 24, padding: '36px clamp(24px, 6vw, 64px) 48px', maxWidth: 860, margin: '0 auto', boxShadow: '0 30px 70px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ flex: '0 0 auto', width: 34, height: 34, borderRadius: 10, background: grad(selected.senderEmail), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                  {iniciais(selected.senderName ?? selected.senderEmail)}
                </span>
                <span style={{ fontSize: 13, color: 'var(--quiet)' }}>
                  {selected.senderName ?? selected.senderEmail} · {selected.createdAt.toLocaleDateString('pt-PT')} · {selected.readingTime ?? 1} min
                  {selected.contextTag ? ` · ${selected.contextTag}` : ''}
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
            <div id="artigo-corpo" className="artigo" dangerouslySetInnerHTML={{ __html: selected.contentHtml }} />
            <Sublinhador newsletterId={selected.id} />

            {selected.highlights.length > 0 && (
              <div style={{ marginTop: 32, borderTop: '1px solid rgba(48,73,63,0.15)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-dark)' }}>
                  ✦ Os teus highlights ({selected.highlights.length})
                </div>
                {selected.highlights.map((h: { id: string; text: string }) => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(166,214,174,0.7)', borderRadius: 12, padding: '10px 14px' }}>
                    <span style={{ flex: '1 1 auto', fontSize: 14, lineHeight: 1.6, color: '#262A26' }}>
                      <mark>{h.text}</mark>
                    </span>
                    <form action={apagarHighlight}>
                      <input type="hidden" name="id" value={h.id} />
                      <input type="hidden" name="voltar" value={linkPara(selected.id)} />
                      <button type="submit" title="Apagar highlight" style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 14, color: 'var(--faint)', cursor: 'pointer', padding: 2 }}>
                        ✕
                      </button>
                    </form>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: 'var(--faint)' }}>Incluídos no Exportar .md — prontos para Obsidian e Notion.</div>
              </div>
            )}
          </article>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 120, color: 'var(--quiet)' }}>
            <p style={{ fontWeight: 600, color: 'var(--ink)' }}>
              {soHighlights ? 'Os teus highlights' : 'Nenhuma newsletter selecionada'}
            </p>
            <p style={{ fontSize: 14 }}>
              {soHighlights ? 'Toca num highlight para abrires a newsletter de origem' : 'Seleciona uma newsletter para ler'}
            </p>
          </div>
        )}
      </main>

      {/* dock liquid glass */}
      <nav
        aria-label="Navegação principal"
        className="glass"
        style={{ position: 'fixed', left: '50%', bottom: 18, transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 10, padding: 10, borderRadius: 26, boxShadow: '0 18px 44px rgba(52,78,65,0.22)' }}
      >
        <a href="/caixa" className="gicon" title="Caixa" aria-current={!emGuardados ? 'page' : undefined} style={{ width: 52, height: 52, borderRadius: 17, color: !emGuardados ? '#fff' : 'var(--brand-dark)' }}>
          <span className={!emGuardados ? 'gi-blob gi-on' : 'gi-blob'} />
          <span className="gi-glass" style={{ background: !emGuardados ? 'rgba(48,73,63,0.28)' : undefined }} />
          <DockIcon d={ICONS.caixa} />
        </a>
        <a href="/caixa?f=fav" className="gicon" title="Guardados" aria-current={emGuardados ? 'page' : undefined} style={{ width: 52, height: 52, borderRadius: 17, color: emGuardados ? '#fff' : 'var(--brand-dark)' }}>
          <span className={emGuardados ? 'gi-blob gi-on' : 'gi-blob'} />
          <span className="gi-glass" style={{ background: emGuardados ? 'rgba(48,73,63,0.28)' : undefined }} />
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
        <a href="/remetentes" className="gicon" title="Remetentes" style={{ width: 52, height: 52, borderRadius: 17, color: 'var(--brand-dark)' }}>
          <span className="gi-blob" />
          <span className="gi-glass" />
          <DockIcon d={ICONS.remetentes} />
        </a>
      </nav>
    </div>
  );
}
