'use client';

import { useState } from 'react';

/**
 * Logo da empresa remetente (via /api/logo, servido pelo nosso servidor).
 * Enquanto não carrega — ou se falhar — mostra o bloco com iniciais.
 */
export default function LogoRemetente({
  email,
  iniciais,
  fundo,
  tamanho = 42,
}: {
  email: string;
  iniciais: string;
  fundo: string;
  tamanho?: number;
}) {
  const [ok, setOk] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const dominio = email.split('@')[1] ?? '';

  return (
    <span
      style={{
        position: 'relative', flex: '0 0 auto', width: tamanho, height: tamanho, borderRadius: Math.round(tamanho * 0.27),
        background: fundo, overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: tamanho * 0.31, fontWeight: 700, color: 'rgba(255,255,255,0.95)',
      }}
    >
      {iniciais}
      {dominio && !falhou && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/logo?d=${encodeURIComponent(dominio)}`}
          alt=""
          loading="lazy"
          onLoad={() => setOk(true)}
          onError={() => setFalhou(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: tamanho * 0.16,
            background: '#fff', opacity: ok ? 1 : 0, transition: 'opacity 0.2s ease',
          }}
        />
      )}
    </span>
  );
}
