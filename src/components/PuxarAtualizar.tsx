'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const LIMITE = 72;

/** Puxar para atualizar (toque no telemóvel, overscroll com rato no desktop). */
export default function PuxarAtualizar({ alvo }: { alvo: string }) {
  const router = useRouter();
  const [puxo, setPuxo] = useState(0);
  const [aCarregar, setACarregar] = useState(false);
  const inicio = useRef<number | null>(null);
  const acumulado = useRef(0);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(alvo);
    if (!el) return;

    function atualizar() {
      setACarregar(true);
      setPuxo(0);
      router.refresh();
      setTimeout(() => setACarregar(false), 1100);
    }

    // No telemóvel a coluna não tem scroll próprio: vale o scroll da janela.
    const noTopo = () => {
      const proprio = el!.scrollHeight - el!.clientHeight > 8;
      return proprio ? el!.scrollTop <= 0 : window.scrollY <= 0;
    };

    function onStart(e: TouchEvent) {
      if (noTopo()) inicio.current = e.touches[0].clientY;
    }
    function onMove(e: TouchEvent) {
      if (inicio.current === null || aCarregar) return;
      const d = e.touches[0].clientY - inicio.current;
      if (d > 0 && noTopo()) {
        setPuxo(Math.min(d * 0.5, LIMITE + 20));
        if (d > 12) e.preventDefault();
      }
    }
    function onEnd() {
      if (puxo >= LIMITE) atualizar();
      else setPuxo(0);
      inicio.current = null;
    }
    function onWheel(e: WheelEvent) {
      if (aCarregar) return;
      if (noTopo() && e.deltaY < 0) {
        acumulado.current += -e.deltaY;
        setPuxo(Math.min(acumulado.current * 0.45, LIMITE + 20));
        if (acumulado.current * 0.45 >= LIMITE) {
          acumulado.current = 0;
          atualizar();
        }
        clearTimeout((onWheel as unknown as { t?: number }).t);
        (onWheel as unknown as { t?: number }).t = window.setTimeout(() => {
          acumulado.current = 0;
          setPuxo(0);
        }, 320);
      } else {
        acumulado.current = 0;
      }
    }

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('wheel', onWheel);
    };
  }, [alvo, puxo, aCarregar, router]);

  const visivel = puxo > 6 || aCarregar;

  return (
    <div
      className={`pr-ind${visivel ? ' vis' : ''}${aCarregar ? ' gira' : ''}`}
      style={{ transform: `translateX(-50%) translateY(${aCarregar ? 14 : Math.max(puxo - 26, -30)}px) rotate(${aCarregar ? 0 : puxo * 3}deg)` }}
      aria-hidden="true"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-2.64-6.36M21 3v6h-6" />
      </svg>
    </div>
  );
}
