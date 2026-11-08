'use client';

import { useState } from 'react';

/**
 * Logo real da newsletter via /api/logo (servido pelo nosso servidor). Se falhar, cai para o bloco de cor
 * com a inicial do nome — nunca fica em branco.
 */
export default function LogoNewsletter({
  dominio,
  nome,
  cor,
  tamanho = 42,
}: {
  dominio: string;
  nome: string;
  cor: string;
  tamanho?: number;
}) {
  const [falhou, setFalhou] = useState(false);

  if (falhou) {
    return (
      <span
        style={{
          width: tamanho, height: tamanho, borderRadius: 11, background: cor, flex: '0 0 auto',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: tamanho * 0.42, fontWeight: 700, color: '#06220F',
        }}
      >
        {nome.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/logo?d=${encodeURIComponent(dominio)}`}
      alt=""
      width={tamanho}
      height={tamanho}
      onError={() => setFalhou(true)}
      style={{ width: tamanho, height: tamanho, borderRadius: 11, flex: '0 0 auto', objectFit: 'cover', background: '#fff' }}
    />
  );
}
