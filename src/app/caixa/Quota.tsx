import Ico from '@/components/Ico';
/** Barra discreta: quantas newsletters estão na caixa face ao limite do plano Free. */
export default function Quota({ total, limite, ehPro }: { total: number; limite: number; ehPro: boolean }) {
  if (ehPro) return null;

  const pct = Math.min(100, Math.round((total / limite) * 100));
  const perto = total >= limite - 10; // a partir de 40/50
  const cheio = total >= limite;
  const cor = cheio ? '#e2574f' : perto ? '#F5B301' : '#1BE03C';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '2px 2px 0' }}>
      <div
        role="progressbar"
        aria-valuenow={total}
        aria-valuemin={0}
        aria-valuemax={limite}
        aria-label={`${total} de ${limite} newsletters na caixa`}
        style={{ height: 4, borderRadius: 999, background: 'var(--app-borda)', overflow: 'hidden' }}
      >
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: cor, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="t-app-tenue" style={{ fontSize: 10.5, flex: '1 1 auto' }}>
          {cheio ? (
            <>No limite — <strong style={{ color: cor }}>{total}/{limite}</strong></>
          ) : (
            <>
              <strong style={{ color: perto ? cor : 'inherit' }}>{total}</strong> de {limite} newsletters
            </>
          )}
        </span>
        {perto && (
          <a
            href="/pro"
            style={{
              flex: '0 0 auto',
              fontSize: 10.5,
              fontWeight: 700,
              color: '#052e16',
              background: '#1BE03C',
              borderRadius: 999,
              padding: '3px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            Passar ao Pro <Ico n="sparkle" s={11} />
          </a>
        )}
      </div>

      {perto && (
        <span className="t-app-tenue" style={{ fontSize: 10.5, lineHeight: 1.45 }}>
          {cheio
            ? 'Chegaste ao limite do Free: a cada nova edição, a mais antiga (não guardada) sai. No Pro guardas tudo, para sempre.'
            : 'Estás quase no limite do plano Free. No Pro o armazenamento é ilimitado.'}
        </span>
      )}
    </div>
  );
}
