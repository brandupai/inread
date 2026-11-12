import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, signOut, authEnabled } from '@/auth';
import { billingEnabled, baseUrl } from '@/lib/stripe';
import { enviarEmail, emailAtivo, moldeConfirmacao } from '@/lib/email';
import { randomBytes } from 'crypto';
import DefinicoesInterativo from './DefinicoesInterativo';
import { deUser, donoAtual, gravarLigacoes, lerLigacoes, novoToken } from '@/lib/ligacoes';
import { enviarReadwise, validarReadwise } from '@/lib/readwise';
import { notionAtivo } from '@/lib/notion';

export const dynamic = 'force-dynamic';

export default async function Definicoes({ searchParams }: { searchParams: Promise<{ email?: string; c?: string; lig?: string }> }) {
  const { email: aviso, c: categoriaInicial, lig: avisoLig } = await searchParams;
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

  async function acaoFeed(formData: FormData) {
    'use server';
    const uid = await donoAtual();
    if (!uid) redirect('/login');
    const desligar = formData.get('op') === 'desligar';
    await gravarLigacoes(uid, { feedToken: desligar ? null : novoToken() });
    redirect(`/definicoes?c=ligacoes&lig=${desligar ? 'feed-off' : 'feed-ok'}`);
  }

  async function acaoReadwise(formData: FormData) {
    'use server';
    const uid = await donoAtual();
    if (!uid) redirect('/login');
    const op = String(formData.get('op') ?? '');
    if (op === 'desligar') {
      await gravarLigacoes(uid, { readwiseToken: null });
      redirect('/definicoes?c=ligacoes&lig=readwise-off');
    }
    if (op === 'ligar') {
      const token = String(formData.get('token') ?? '').trim();
      if (!token || token.length > 200 || !(await validarReadwise(token))) redirect('/definicoes?c=ligacoes&lig=readwise-invalido');
      await gravarLigacoes(uid, { readwiseToken: token });
      redirect('/definicoes?c=ligacoes&lig=readwise-ok');
    }
    // sync: envia todos os sublinhados existentes
    const { readwiseToken } = await lerLigacoes(uid);
    if (!readwiseToken) redirect('/definicoes?c=ligacoes&lig=readwise-invalido');
    const todos = await prisma.highlight.findMany({
      where: { newsletter: { userId: uid } },
      include: { newsletter: { select: { id: true, subject: true, senderName: true, senderEmail: true } } },
      orderBy: { createdAt: 'asc' },
      take: 2000,
    });
    const ok = await enviarReadwise(
      readwiseToken,
      todos.map((h: { text: string; note: string | null; createdAt: Date; newsletter: { id: string; subject: string; senderName: string | null; senderEmail: string } }) => ({
        text: h.text, note: h.note, title: h.newsletter.subject, author: h.newsletter.senderName ?? h.newsletter.senderEmail,
        url: `${baseUrl()}/caixa?n=${h.newsletter.id}`, quando: h.createdAt,
      }))
    );
    redirect(`/definicoes?c=ligacoes&lig=${ok ? 'readwise-sync' : 'readwise-falhou'}`);
  }

  async function acaoNotion(formData: FormData) {
    'use server';
    const uid = await donoAtual();
    if (!uid) redirect('/login');
    if (formData.get('op') === 'desligar') {
      await gravarLigacoes(uid, { notionToken: null, notionWorkspace: null, notionPageId: null });
      redirect('/definicoes?c=ligacoes&lig=notion-off');
    }
    redirect('/definicoes?c=ligacoes');
  }

  const lig = deUser(user);
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

  const porLer = await prisma.newsletter.count({ where: { userId: user.id, isRead: false } });
  // código de confirmação do reencaminhamento do Gmail (chega à caixa como um email normal)
  const confirmacao = await prisma.newsletter.findFirst({
    where: { userId: user.id, senderEmail: { contains: 'forwarding-noreply@google.com' }, createdAt: { gte: new Date(Date.now() - 86400_000) } },
    orderBy: { createdAt: 'desc' },
    select: { subject: true, contentText: true },
  });
  const codigoGmail = confirmacao ? (`${confirmacao.subject} ${confirmacao.contentText ?? ''}`.match(/#?\b(\d{8,10})\b/)?.[1] ?? null) : null;
  const limiteFree = Number(process.env.FREE_NEWSLETTER_LIMIT ?? 50);

  return (
    <DefinicoesInterativo
      alias={alias}
      ehPro={ehPro}
      billingEnabled={billingEnabled}
      total={total}
      limiteFree={limiteFree}
      emailAtual={user.email}
      aviso={aviso}
      pedirTrocaEmail={pedirTrocaEmail}
      lidas={lidas}
      favoritas={favoritas}
      highlights={highlights}
      minutosTotais={minutosTotais}
      mediaDiaria={mediaDiaria}
      sair={sair}
      authEnabled={authEnabled}
      porLer={porLer}
      codigoGmail={codigoGmail}
      categoriaInicial={categoriaInicial}
      ligacoes={{
        feedUrl: lig.feedToken ? `${baseUrl()}/api/feed/${lig.feedToken}` : null,
        readwiseLigado: Boolean(lig.readwiseToken),
        notionAtivo,
        notionLigado: Boolean(lig.notionToken),
        notionWorkspace: lig.notionWorkspace,
        aviso: avisoLig,
        acaoFeed,
        acaoReadwise,
        acaoNotion,
      }}
    />
  );
}
