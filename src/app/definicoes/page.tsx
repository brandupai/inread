import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { auth, signOut, authEnabled } from '@/auth';
import { billingEnabled, baseUrl } from '@/lib/stripe';
import { enviarEmail, emailAtivo, moldeConfirmacao } from '@/lib/email';
import { randomBytes } from 'crypto';
import DefinicoesInterativo from './DefinicoesInterativo';

export const dynamic = 'force-dynamic';

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

  const porLer = await prisma.newsletter.count({ where: { userId: user.id, isRead: false } });
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
    />
  );
}
