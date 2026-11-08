import NextAuth, { type NextAuthConfig } from 'next-auth';
import Nodemailer from 'next-auth/providers/nodemailer';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createTransport } from 'nodemailer';
import { randomInt } from 'crypto';
import { prisma } from '@/lib/db';

function magicLinkHtml(url: string, codigo: string): string {
  return `<!doctype html>
<html lang="pt">
  <body style="margin:0;padding:0;background-color:#F1F1EF;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F1EF;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background-color:#FFFFFF;border:1px solid #E2E4DF;border-radius:18px;">
            <tr>
              <td style="padding:36px 36px 28px;">
                <img src="https://inread.app/email-logo.png?v=2" width="131" height="28" alt="inread" style="display:block;border:0;outline:none;" />
                <h1 style="margin:22px 0 10px;font-size:21px;line-height:1.3;color:#1F221F;">O teu acesso está aqui</h1>
                <p style="margin:0 0 24px;font-size:14.5px;line-height:1.6;color:#3C453F;">Clica no botão para entrares na tua caixa de leitura. Válido durante 15 minutos e só funciona uma vez.</p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#09572C;border-radius:999px;">
                      <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">Entrar na minha caixa</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:26px 0 8px;font-size:13.5px;line-height:1.6;color:#3C453F;">Em alternativa, escreve este código na página de verificação:</p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="background-color:#F3F6F3;border:1px solid #E2E4DF;border-radius:12px;padding:14px;">
                      <span style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:26px;font-weight:700;letter-spacing:0.35em;color:#09572C;">${codigo}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 36px 32px;">
                <p style="margin:0;padding-top:18px;border-top:1px solid #EEEFEB;font-size:12px;line-height:1.6;color:#878A81;">Não pediste este email? Ignora-o — ninguém entra sem ele.<br>inread.app — as tuas newsletters, fora da caixa de entrada.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

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
      maxAge: 15 * 60,
      generateVerificationToken: async () => String(randomInt(100000, 1000000)),
      async sendVerificationRequest({ identifier, url, provider, token }) {
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `${token} é o teu código de acesso — inread`,
          text: `Entra na tua caixa de leitura do inread:\n\n${url}\n\nOu escreve o código ${token} na página de verificação.\n\nVálido durante 15 minutos e só funciona uma vez.\nSe não pediste este email, ignora-o.`,
          html: magicLinkHtml(url, token),
        });
        const failed = [...(result.rejected ?? []), ...(result.pending ?? [])].map(String).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email (${failed.join(', ')}) não pôde ser enviado`);
        }
      },
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // O Google verifica os emails, por isso é seguro ligar ao utilizador
      // já criado por magic link com o mesmo endereço.
      allowDangerousEmailAccountLinking: true,
    })
  );
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
    verifyRequest: '/login/verificar',
  },
  // Nota: o alias (inboxHash) deixa de ser gerado automaticamente —
  // o utilizador escolhe-o no primeiro login, em /bemvindo.
});
