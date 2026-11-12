'use client';

import { useEffect, useState } from 'react';

/** Um único pedido de sessão por página, partilhado por todos os componentes
 *  (antes cada botão fazia o seu — 4 pedidos dinâmicos só na página inicial). */
let pedido: Promise<boolean> | null = null;
export function lerSessao(): Promise<boolean> {
  if (!pedido) {
    pedido = fetch('/api/auth/session', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => Boolean(d && d.user))
      .catch(() => {
        pedido = null;
        return false;
      });
  }
  return pedido;
}

/** Indica se há sessão iniciada. No servidor (e na 1.ª pintura) assume "visitante",
 *  para a página poder ser estática e servida a partir da cache. */
export function useSessao(authEnabled: boolean): boolean {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    if (!authEnabled) return;
    let vivo = true;
    lerSessao().then((v) => { if (vivo) setEntrou(v); });
    return () => { vivo = false; };
  }, [authEnabled]);
  return entrou;
}
