'use client';

import { useEffect, useState } from 'react';

const INK = '#15160F';

/** Botão de conta do cabeçalho. Renderiza o estado "visitante" no servidor (páginas estáticas, rápidas)
 *  e troca para "A minha caixa" depois de a hidratação confirmar a sessão. */
export default function HeaderConta({ authEnabled }: { authEnabled: boolean }) {
  const [entrou, setEntrou] = useState(false);

  useEffect(() => {
    if (!authEnabled) return;
    const ctl = new AbortController();
    fetch('/api/auth/session', { signal: ctl.signal, credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setEntrou(Boolean(d && d.user)))
      .catch(() => {});
    return () => ctl.abort();
  }, [authEnabled]);

  return (
    <>
      {!entrou && (
        <a href="/login" className="sh-entrar" style={{ color: INK }}>
          Entrar
        </a>
      )}
      <a href={entrou ? '/caixa' : '/login'} className="sh-cta" style={{ background: INK, color: '#fff', borderRadius: 999, padding: '9px 18px', fontWeight: 600, whiteSpace: 'nowrap' }}>
        {entrou ? 'A minha caixa' : (<><span className="sh-cta-long">Criar endereço grátis</span><span className="sh-cta-short">Começar</span></>)}
      </a>
    </>
  );
}
