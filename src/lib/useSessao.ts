'use client';

import { useEffect, useState } from 'react';

/** Indica se há sessão iniciada. No servidor (e na 1.ª pintura) assume "visitante",
 *  para a página poder ser estática e servida a partir da cache. */
export function useSessao(authEnabled: boolean): boolean {
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
  return entrou;
}
