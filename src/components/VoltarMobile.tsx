/** Botão "voltar" — só aparece no telemóvel (< 1024px). */
export default function VoltarMobile({ href = '/caixa' }: { href?: string }) {
  return (
    <a href={href} className="btn-voltar-m" aria-label="Voltar" title="Voltar">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </a>
  );
}
