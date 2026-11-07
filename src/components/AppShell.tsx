import type { ReactNode } from 'react';
import SidebarNav from './SidebarNav';

/** Shell de 3 colunas: menu (A) · lista (B) · leitor (C). */
export default function AppShell({
  ativo,
  porLer,
  titulo,
  acima,
  children,
  leitor,
}: {
  ativo: string;
  porLer: number;
  titulo: string;
  acima?: ReactNode;
  children: ReactNode;
  leitor?: ReactNode;
}) {
  return (
    <div className="app3">
      <SidebarNav ativo={ativo} porLer={porLer} />

      <section className="col-lista">
        {acima}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 4px' }}>
          <h1 className="t-app-forte" style={{ margin: 0, fontSize: 16, lineHeight: 1 }}>{titulo}</h1>
        </div>
        {children}
      </section>

      <main className="col-leitor">
        {leitor ?? (
          <div style={{ margin: 'auto', textAlign: 'center', padding: 32, color: 'var(--leitor-txt-fraco)' }}>
            <p style={{ fontWeight: 700, color: 'var(--leitor-txt)', marginBottom: 6 }}>Nada aberto</p>
            <p style={{ fontSize: 14, margin: 0 }}>Escolhe algo à esquerda para ler aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}
