import { redirect } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { prisma } from '@/lib/db';
import { auth, authEnabled } from '@/auth';
import AudioInterativo from './AudioInterativo';

export const dynamic = 'force-dynamic';

const MAX_ITENS_APANHADO = 6;
const MAX_CARATERES_POR_ITEM = 1400;

function textoLimpo(n: { contentText: string | null; contentHtml: string }): string {
  const bruto = n.contentText?.trim() || sanitizeHtml(n.contentHtml, { allowedTags: [], allowedAttributes: {} });
  return bruto.replace(/\s+/g, ' ').trim().slice(0, MAX_CARATERES_POR_ITEM);
}

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
  if (!userId) redirect('/login');

  const porLer = await prisma.newsletter.count({ where: { userId, isRead: false } });

  const recentes = await prisma.newsletter.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: 'desc' },
    take: MAX_ITENS_APANHADO,
    select: { id: true, subject: true, senderName: true, senderEmail: true, contentText: true, contentHtml: true },
  });

  const apanhado = recentes.map((n: (typeof recentes)[number]) => ({
    id: n.id,
    titulo: n.subject,
    remetente: n.senderName ?? n.senderEmail,
    texto: textoLimpo(n),
  }));

  const [favoritosDb, guardadosDb] = await Promise.all([
    prisma.podcastFavorito.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.episodioGuardado.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  ]);

  const favoritos = favoritosDb.map((f: (typeof favoritosDb)[number]) => ({
    feedUrl: f.feedUrl,
    nome: f.nome,
    autor: f.autor,
    imagem: f.imagem,
    ultimaDataVista: f.ultimaDataVista,
  }));

  const guardados = guardadosDb.map((g: (typeof guardadosDb)[number]) => ({
    feedUrl: g.feedUrl,
    podcastNome: g.podcastNome,
    podcastImagem: g.podcastImagem,
    titulo: g.titulo,
    audioUrl: g.audioUrl,
    duracao: g.duracao,
    dataPublicacao: g.dataPublicacao,
  }));

  return <AudioInterativo porLer={porLer} apanhado={apanhado} favoritosIniciais={favoritos} guardadosIniciais={guardados} />;
}
