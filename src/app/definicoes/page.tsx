import type { CSSProperties } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, signOut, authEnabled } from '@/auth';
import { billingEnabled, baseUrl } from '@/lib/stripe';
import { enviarEmail, emailAtivo, moldeConfirmacao } from '@/lib/email';
import { randomBytes } from 'crypto';
import TrocarEmail from './TrocarEmail';

export const dynamic = 'force-dynamic';

function Linha({ titulo, detalhe, extra, href }: { titulo: string; detalhe?: string; extra?: string; href?: string }) {
  const conteudo = (
    <>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{titulo}</span>
        {detalhe && <span style={{ fontSize: 12.5, color: 'var(--quiet)', lineHeight: 1.5 }}>{detalhe}</span>}
      </span>
      <span style={{ flex: '0 0 auto', fontSize: 12, fontWeight: 600, color: 'var(--faint)' }}>{extra ?? (href ? '›' : '')}</span>
    </>
  );
  const estilo: CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
    borderRadius: 16, padding: '15px 18px', width: '100%', textAlign: 'left',
  };
  return href ? (
    <a href={href} className="glass" style={estilo}>{conteudo}</a>
  ) : (
    <div className="glass" style={estilo}>{conteudo}</div>
  );
}

export default async function Definicoes({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email: aviso } = await searchParams;
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

  async function sair() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  async function pedirTrocaEmail(formData: FormData) {
    'use server';
    const novo = String(formData.get('email') ?? '').trim().toLowerCase();
    if (!novo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(novo)) redirect('/definicoes?email=invalido');

    const sessao = authEnabled ? await auth() : null;
    const donoId = sessao?.user?.id ?? (await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } }))?.id;
    if (!donoId) redirect('/login');

    const dono = await prisma.user.findUnique({ where: { id: donoId } });
    if (!dono) redirect('/login');
    if (novo === dono.email.toLowerCase()) redirect('/definicoes?email=igual');

    const ocupado = await prisma.user.findFirst({ where: { email: novo, NOT: { id: donoId } }, select: { id: true } });
    if (ocupado) redirect('/definicoes?email=ocupado');
    if (!emailAtivo) redirect('/definicoes?email=semsmtp');

    const token = randomBytes(32).toString('hex');
    await prisma.emailChange.deleteMany({ where: { userId: donoId } });
    await prisma.emailChange.create({
      data: { userId: donoId, novoEmail: novo, token, expires: new Date(Date.now() + 3600_000) },
    });

    const link = `${baseUrl()}/api/conta/email/confirmar?token=${token}`;
    await enviarEmail({
      para: novo,
      assunto: 'Confirma o teu novo email — inread',
      texto: `Confirma o teu novo email de acesso ao inread:\n\n${link}\n\nO link é válido durante 1 hora. Se não pediste esta alteração, ignora este email.`,
      html: moldeConfirmacao(link, novo),
    });

    redirect('/definicoes?email=enviado');
  }

  const total = await prisma.newsletter.count({ where: { userId: user.id } });
  const lidas = await prisma.newsletter.count({ where: { userId: user.id, isRead: true } });
  const favoritas = await prisma.newsletter.count({ where: { userId: user.id, isStarred: true } });
  const highlights = await prisma.highlight.count({ where: { newsletter: { userId: user.id } } });
  const tempo = await prisma.newsletter.aggregate({
    where: { userId: user.id, isRead: true },
    _sum: { readingTime: true },
  });
  const primeira = await prisma.newsletter.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'asc' }, select: { createdAt: true } });
  const dias = primeira ? Math.max(1, Math.ceil((Date.now() - primeira.createdAt.getTime()) / 86400000)) : 1;
  const minutosTotais = tempo._sum.readingTime ?? 0;
  const mediaDiaria = Math.round(minutosTotais / dias);

  const alias = `${user.inboxHash}@inread.app`;
  const ehPro = user.plan === 'pro';

  return (
    <main style={{ minHeight: '100vh', padding: '24px 16px 64px', maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 4px 6px' }}>
        <a href="/caixa" className="glass" title="Voltar à caixa" style={{ width: 38, height: 38, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-light)', fontSize: 18 }}>
          ‹
        </a>
        <h1 style={{ margin: 0, fontSize: 26 }}>Definições</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.png" alt="" style={{ width: 30, height: 30, borderRadius: 8 }} />
      </div>

      {/* Estatísticas de leitura */}
      <div className="glass" style={{ borderRadius: 20, padding: '22px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12.5, color: 'var(--quiet)' }}>Tempo médio de leitura por dia</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, lineHeight: 1.1 }}>
          {mediaDiaria < 1 ? '< 1 min' : `${mediaDiaria} min`}
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 10, fontSize: 12.5, color: 'var(--quiet)', flexWrap: 'wrap' }}>
          <span><strong style={{ color: 'var(--ink)' }}>{lidas}</strong> lidas</span>
          <span><strong style={{ color: 'var(--ink)' }}>{favoritas}</strong> guardadas</span>
          <span><strong style={{ color: 'var(--ink)' }}>{highlights}</strong> highlights</span>
          <span><strong style={{ color: 'var(--ink)' }}>{minutosTotais}</strong> min de leitura</span>
        </div>
      </div>

      {/* Plano */}
      <Linha
        titulo={ehPro ? 'Plano Pro ✦' : 'Passar ao inread Pro'}
        detalhe={
          ehPro
            ? 'Armazenamento ilimitado, resumos IA e áudio (em rollout). Gerir pagamento, faturas ou cancelar.'
            : `€4,99/mês ou €49,99/ano — armazenamento ilimitado, resumos IA e áudio. Estás no plano Free (${total}/50 na caixa).`
        }
        extra={ehPro ? (billingEnabled ? 'Gerir ›' : '') : billingEnabled ? 'Ativar ›' : 'Brevemente'}
        href={billingEnabled ? (ehPro ? '/api/stripe/portal' : '/pro') : undefined}
      />

      {/* Conta */}
      <div style={{ padding: '10px 4px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--quiet)' }}>Conta</div>
      <Linha
        titulo="O teu user inread"
        detalhe={`${alias} — é o endereço onde recebes as newsletters. Fica contigo para sempre e não pode ser alterado.`}
        extra="fixo"
      />
      <TrocarEmail emailAtual={user.email} aviso={aviso} acao={pedirTrocaEmail} />
      <Linha
        titulo="Como adicionar newsletters"
        detalhe={`Nas páginas de subscrição das tuas newsletters favoritas, usa ${alias} em vez do teu email pessoal. Elas passam a chegar aqui, limpas — sem tocar na tua caixa de trabalho.`}
      />

      {/* Ligações */}
      <div style={{ padding: '10px 4px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--quiet)' }}>Ligações</div>
      <Linha
        titulo="Ligar Gmail / Outlook (leitura)"
        detalhe="Importa as newsletters que já recebes, com acesso apenas de leitura. Opcional — o alias continua a ser o caminho mais privado."
        extra="Brevemente"
      />
      <Linha
        titulo="Integrações: Notion · Obsidian · Zapier"
        detalhe="Exportação direta dos teus highlights. Para já, usa o Exportar .md em qualquer newsletter — Markdown limpo que o Obsidian e o Notion importam na perfeição."
        extra="Brevemente"
      />
      <Linha
        titulo="API e webhooks"
        detalhe="Acesso programático à tua caixa, mesmo nos planos baratos. Em desenho — diz-nos o que queres construir."
        extra="Brevemente"
      />

      {/* Organização */}
      <div style={{ padding: '10px 4px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--quiet)' }}>Organização</div>
      <Linha
        titulo="Etiquetas automáticas"
        detalhe="Cada newsletter recebe duas etiquetas automáticas: o formato (newsletter, vídeo, thread) e o contexto (Trabalho, Finanças, Tecnologia, Notícias, Lazer). Usa os filtros no topo da caixa."
      />
      <Linha titulo="Remetentes" detalhe="Vê todos os remetentes e cancela subscrições num clique." href="/remetentes" />

      {/* Sessão */}
      {authEnabled && (
        <form action={sair} style={{ marginTop: 10 }}>
          <button
            type="submit"
            className="glass"
            style={{ width: '100%', border: '1px solid rgba(217,160,160,0.6)', borderRadius: 16, padding: '15px 18px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: '#8A3B3B', cursor: 'pointer', textAlign: 'center', background: 'rgba(255,255,255,0.55)' }}
          >
            Terminar sessão
          </button>
        </form>
      )}

      <p style={{ margin: '14px 0 0', textAlign: 'center', fontSize: 12, color: 'var(--faint)' }}>
        inread.app · as tuas newsletters, fora da caixa de entrada
      </p>
    </main>
  );
}
