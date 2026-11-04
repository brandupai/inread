'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/** Botão de atualizar + refresh automático (60 s e ao voltar à janela). */
export default function AutoRefresh() {
  const router = useRouter();
  const [aRodar, setARodar] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => router.refresh(), 60_000);
    const aoFocar = () => router.refresh();
    window.addEventListener('focus', aoFocar);
    document.addEventListener('visibilitychange', aoFocar);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener('focus', aoFocar);
      document.removeEventListener('visibilitychange', aoFocar);
    };
  }, [router]);

  function atualizar() {
    setARodar(true);
    router.refresh();
    setTimeout(() => setARodar(false), 900);
  }

  return (
    <button
      type="button"
      onClick={atualizar}
      title="Verificar novas newsletters"
      aria-label="Atualizar caixa"
      className="glass"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 999,
        color: 'var(--brand-light)',
        cursor: 'pointer',
        flex: '0 0 auto',
        fontFamily: 'inherit',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={aRodar ? { animation: 'girar 0.9s linear' } : undefined}
      >
        <path d="M21 12a9 9 0 11-2.64-6.36M21 3v6h-6" />
      </svg>
      <style>{`@keyframes girar{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
