/** Estado de carregamento das páginas dinâmicas: evita o ecrã em branco ao mudar de secção. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="A carregar"
      style={{ minHeight: '100dvh', background: 'var(--app-bg, #0b140f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="pr-ind vis gira" style={{ position: 'static', transform: 'none' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 11-2.64-6.36M21 3v6h-6" />
        </svg>
      </div>
    </div>
  );
}
