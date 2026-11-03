import sanitizeHtml from 'sanitize-html';

/**
 * Motor de limpeza do inread: HTML de email -> HTML limpo de leitura.
 * Remove scripts, estilos perigosos, pixels de rastreio (1x1), iframes,
 * formulários e botões de subscrição redundantes — mantendo 100% do texto
 * e das imagens reais. Este motor é o diferencial do produto: iterar aqui.
 */

const TRACKER_HOST_PATTERNS = [
  /list-manage\.com\/track/i,
  /open\.substack\.com\/track/i,
  /email\.mailgun/i,
  /sendgrid\.net\/wf\/open/i,
  /beacon|pixel|tracking|\/open\?/i,
];

const SUBSCRIBE_TEXT = /\b(subscribe now|subscribe here|sign up now|view in browser|ver no browser|abrir no browser)\b/i;

export function cleanEmailHtml(rawHtml: string): string {
  return sanitizeHtml(rawHtml, {
    allowedTags: [
      'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code', 'div', 'em',
      'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
      'img', 'li', 'ol', 'p', 'pre', 'q', 's', 'small', 'span', 'strong',
      'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul',
    ],
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt', 'width', 'height'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    exclusiveFilter(frame) {
      // Pixels de rastreio: imagens 1x1/2x2 ou com URLs de tracking conhecidos
      if (frame.tag === 'img') {
        const w = parseInt(frame.attribs.width ?? '', 10);
        const h = parseInt(frame.attribs.height ?? '', 10);
        if ((w > 0 && w <= 2) || (h > 0 && h <= 2)) return true;
        const src = frame.attribs.src ?? '';
        if (TRACKER_HOST_PATTERNS.some((re) => re.test(src))) return true;
      }
      // Botões/avisos redundantes ("Subscribe now", "View in browser")
      if ((frame.tag === 'a' || frame.tag === 'p') && SUBSCRIBE_TEXT.test(frame.text ?? '')) {
        return true;
      }
      return false;
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Retira parâmetros de tracking dos links (utm_*, mc_cid, etc.)
        try {
          const url = new URL(attribs.href ?? '');
          for (const key of [...url.searchParams.keys()]) {
            if (/^(utm_|mc_|fbclid|gclid|ref)/i.test(key)) url.searchParams.delete(key);
          }
          return { tagName, attribs: { ...attribs, href: url.toString(), rel: 'noopener noreferrer', target: '_blank' } };
        } catch {
          return { tagName, attribs };
        }
      },
    },
  });
}

/**
 * Etiqueta automática de contexto (a 2.ª etiqueta do par formato+contexto).
 * Heurística por palavras-chave no remetente, assunto e texto.
 */
const CONTEXT_RULES: Array<{ tag: string; re: RegExp }> = [
  { tag: 'Finanças', re: /\b(invest|finan[çc]|mercados?|bolsa|crypto|bitcoin|stocks?|etf|juros|economia|banco)\b/i },
  { tag: 'Tecnologia', re: /\b(ai|ia|tech|software|dev|programa[çc][ãa]o|startup|saas|produto|code|coding|llm|robot)\b/i },
  { tag: 'Trabalho', re: /\b(marketing|vendas|sales|neg[óo]cio|business|carreira|lideran[çc]a|gest[ãa]o|produtividade|empreend)\b/i },
  { tag: 'Notícias', re: /\b(news|not[íi]cias|daily|di[áa]ri[oa]|semanal|weekly|briefing|roundup|digest)\b/i },
  { tag: 'Lazer', re: /\b(viagem|travel|receita|cozinha|desporto|m[úu]sica|cinema|s[ée]ries?|jogos|gaming|lifestyle|cultura)\b/i },
];

export function detectContext(senderEmail: string, senderName: string | null, subject: string, text: string): string | null {
  const alvo = `${senderName ?? ''} ${senderEmail} ${subject} ${text.slice(0, 1200)}`;
  for (const { tag, re } of CONTEXT_RULES) {
    if (re.test(alvo)) return tag;
  }
  return null;
}

export function detectFormat(subject: string, html: string): string {
  if (/youtube\.com|youtu\.be|v[ií]deo/i.test(html)) return 'video';
  if (/twitter\.com|x\.com\/\w+\/status|thread/i.test(subject + html)) return 'thread';
  return 'newsletter';
}

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function htmlToPlainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
}
