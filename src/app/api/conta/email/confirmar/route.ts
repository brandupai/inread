import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { baseUrl } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** GET /api/conta/email/confirmar?token=… — confirma a troca de email de acesso. */
export async function GET(req: NextRequest) {
  const url = baseUrl();
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect(`${url}/definicoes?email=invalido`);

  const pedido = await prisma.emailChange.findUnique({ where: { token } });
  if (!pedido || pedido.expires < new Date()) {
    if (pedido) await prisma.emailChange.delete({ where: { id: pedido.id } });
    return NextResponse.redirect(`${url}/definicoes?email=expirado`);
  }

  const ocupado = await prisma.user.findFirst({
    where: { email: pedido.novoEmail, NOT: { id: pedido.userId } },
    select: { id: true },
  });
  if (ocupado) {
    await prisma.emailChange.delete({ where: { id: pedido.id } });
    return NextResponse.redirect(`${url}/definicoes?email=ocupado`);
  }

  await prisma.user.update({
    where: { id: pedido.userId },
    data: { email: pedido.novoEmail, emailVerified: new Date() },
  });
  await prisma.emailChange.deleteMany({ where: { userId: pedido.userId } });

  return NextResponse.redirect(`${url}/definicoes?email=trocado`);
}
