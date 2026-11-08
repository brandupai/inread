import { auth, authEnabled } from '@/auth';

const INK = '#15160F';
const BORDER = 'rgba(20,21,15,0.08)';

/** Cabeçalho do site público — igual em todas as páginas (homepage, blog, FAQ, docs…). */
export default async function SiteHeader() {
  const session = authEnabled ? await auth() : null;
  const entrou = Boolean(session?.user);
  const cta = entrou ? '/caixa' : '/login';

  return (
    <header
      style={{ position: 'sticky', top: 14, zIndex: 30, width: 'calc(100% - 32px)', maxWidth: 1120, margin: '18px auto 0', padding: '12px 22px', background: 'rgba(255,255,255,0.86)', border: `1px solid ${BORDER}`, borderRadius: 999, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 18px 40px rgba(20,21,15,0.08)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
    >
      <a href="/" style={{ display: 'inline-flex' }} aria-label="inread — início">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg?v=2" alt="inread" style={{ height: 26, width: 'auto' }} />
      </a>
      <nav aria-label="Navegação" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, fontSize: 14, fontWeight: 500, color: INK }}>
        <a href="/#funcionalidades" style={{ color: INK }}>Funcionalidades</a>
        <a href="/#instalar" style={{ color: INK }}>Instalar</a>
        <a href="/#precos" style={{ color: INK }}>Preços</a>
        <a href="/blog" style={{ color: INK }}>Blog</a>
        <a href="/faq" style={{ color: INK }}>FAQ</a>
        {!entrou && <a href="/login" style={{ color: INK }}>Entrar</a>}
        <a href={cta} style={{ background: INK, color: '#fff', borderRadius: 999, padding: '9px 18px', fontWeight: 600 }}>
          {entrou ? 'A minha caixa' : 'Criar endereço grátis'}
        </a>
      </nav>
    </header>
  );
}
