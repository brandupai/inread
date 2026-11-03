# inread.app

Leitor minimalista de newsletters. Alias privado `nome@inread.app`, leitura limpa (sem scripts, popups nem pixels de rastreio) e highlights exportáveis em Markdown.

Stack: **Next.js 15 · Prisma · MySQL/MariaDB** — pensado para o Hostinger Cloud (hPanel, sem Docker) e migração futura para PostgreSQL.

## Correr localmente

```bash
npm install
cp .env.example .env        # preenche DATABASE_URL e INBOUND_WEBHOOK_SECRET
npm run db:push             # cria as tabelas
npm run db:seed             # utilizador dev (jorge_k2@inread.app) + 1 newsletter
npm run dev                 # http://localhost:3000
```

## Estrutura

| Caminho | O que faz |
| --- | --- |
| `prisma/schema.prisma` | User, Newsletter, Highlight, Tag (etiquetas duplas: `kind` format/context) |
| `src/app/api/webhooks/inbound` | Ingestão: recebe o JSON do router de email, limpa e grava (quota FIFO no Free) |
| `src/lib/clean.ts` | **O motor de parsing** — HTML de email → leitura limpa. Iterar aqui. |
| `src/app/caixa` | Caixa de leitura (lista + leitor) |
| `src/app/api/export/[id]` | Exportação da newsletter + highlights em Markdown |

## Deploy no Hostinger (resumo)

1. hPanel → criar website Node.js para `inread.app` (ou pedir ao Claude).
2. hPanel → Bases de Dados → criar BD MySQL `inread` + utilizador.
3. Variáveis de ambiente da app: `DATABASE_URL` (host `127.0.0.1`), `INBOUND_WEBHOOK_SECRET`, `FREE_NEWSLETTER_LIMIT`.
4. Ligar o GitHub no hPanel e apontar para este repositório (branch `main`) — cada push faz deploy.
5. Depois do 1.º deploy: `npx prisma db push` (via SSH do hPanel) para criar as tabelas.

## Ingestão de email (Cloudflare Email Routing)

Os MX de `inread.app` apontam para o Cloudflare; um Email Worker converte o email em JSON e faz POST para `https://inread.app/api/webhooks/inbound` com o header `x-inread-secret`.

Worker mínimo (Cloudflare → Email Workers):

```js
export default {
  async email(message, env) {
    const raw = await new Response(message.raw).text();
    await fetch('https://inread.app/api/webhooks/inbound', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-inread-secret': env.INREAD_SECRET },
      body: JSON.stringify({
        to: message.to,
        from: message.from,
        fromName: message.headers.get('from'),
        subject: message.headers.get('subject'),
        html: raw, // MVP: parse de MIME no servidor; evoluir com postal-mime no worker
      }),
    });
  },
};
```

> Nota: em produção usa [postal-mime](https://github.com/postalsys/postal-mime) no worker para extrair `html`/`text` do MIME antes do POST.

## Roadmap curto

- [ ] Auth.js: magic link + Google (+ Apple na fase das apps)
- [ ] Highlights no leitor (seleção → guardar)
- [ ] Etiquetas duplas (formato automático + contexto)
- [ ] Resumos IA (Pro) · digest semanal
- [ ] API pública + webhooks (argumento PKM vs Readwise)
- [ ] Apps: Tauri (Mac/Windows) e Capacitor (iOS/Android) sobre esta base
