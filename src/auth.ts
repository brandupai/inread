import NextAuth, { type NextAuthConfig } from 'next-auth';
import Nodemailer from 'next-auth/providers/nodemailer';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db';
import { ensureInboxHash } from '@/lib/alias';

/**
 * Autenticação do inread: magic link (SMTP) + Google.
 * Cada provider só é ativado quando as suas variáveis de ambiente existem:
 *  - Magic link: EMAIL_SERVER (smtp://user:pass@host:porta) e EMAIL_FROM
 *  - Google:     GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
 * Sem nenhum provider configurado, a app corre em modo de desenvolvimento
 * (sem login — usa o primeiro utilizador da BD).
 */

const providers: NextAuthConfig['providers'] = [];

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google);
}

export const authEnabled = providers.length > 0;
export const magicLinkEnabled = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);
export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.AUTH_SECRET ?? 'dev-secret-sem-providers',
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        try {
          await ensureInboxHash(user.id);
        } catch (e) {
          console.error('ensureInboxHash failed', e);
        }
      }
    },
  },
});
