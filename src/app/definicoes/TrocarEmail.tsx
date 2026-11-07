'use client';

import { useState } from 'react';

const AVISOS: Record<string, { texto: string; cor: string }> = {
  enviado: { texto: 'Enviámos um link de confirmação para o novo endereço. A troca só acontece depois de o abrires.', cor: '#1BE03C' },
  trocado: { texto: 'Email de acesso alterado ✓', cor: '#1BE03C' },
  invalido: { texto: 'Esse endereço não parece válido.', cor: '#e2574f' },
  ocupado: { texto: 'Já existe uma conta com esse email.', cor: '#e2574f' },
  igual: { texto: 'Esse já é o teu email de acesso.', cor: '#e2574f' },
  expirado: { texto: 'O link expirou — pede uma nova confirmação.', cor: '#e2574f' },
  semsmtp: { texto: 'O envio de email está indisponível neste momento.', cor: '#e2574f' },
};

/** Linha do email de acesso, com alteração verificada por email. */
export default function TrocarEmail({
  emailAtual,
  aviso,
  acao,
}: {
  emailAtual: string;
  aviso?: string;
  acao: (formData: FormData) => void;
}) {
  const [aberto, setAberto] = useState(aviso === 'invalido' || aviso === 'ocupado' || aviso === 'igual');
  const nota = aviso ? AVISOS[aviso] : null;

  return (
    <div className="glass" style={{ borderRadius: 16, padding: '15px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>O teu email</span>
          <span style={{ fontSize: 12.5, color: 'var(--quiet)', lineHeight: 1.5 }}>
            {emailAtual} — é por aqui que entras na conta.
          </span>
        </span>
        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          style={{ flex: '0 0 auto', border: '1px solid rgba(9,87,44,0.3)', borderRadius: 999, background: 'rgba(255,255,255,0.7)', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)', padding: '6px 13px', cursor: 'pointer' }}
        >
          {aberto ? 'Cancelar' : 'Alterar'}
        </button>
      </div>

      {nota && (
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: nota.cor, fontWeight: 600 }}>{nota.texto}</div>
      )}

      {aberto && (
        <form action={acao} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            name="email"
            type="email"
            required
            placeholder="novo@email.com"
            aria-label="Novo email de acesso"
            style={{ flex: '1 1 200px', minWidth: 0, height: 42, borderRadius: 12, border: '1px solid rgba(9,87,44,0.3)', background: 'rgba(255,255,255,0.85)', padding: '0 14px', fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
          />
          <button
            type="submit"
            style={{ flex: '0 0 auto', height: 42, borderRadius: 999, border: 'none', background: 'var(--brand-dark)', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '0 18px', cursor: 'pointer' }}
          >
            Enviar confirmação
          </button>
          <span style={{ flex: '1 1 100%', fontSize: 11.5, color: 'var(--faint)', lineHeight: 1.5 }}>
            Enviamos um link para o novo endereço. O email só muda depois de o confirmares.
          </span>
        </form>
      )}
    </div>
  );
}
