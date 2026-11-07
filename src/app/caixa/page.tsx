import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import { grad, iniciais, tempoRelativo } from '@/lib/visual';
import Sublinhador from './Sublinhador';
import Tipografia from './Tipografia';
import Voz from './Voz';
import AliasChip from './AliasChip';
import BotaoTema from '@/components/BotaoTema';
import PuxarAtualizar from '@/components/PuxarAtualizar';
import Expandir from './Expandir';
import SidebarNav from '@/components/SidebarNav';

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

const PERIODOS: Record<string, { rotulo: string; horas: number | null }> = {
  '24h': { rotulo: 'Últimas 24 h', horas: 24 },
  '7d': { rotulo: 'Últimos 7 dias', horas: 24 * 7 },
  '30d': { rotulo: 'Últimos 30 dias', horas: 24 * 30 },
  tudo: { rotulo: 'Sempre', horas: null },
};

function LtIcone({ d, s = 16 }: { d: string; s?: number }) {
  return (
    <svg aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default async function Caixa({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; f?: string; q?: string; t?: string; p?: string; u?: string }>;
}) {
  const { n, f, q, t, p, u } = await searchParams;
  const soFavoritos = f === 'fav';
  const soHighlights = f === 'high';
  const emGuardados = soFavoritos || soHighlights;
  const pesquisa = q?.trim() || '';
  const etiqueta = t?.trim() || '';
  const periodo = p && PERIODOS[p] ? p : 'tudo';
  const soPorLer = u === '1';

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

  async function donoAtual(): Promise<string> {
    'use server';
    if (!authEnabled) return userId;
    const sessao = await auth();
    if (!sessao?.user?.id) redirect('/login');
    return sessao.user.id;
  }

  async function alternarFavorito(formData: FormData) {
    'use server';
    const id = String(formData.get('id') ?? '');
    const dono = await donoAtual();
    const alvo = await prisma.newsletter.findFirst({ where: { id, userId: dono } });
    if (alvo) {
      await prisma.newsletter.update({ where: { id: alvo.id }, data: { isStarred: !alvo.isStarred } });
    }
    revalidatePath('/caixa');
  }

  async function alternarLido(formData: FormData) {
    'use server';
    const id = String(formData.get('id') ?? '');
    const voltar = String(formData.get('voltar') ?? '/caixa');
    const dono = await donoAtual();
    const alvo = await prisma.newsletter.findFirst({ where: { id, userId: dono } });
    if (alvo) {
      await prisma.newsletter.update({ where: { id: alvo.id }, data: { isRead: !alvo.isRead } });
    }
    redirect(voltar);
  }

  async function marcarTudoLido(formData: FormData) {
    'use server';
    const voltar = String(formData.get('voltar') ?? '/caixa');
    const dono = await donoAtual();
    await prisma.newsletter.updateMany({ where: { userId: dono, isRead: false }, data: { isRead: true } });
    redirect(voltar);
  }

  async function apagarHighlight(formData: FormData) {
    'use server';
    const id = String(formData.get('id') ?? '');
    const dono = await donoAtual();
    const h = await prisma.highlight.findFirst({ where: { id }, include: { newsletter: true } });
    if (h && h.newsletter.userId === dono) {
      await prisma.highlight.delete({ where: { id } });
    }
    revalidatePath('/caixa');
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

  const horas = PERIODOS[periodo].horas;
  const filtroPeriodo = horas ? { createdAt: { gte: new Date(Date.now() - horas * 3600_000) } } : {};

  const todas: ListItem[] = soHighlights
    ? []
    : await prisma.newsletter.findMany({
        where: {
          userId: user.id,
          ...(soFavoritos ? { isStarred: true } : {}),
          ...(soPorLer ? { isRead: false } : {}),
          ...(etiqueta ? { contextTag: etiqueta } : {}),
          ...filtroPeriodo,
          ...filtroTexto,
        },
        orderBy: { createdAt: 'desc' },
        take: 60,
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

  if (selected && n && !selected.isRead) {
    await prisma.newsletter.update({ where: { id: selected.id }, data: { isRead: true } });
    selected.isRead = true;
  }

  const baseParams = new URLSearchParams();
  if (f) baseParams.set('f', f);
  if (pesquisa) baseParams.set('q', pesquisa);
  if (etiqueta) baseParams.set('t', etiqueta);
  if (periodo !== 'tudo') baseParams.set('p', periodo);
  if (soPorLer) baseParams.set('u', '1');
  const base = `/caixa${baseParams.size ? `?${baseParams}` : ''}`;
  const linkPara = (id: string) => {
    const par = new URLSearchParams(baseParams);
    par.set('n', id);
    return `/caixa?${par}`;
  };
  const linkCom = (muda: Record<string, string | null>) => {
    const par = new URLSearchParams(baseParams);
    for (const [k, v] of Object.entries(muda)) {
      if (v === null) par.delete(k);
      else par.set(k, v);
    }
    return `/caixa${par.size ? `?${par}` : ''}`;
  };

  // anterior / seguinte na lista atual
  const idx = selected ? todas.findIndex((x) => x.id === selected.id) : -1;
  const anterior = idx > 0 ? todas[idx - 1] : null;
  const seguinte = idx >= 0 && idx < todas.length - 1 ? todas[idx + 1] : null;

  const ehPro = user.plan === 'pro';
  const linkCancelar = (() => {
    const header = (selected as { listUnsubscribe?: string | null } | null)?.listUnsubscribe;
    if (!header) return null;
    const matches = [...header.matchAll(/<([^>]+)>/g)].map((m) => m[1]);
    return matches.find((x) => x.startsWith('http')) ?? matches.find((x) => x.startsWith('mailto:')) ?? null;
  })();

  const tituloLista = soHighlights ? 'Sublinhados' : soFavoritos ? 'Guardados' : 'Caixa';
  const meuAlias = user.inboxHash ? `${user.inboxHash}@inread.app` : 'nomeapelido@inread.app';

  return (
    <div className="app3">
      <SidebarNav ativo={emGuardados ? 'guardados' : 'caixa'} porLer={porLer} />

      {/* ===== coluna da lista ===== */}
      <section className="col-lista">
        <PuxarAtualizar alvo=".col-lista" />

        <AliasChip alias={meuAlias} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 0' }}>
          <h1 className="t-app-forte lista-titulo" style={{ margin: 0, fontSize: 16, lineHeight: 1, flex: '0 0 auto' }}>{tituloLista}</h1>
          <span className="t-app-tenue" style={{ fontSize: 12, flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {pesquisa
              ? `${soHighlights ? meusHighlights.length : todas.length} resultado${(soHighlights ? meusHighlights.length : todas.length) === 1 ? '' : 's'}`
              : !emGuardados && porLer > 0
                ? `${porLer} por ler`
                : ''}
          </span>
          {pesquisa && (
            <a href={linkCom({ q: null, n: null })} className="f-chip" style={{ padding: '4px 9px', fontSize: 11.5 }}>
              “{pesquisa.length > 14 ? `${pesquisa.slice(0, 14)}…` : pesquisa}” ✕
            </a>
          )}
          {!emGuardados && porLer > 0 && (
            <form action={marcarTudoLido} style={{ display: 'inline-flex' }}>
              <input type="hidden" name="voltar" value={base} />
              <button type="submit" className="s-ico-btn" title="Marcar tudo como lido" aria-label="Marcar tudo como lido" style={{ width: 34, height: 34 }}>
                <LtIcone d="M20 6L9 17l-5-5" />
              </button>
            </form>
          )}
        </div>

        {/* filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 2px 6px', flexWrap: 'wrap' }}>
          {emGuardados ? (
            <>
              <a href="/caixa?f=fav" className={soFavoritos ? 'f-chip on' : 'f-chip'}>Edições</a>
              <a href="/caixa?f=high" className={soHighlights ? 'f-chip on' : 'f-chip'}>Sublinhados</a>
            </>
          ) : (
            <>
              <details className="ddown">
                <summary className="f-chip" style={{ gap: 7 }}>
                  <LtIcone d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" s={13} />
                  {PERIODOS[periodo].rotulo}
                  <LtIcone d="M6 9l6 6 6-6" s={12} />
                </summary>
                <div className="ddown-menu" style={{ left: 0, right: 'auto', minWidth: 180 }}>
                  {Object.entries(PERIODOS).map(([chave, def]) => (
                    <a key={chave} href={linkCom({ p: chave === 'tudo' ? null : chave, n: null })} className="ddown-item" style={chave === periodo ? { color: '#1BE03C', fontWeight: 700 } : undefined}>
                      {def.rotulo}
                    </a>
                  ))}
                </div>
              </details>
              <a href={linkCom({ u: soPorLer ? null : '1', n: null })} className={soPorLer ? 'f-chip on' : 'f-chip'}>
                <LtIcone d="M22 11.08V12a10 10 0 11-5.93-9.14" s={13} />
                Por ler
              </a>
            </>
          )}
        </div>

        {!emGuardados && etiquetasExistentes.length > 0 && (
          <div style={{ display: 'flex', gap: 7, padding: '0 2px 6px', overflowX: 'auto' }}>
            <a href={linkCom({ t: null, n: null })} className={!etiqueta ? 'f-chip on' : 'f-chip'}>Tudo</a>
            {etiquetasExistentes.map((tag) => (
              <a key={tag} href={linkCom({ t: tag, n: null })} className={etiqueta === tag ? 'f-chip on' : 'f-chip'}>
                {tag}
              </a>
            ))}
          </div>
        )}

        {/* cartões */}
        {soHighlights ? (
          <>
            {meusHighlights.map((h) => (
              <a key={h.id} href={`/caixa?n=${h.newsletter.id}`} className="m-carta" style={{ flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--app-txt)' }}>
                  “{h.text.length > 170 ? `${h.text.slice(0, 170)}…` : h.text}”
                </span>
                <span style={{ fontSize: 11, color: 'var(--app-txt-tenue)' }}>
                  {h.newsletter.senderName ?? h.newsletter.senderEmail} · {h.newsletter.subject}
                </span>
              </a>
            ))}
            {meusHighlights.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 18px', color: 'var(--app-txt-fraco)' }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>✦</div>
                <div style={{ fontWeight: 700, color: 'var(--app-txt-forte)', marginBottom: 6 }}>Ainda não há sublinhados</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>Abre uma newsletter e seleciona um trecho para o sublinhares.</div>
              </div>
            )}
          </>
        ) : (
          <>
            {todas.map((item) => {
              const nome = item.senderName ?? item.senderEmail;
              return (
                <a key={item.id} href={linkPara(item.id)} className={item.id === selected?.id ? 'm-carta on' : 'm-carta'}>
                  <span style={{ flex: '0 0 auto', width: 42, height: 42, borderRadius: 11, background: grad(item.senderEmail), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                    {iniciais(nome)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: '1 1 auto' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, color: item.isRead ? 'var(--app-txt-tenue)' : 'var(--app-txt-fraco)' }}>
                      {!item.isRead && <span style={{ width: 7, height: 7, borderRadius: 999, background: '#1BE03C', flex: '0 0 auto' }} />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nome}</span>
                      {item.isStarred && <span aria-label="Guardada" style={{ color: '#1BE03C', flex: '0 0 auto' }}>★</span>}
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: item.isRead ? 500 : 700,
                        lineHeight: 1.35,
                        color: item.isRead ? 'var(--app-txt-fraco)' : 'var(--app-txt-forte)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.subject}
                    </span>
                    <span style={{ fontSize: 10.5, color: 'var(--app-txt-tenue)' }}>
                      {tempoRelativo(item.createdAt)} · {item.readingTime ?? 1} min{item.contextTag ? ` · ${item.contextTag}` : ''}
                    </span>
                  </span>
                </a>
              );
            })}
            {todas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 18px', color: 'var(--app-txt-fraco)' }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{pesquisa ? '🔍' : soFavoritos ? '🔖' : '📭'}</div>
                <div style={{ fontWeight: 700, color: 'var(--app-txt-forte)', marginBottom: 6 }}>
                  {pesquisa ? 'Nada encontrado' : soFavoritos ? 'Nada guardado ainda' : soPorLer ? 'Tudo lido ✓' : 'Nada por aqui…'}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  {pesquisa ? (
                    <>Nenhum resultado para “{pesquisa}”.</>
                  ) : soFavoritos ? (
                    <>Abre uma newsletter e toca em 🔖 para a guardares aqui.</>
                  ) : soPorLer ? (
                    <>Não tens newsletters por ler{periodo !== 'tudo' ? ' neste período' : ''}.</>
                  ) : periodo !== 'tudo' ? (
                    <>Sem newsletters {PERIODOS[periodo].rotulo.toLowerCase()}. Experimenta alargar o período.</>
                  ) : (
                    <>
                      Subscreve newsletters com o endereço{' '}
                      <strong style={{ color: '#1BE03C' }}>{user.inboxHash}@inread.app</strong> e elas aparecem aqui, limpas.
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== coluna do leitor ===== */}
      <main className="col-leitor">
        {selected ? (
          <>
            <div className="leitor-toolbar">
              <Expandir />
              <a href={anterior ? linkPara(anterior.id) : '#'} className="lt-btn" aria-disabled={!anterior} title="Anterior" aria-label="Anterior">
                <LtIcone d="M12 19V5m-7 7l7-7 7 7" s={15} />
              </a>
              <a href={seguinte ? linkPara(seguinte.id) : '#'} className="lt-btn" aria-disabled={!seguinte} title="Seguinte" aria-label="Seguinte">
                <LtIcone d="M12 5v14m7-7l-7 7-7-7" s={15} />
              </a>
              <details className="ddown">
                <summary className="lt-btn" title="Resumo com IA" aria-label="Resumo com IA">
                  <LtIcone d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 15l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9L19 15z" s={15} />
                </summary>
                <div className="ddown-menu claro" style={{ left: 0, right: 'auto', minWidth: 250, padding: 14, gap: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#21302a' }}>✦ Resumo</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'rgba(33,48,42,0.7)' }}>
                    {ehPro
                      ? 'Resumos com IA estão quase prontos para o teu plano Pro — em rollout.'
                      : 'Poupa tempo com resumos das tuas newsletters gerados por IA.'}
                  </div>
                  {!ehPro && (
                    <a href="/pro" style={{ textAlign: 'center', background: '#1BE03C', color: '#0B140F', borderRadius: 999, padding: '9px 14px', fontSize: 13, fontWeight: 700 }}>
                      Passar ao Pro
                    </a>
                  )}
                </div>
              </details>
              <BotaoTema />
              <Tipografia />
              <Voz titulo={selected.subject} />

              <div style={{ flex: '1 1 auto' }} />

              <div className="lt-grupo">
                <form action={alternarFavorito} style={{ display: 'inline-flex' }}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="voltar" value={linkPara(selected.id)} />
                  <button type="submit" className="lt-btn" title={selected.isStarred ? 'Remover dos guardados' : 'Guardar'} aria-label={selected.isStarred ? 'Remover dos guardados' : 'Guardar'}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={selected.isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />
                    </svg>
                  </button>
                </form>
                <form action={alternarLido} style={{ display: 'inline-flex' }}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="voltar" value={selected.isRead ? base : linkPara(selected.id)} />
                  <button type="submit" className="lt-btn" title={selected.isRead ? 'Marcar como não lida' : 'Marcar como lida'} aria-label={selected.isRead ? 'Marcar como não lida' : 'Marcar como lida'}>
                    <LtIcone d={selected.isRead ? 'M3 12h18M12 3v18' : 'M20 6L9 17l-5-5'} s={15} />
                  </button>
                </form>
                <details className="ddown">
                  <summary className="lt-btn" title="Mais opções" aria-label="Mais opções">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
                  </summary>
                  <div className="ddown-menu">
                    <a href={`/api/export/${selected.id}`} className="ddown-item">
                      <LtIcone d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" s={14} /> Exportar .md
                    </a>
                    <a href={`mailto:${selected.senderEmail}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`} className="ddown-item">
                      <LtIcone d="M9 17l-5-5 5-5m-5 5h11a5 5 0 015 5v2" s={14} /> Responder
                    </a>
                    <a href={`/caixa?q=${encodeURIComponent(selected.senderEmail)}`} className="ddown-item">
                      <LtIcone d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m8-9a4 4 0 100-8 4 4 0 000 8z" s={14} /> Ver edições deste remetente
                    </a>
                    {linkCancelar && (
                      <a href={linkCancelar} target="_blank" rel="noopener noreferrer" className="ddown-item perigo">
                        <LtIcone d="M18 6L6 18M6 6l12 12" s={14} /> Cancelar subscrição
                      </a>
                    )}
                  </div>
                </details>
              </div>
            </div>

            <article className="artigo-ilha">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ flex: '0 0 auto', width: 36, height: 36, borderRadius: 10, background: grad(selected.senderEmail), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                  {iniciais(selected.senderName ?? selected.senderEmail)}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(33,48,42,0.65)' }}>
                  {selected.senderName ?? selected.senderEmail} · {selected.createdAt.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })} · {selected.readingTime ?? 1} min
                  {selected.contextTag ? ` · ${selected.contextTag}` : ''}
                </span>
              </div>
              <h1 style={{ fontSize: 30, lineHeight: 1.22, margin: '0 0 22px', color: '#141a16' }}>{selected.subject}</h1>
              <div id="artigo-corpo" className="artigo" dangerouslySetInnerHTML={{ __html: selected.contentHtml }} />
              <Sublinhador newsletterId={selected.id} assunto={selected.subject} />

              {selected.highlights.length > 0 && (
                <div style={{ marginTop: 32, borderTop: '1px solid rgba(9,87,44,0.15)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-dark)' }}>
                    ✦ Os teus sublinhados ({selected.highlights.length})
                  </div>
                  {selected.highlights.map((h: { id: string; text: string }) => (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(27,224,60,0.7)', borderRadius: 12, padding: '10px 14px' }}>
                      <span style={{ flex: '1 1 auto', fontSize: 14, lineHeight: 1.6, color: '#262A26' }}>
                        <mark>{h.text}</mark>
                      </span>
                      <form action={apagarHighlight}>
                        <input type="hidden" name="id" value={h.id} />
                        <input type="hidden" name="voltar" value={linkPara(selected.id)} />
                        <button type="submit" title="Apagar sublinhado" style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 14, color: 'rgba(33,48,42,0.45)', cursor: 'pointer', padding: 2 }}>
                          ✕
                        </button>
                      </form>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: 'rgba(33,48,42,0.5)' }}>Incluídos no Exportar .md — prontos para Obsidian e Notion.</div>
                </div>
              )}
            </article>
          </>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', padding: 32, color: 'rgba(33,48,42,0.55)' }}>
            <p style={{ fontWeight: 700, color: '#21302a', marginBottom: 6 }}>
              {soHighlights ? 'Os teus sublinhados' : 'Nenhuma newsletter selecionada'}
            </p>
            <p style={{ fontSize: 14, margin: 0 }}>
              {soHighlights ? 'Toca num sublinhado para abrires a newsletter de origem' : 'Seleciona uma newsletter para ler'}
            </p>
          </div>
        )}
      </main>

      {/* dock mobile */}
      <nav aria-label="Navegação principal" className="glass dock-mobile" style={{ position: 'fixed', left: '50%', bottom: 18, transform: 'translateX(-50%)', zIndex: 20, gap: 10, padding: 10, borderRadius: 26, boxShadow: '0 18px 44px rgba(0,0,0,0.4)' }}>
        <a href="/caixa" className="gicon" title="Caixa" aria-current={!emGuardados ? 'page' : undefined} style={{ width: 52, height: 52, borderRadius: 17, color: !emGuardados ? '#fff' : 'var(--brand-light)' }}>
          <span className={!emGuardados ? 'gi-blob gi-on' : 'gi-blob'} />
          <span className="gi-glass" style={{ background: !emGuardados ? 'rgba(9,87,44,0.28)' : undefined }} />
          <DockIcon d={ICONS.caixa} />
        </a>
        <a href="/caixa?f=fav" className="gicon" title="Guardados" aria-current={emGuardados ? 'page' : undefined} style={{ width: 52, height: 52, borderRadius: 17, color: emGuardados ? '#fff' : 'var(--brand-light)' }}>
          <span className={emGuardados ? 'gi-blob gi-on' : 'gi-blob'} />
          <span className="gi-glass" style={{ background: emGuardados ? 'rgba(9,87,44,0.28)' : undefined }} />
          <DockIcon d={ICONS.guardados} />
        </a>
        <a href="/audio" className="gicon" title="Áudio" style={{ width: 52, height: 52, borderRadius: 17, color: 'var(--brand-light)' }}>
          <span className="gi-blob" />
          <span className="gi-glass" />
          <DockIcon d={ICONS.audio} />
        </a>
        <a href="/descobrir" className="gicon" title="Descobrir" style={{ width: 52, height: 52, borderRadius: 17, color: 'var(--brand-light)' }}>
          <span className="gi-blob" />
          <span className="gi-glass" />
          <DockIcon d={ICONS.descobrir} />
        </a>
        <a href="/remetentes" className="gicon" title="Remetentes" style={{ width: 52, height: 52, borderRadius: 17, color: 'var(--brand-light)' }}>
          <span className="gi-blob" />
          <span className="gi-glass" />
          <DockIcon d={ICONS.remetentes} />
        </a>
      </nav>
    </div>
  );
}
