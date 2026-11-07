import { createTransport } from 'nodemailer';

export const emailAtivo = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);

/** Envio simples através do mesmo SMTP do login. */
export async function enviarEmail({ para, assunto, texto, html }: { para: string; assunto: string; texto: string; html: string }) {
  if (!emailAtivo) throw new Error('SMTP não configurado');
  const transport = createTransport(process.env.EMAIL_SERVER!);
  await transport.sendMail({ to: para, from: process.env.EMAIL_FROM!, subject: assunto, text: texto, html });
}

export function moldeConfirmacao(url: string, novoEmail: string): string {
  return `<!doctype html>
<html lang="pt">
  <body style="margin:0;padding:0;background-color:#F1F1EF;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F1EF;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background-color:#FFFFFF;border:1px solid #E2E4DF;border-radius:18px;">
          <tr><td style="padding:36px 36px 28px;">
            <img src="https://inread.app/email-logo.png?v=3" width="131" height="35" alt="inread" style="display:block;border:0;outline:none;" />
            <h1 style="margin:22px 0 10px;font-size:21px;line-height:1.3;color:#1F221F;">Confirma o teu novo email</h1>
            <p style="margin:0 0 24px;font-size:14.5px;line-height:1.6;color:#3C453F;">Pediste para passares a entrar no inread com <strong>${novoEmail}</strong>. Confirma que este endereço é teu — o link é válido durante 1 hora.</p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr><td style="background-color:#09572C;border-radius:999px;">
                <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">Confirmar este email</a>
              </td></tr>
            </table>
            <p style="margin:24px 0 0;font-size:12.5px;line-height:1.6;color:#878A81;">Se não pediste esta alteração, ignora este email — nada muda.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
