import { prisma } from './db';

const SUFFIX_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';

export const ALIAS_REGEX = /^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$/;

export const RESERVED_ALIASES = new Set([
  'admin', 'administrator', 'login', 'no-reply', 'noreply', 'suporte', 'support',
  'info', 'root', 'postmaster', 'abuse', 'contact', 'contacto', 'help', 'ajuda',
  'mail', 'email', 'www', 'inread', 'app', 'api', 'equipa', 'team', 'ola', 'hello',
]);

export function slugify(source: string): string {
  return source
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 14) || 'leitor';
}

function randomSuffix(len: number): string {
  let out = '';
  for (let i = 0; i < len; i++) out += SUFFIX_CHARS[Math.floor(Math.random() * SUFFIX_CHARS.length)];
  return out;
}

/**
 * Gera e grava um alias único (ex: "jorge_k2") para um utilizador sem inboxHash.
 * Free: alias gerado; Pro: alias personalizado (mais tarde, nas definições).
 */
export async function ensureInboxHash(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('user not found');
  if (user.inboxHash) return user.inboxHash;

  const base = slugify(user.name ?? user.email.split('@')[0]);

  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `${base}_${randomSuffix(attempt < 5 ? 2 : 4)}`;
    const taken = await prisma.user.findUnique({ where: { inboxHash: candidate } });
    if (!taken) {
      await prisma.user.update({ where: { id: userId }, data: { inboxHash: candidate } });
      return candidate;
    }
  }
  throw new Error('could not generate unique inboxHash');
}
