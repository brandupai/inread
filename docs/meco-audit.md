# Auditoria Meco (web.meco.app) — base para a nova caixa inread

> Levantamento 2026-11-04, sessão web desktop. Replicamos **layout e funcionamento** com identidade inread (verdes #4ACC5F/#0B140F, Stang, PT-PT). Desktop pensado para colapsar bem em mobile (3 colunas → 1).

## 1. Login
- `/login`: "Hello, again." + campo email + botão circular verde →; link "Sign up". (Meco não tem Google; inread mantém.)
- Animação ao submeter: seta do botão → spinner (1s linear) → crossfade título/subtítulo (150ms ease-in) → círculo verde ✓ + rodapé com stagger (+500ms).
- `/magic-link`: fundo escuro aurora+estrelas, cartão glass central, "Check your email!", círculo ✓ verde.
- Alternativa: **sign-in code** (código de 6 dígitos no mesmo email, "expira em 10 min") — A ADOTAR (resolve spam).
- Email deles: logo + texto curto + botão verde "Sign in" + código em caixa cinzenta.

## 2. Estrutura geral (desktop)
3 colunas: **sidebar nav** (com wallpaper artístico) | **lista** (~330px) | **leitor** (fundo claro).
- Topo sidebar: logo + [▣ colapsar sidebar] [🔍 pesquisa] [⚙ definições]
- Nav: Digest (badge não-lidas) / sub-grupo "Favs ✨" / Audio / Discover / Bookmarks / Senders (badge)
- ▣ colapsa a sidebar (fica só lista+leitor) — bom para mobile.
- Leitor vazio: "No newsletter selected — Select a newsletter to read".

## 3. Digest (lista)
- Header: "Digest (N unread)" + [✓ marcar tudo lido] + [🔄 atualizar]
- Filtros: dropdown período **Last 24 hrs / Last 7 days / Last 30 days / All Time** + toggle **Unread**
- Card: remetente (xs, medium) / título (base, bold, clamp 2 linhas) / "N minutes ago" (2xs, muted) / thumbnail à direita (rounded-lg). Card: rounded-xl, px-3 py-3, hover muda bg (250ms), shadow-md, entrada com fade/transform (Framer).
- Card ativo: realce esverdeado. Com filtro Unread ativo, abrir um email remove-o da lista.

## 4. Leitor
- Fundo claro (emails legíveis), largura de leitura centrada, topo: data + "Read online".
- Toolbar: [⤢ expandir] [⬆ anterior] [⬇ seguinte] [✦ Summary] [☀ aspeto] · grupo verde: [🗑 apagar] [🔖 guardar] [✓ lido] [⋯]
- ✦ Summary: popover "Save time with AI generated newsletter summaries" + Upgrade to PRO (upsell inline — nós: resumo IA no Pro).
- ☀ Aspeto: popover com **Turn on reader mode** (verde), Font (ex. Gelasio), temas do leitor (Wolf/Osprey/Rhino/Panther), tamanho A− 100% A+.
- ⋯: **Share / Reply / Add sender to group / Unsubscribe from this sender**.

## 5. Audio
- Banner: "A daily podcast, tailored to you — personalized news briefing based on your newsletters" + CTA verde "Start listening".
- Listas: Daily Tech / News / Productivity / Business & Startups Roundup.

## 6. Discover
- Chips de categorias com ícones no topo: Trending, Tech, News, Business, Productivity, Personal Growth…
- Carrosséis horizontais por categoria; cards com capa, nome, descrição curta e pill **SUBSCRIBE** (verde) ou **VISIT** (outline).

## 7. Bookmarks
- Tabs: **Newsletters | Links | Highlights** + ícone exportar no topo.
- Empty state com ilustração: "Nothing to see here… There are no saved newsletters".

## 8. Senders
- Grelha de pills (nome + ⋯ por remetente), topo: 👁 (mostrar ocultos?) + 🔍.

## 9. Search
- Rota própria `/search`, coluna de pesquisa "Search senders…" + empty state ilustrado. (Só remetentes — o inread pesquisa texto completo, manter vantagem.)

## 10. Definições (página própria, nav à esquerda)
- Secções: Meco PRO / Connected Mailboxes / Groups / Give Feedback / Preferences / Account / Help & Support / Log Out
- PRO: cartão upsell, Yearly $3.33/mo (badge 7 DAYS FREE) vs Monthly $4.99/mo, CTA "TRY 7 DAYS FOR FREE".
- Connected Mailboxes: alias principal (rosendo@mecoinbox.com) + "Add New Mailbox".
- Groups: criar grupos ("Favs ✨" é um grupo do utilizador) + seta para gerir.
- **Preferences → Notifications**: Set reminder (hora fixa) / On arrival (todas) / On arrival (selecionadas) / No notifications (selecionado = cartão vermelho ✓). → Web Push a implementar no inread (webhook já sabe o momento de chegada).
- Preferences → Appearance: Auto / Dark / Light. Wallpaper: 8 miniaturas (gradientes/paisagens) para o fundo da sidebar.
- Account: Change Email / Delete Account (vermelho). Help: FAQs, consents, Export your data, Terms, Privacy, X.

## Mapa de replicação inread (PT-PT)
- Digest→**Caixa** · Favs→**Favoritos** · Audio→**Áudio** · Discover→**Descobrir** · Bookmarks→**Guardados** (tabs Newsletters/Links/Highlights→ Edições/Ligações/Sublinhados) · Senders→**Remetentes** · Groups→**Grupos** (junta-se às etiquetas automáticas) · Reader mode→**Modo leitura** · Summary→**Resumo** (Pro) · Unread→**Por ler** · períodos: Últimas 24 h / Últimos 7 dias / Últimos 30 dias / Sempre.
