'use client';

import type { CSSProperties } from 'react';
import { useSessao } from '@/lib/useSessao';

/** Botão que muda de "criar endereço" (visitante) para "abrir a minha caixa" (com sessão). */
export default function CtaSessao({ authEnabled, style }: { authEnabled: boolean; style?: CSSProperties }) {
  const entrou = useSessao(authEnabled);
  return (
    <a href={entrou ? '/caixa' : '/login'} style={style}>
      {entrou ? 'Abrir a minha caixa' : 'Criar o meu endereço grátis'}
    </a>
  );
}
