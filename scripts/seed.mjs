import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleHtml = `
<p>Durante anos aceitámos que ler uma newsletter significava atravessar popups, avisos de cookies e botões de subscrição a meio do texto. Esta semana olhamos para o movimento contrário: produtos pequenos, rápidos e construídos para quem lê de facto.</p>
<p><strong>O futuro da leitura na web não é mais uma caixa de entrada</strong> — é um lugar separado, sem pressa e sem rasto.</p>
<p>No resto da edição: três ferramentas para escrever melhor e o habitual apanhado de links para o fim de semana.</p>
`;

async function main() {
  const user = await prisma.user.upsert({
    where: { inboxHash: 'jorge_k2' },
    update: {},
    create: {
      email: 'brandup.pt@gmail.com',
      inboxHash: 'jorge_k2',
      plan: 'pro',
    },
  });

  const existing = await prisma.newsletter.count({ where: { userId: user.id } });
  if (existing > 0) {
    console.log(`Seed: utilizador ${user.inboxHash}@inread.app já tem ${existing} newsletters — nada a fazer.`);
    return;
  }

  await prisma.newsletter.create({
    data: {
      userId: user.id,
      senderName: 'Semana Tech',
      senderEmail: 'ola@semanatech.example',
      subject: 'Nº 142 — O regresso da web calma',
      contentHtml: sampleHtml.trim(),
      contentText: sampleHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      readingTime: 6,
      format: 'newsletter',
    },
  });

  console.log(`Seed ok: ${user.inboxHash}@inread.app (${user.email})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
