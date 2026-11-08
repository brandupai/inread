import * as webpushNs from 'web-push';
import { prisma } from '@/lib/db';

// interop CJS/ESM: o bundler pode expor a API em .default ou diretamente
const webpush = ((webpushNs as unknown as { default?: typeof webpushNs }).default ?? webpushNs) as typeof webpushNs;

let pronto: Promise<string> | null = null;

/** Garante chaves VAPID (criadas no primeiro uso e guardadas na BD) e devolve a chave pública. */
export function chavePublica(): Promise<string> {
  if (!pronto) {
    pronto = (async () => {
      let cfg = await prisma.pushConfig.findUnique({ where: { id: 'vapid' } });
      if (!cfg) {
        const k = webpush.generateVAPIDKeys();
        try {
          cfg = await prisma.pushConfig.create({ data: { id: 'vapid', publicKey: k.publicKey, privateKey: k.privateKey } });
        } catch {
          cfg = await prisma.pushConfig.findUnique({ where: { id: 'vapid' } });
        }
      }
      if (!cfg) throw new Error('vapid indisponível');
      webpush.setVapidDetails('mailto:suporte@inread.app', cfg.publicKey, cfg.privateKey);
      return cfg.publicKey;
    })().catch((e) => {
      pronto = null;
      throw e;
    });
  }
  return pronto;
}

export type PayloadPush = { titulo: string; corpo: string; url: string; tag?: string };

/** Envia uma notificação para todos os dispositivos do utilizador. Nunca lança: falhas não podem travar a ingestão. */
export async function enviarPush(userId: string, p: PayloadPush): Promise<void> {
  try {
    const subs = await prisma.pushSub.findMany({ where: { userId } });
    if (subs.length === 0) return;
    await chavePublica();
    const corpo = JSON.stringify(p);
    await Promise.all(
      subs.map(async (s: { id: string; endpoint: string; p256dh: string; auth: string }) => {
        try {
          await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, corpo, { TTL: 60 * 60 * 24, urgency: 'normal' });
        } catch (e) {
          const code = (e as { statusCode?: number }).statusCode;
          if (code === 404 || code === 410) await prisma.pushSub.delete({ where: { id: s.id } }).catch(() => {});
        }
      })
    );
  } catch {
    /* ignorado de propósito */
  }
}
