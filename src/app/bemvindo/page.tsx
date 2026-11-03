import { redirect } from 'next/navigation';
import { auth, authEnabled } from '@/auth';
import { prisma } from '@/lib/db';
import { ALIAS_REGEX, RESERVED_ALIASES, slugify } from '@/lib/alias';

export const dynamic = 'force-dynamic';

const ERROS: Record<string, string> = {
  invalido: 'Usa 3 a 20 caracteres: letras minúsculas, números, hífen ou underscore (começa e acaba em letra ou número).',
  ocupado: 'Esse endereço já está ocupado — experimenta outro.',
  reservado: 'Esse endereço está reservado — experimenta outro.',
};

/**
 * Primeiro login: o utilizador escolhe o seu endereço @inread.app.
 * A escolha é única (mudar depois / aliases adicionais → Pro, no roadmap).
 */
export default async function Bemvindo({ searchParams }: { searchParams: Promise<{ erro?: string; t?: string }> }) {
  const { erro, t } = await searchParams;

  if (!authEnabled) redirect('/caixa');
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/login');
  if (user.inboxHash) redirect('/caixa');

  const sugestao = t ?? slugify(user.name ?? user.email.split('@')[0]);

  async function escolher(formData: FormData) {
    'use server';
    const sessao = await auth();
    if (!sessao?.user?.id) redirect('/login');

    const alias = String(formData.get('alias') ?? '').trim().toLowerCase();

    if (!ALIAS_REGEX.test(alias)) redirect(`/bemvindo?erro=invalido&t=${encodeURIComponent(alias)}`);
    if (RESERVED_ALIASES.has(alias)) redirect(`/bemvindo?erro=reservado&t=${encodeURIComponent(alias)}`);

    const ocupado = await prisma.user.findUnique({ where: { inboxHash: alias } });
    if (ocupado && ocupado.id !== sessao.user.id) redirect(`/bemvindo?erro=ocupado&t=${encodeURIComponent(alias)}`);

    const atual = await prisma.user.findUnique({ where: { id: sessao.user.id } });
    if (!atual?.inboxHash) {
      await prisma.user.update({ where: { id: sessao.user.id }, data: { inboxHash: alias } });
    }
    redirect('/caixa');
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 460, borderRadius: 24, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 18px 50px rgba(52,78,65,0.14)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="inread" style={{ height: 26, width: 'auto', alignSelf: 'flex-start' }} />
        <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.2 }}>Escolhe o teu endereço de newsletters</h1>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          É para aqui que vais redirecionar as tuas subscrições — as newsletters chegam ao inread, nunca à tua caixa de trabalho. Escolhe com calma: para já, não dá para mudar.
        </p>
        {erro && (
          <p style={{ margin: 0, fontSize: 13, color: '#8A3B3B', background: 'rgba(217,160,160,0.25)', border: '1px solid rgba(217,160,160,0.6)', borderRadius: 10, padding: '10px 12px' }}>
            {ERROS[erro] ?? 'Não foi possível guardar. Tenta novamente.'}
          </p>
        )}
        <form action={escolher} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D9DBD4', borderRadius: 12, background: '#FFFFFF', overflow: 'hidden' }}>
            <input
              name="alias"
              type="text"
              required
              minLength={3}
              maxLength={20}
              defaultValue={sugestao}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              aria-label="O teu endereço"
              style={{ flex: '1 1 auto', minWidth: 0, height: 48, border: 'none', outline: 'none', padding: '0 4px 0 14px', fontSize: 16, fontFamily: 'inherit', color: 'var(--ink)', textAlign: 'right' }}
            />
            <span style={{ flex: '0 0 auto', padding: '0 14px 0 2px', fontSize: 16, fontWeight: 600, color: 'var(--brand)' }}>@inread.app</span>
          </div>
          <button
            type="submit"
            style={{ height: 48, border: 'none', borderRadius: 999, background: 'var(--brand-dark)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Ficar com este endereço
          </button>
        </form>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--faint)' }}>
          3–20 caracteres: letras minúsculas, números, hífen ou underscore.
        </p>
      </div>
    </main>
  );
}
