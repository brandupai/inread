import SiteShell from '@/components/SiteShell';

export const metadata = { title: 'Termos de utilização — inread' };

const h2 = { fontSize: 20, margin: '18px 0 0' };
const p = { margin: 0, fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-soft)' as const };

export default function Termos() {
  return (
    <SiteShell>
      <main style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(28px, 5vw, 38px)' }}>Termos de utilização</h1>
        <p style={{ ...p, color: 'var(--quiet)' }}>Última atualização: 3 de novembro de 2026</p>

        <h2 style={h2}>1. O serviço</h2>
        <p style={p}>
          O inread.app é um leitor de newsletters: dá-te um endereço de email dedicado (nome@inread.app), recebe as newsletters enviadas para esse endereço, limpa-as de rastreadores e apresenta-as para leitura, organização e exportação. Ao criares conta, aceitas estes termos.
        </p>

        <h2 style={h2}>2. Planos</h2>
        <p style={p}>
          O plano Free inclui até 50 newsletters ativas na caixa; quando o limite é atingido, as edições mais antigas não guardadas são removidas para dar lugar às novas. O plano Pro (€4,99/mês ou €49,99/ano), quando disponível, remove esse limite e adiciona funcionalidades extra. Os preços incluem IVA à taxa legal.
        </p>

        <h2 style={h2}>3. Utilização aceitável</h2>
        <p style={p}>
          O endereço @inread.app destina-se à subscrição de newsletters e conteúdos editoriais para uso pessoal. Não o uses para registo em serviços críticos (banca, recuperação de contas), para receber correspondência pessoal sensível, nem para qualquer atividade ilegal, abusiva ou de spam. Reservamo-nos o direito de suspender contas que violem estas regras.
        </p>

        <h2 style={h2}>4. O teu conteúdo</h2>
        <p style={p}>
          As newsletters que recebes e os highlights que crias são teus. Podes exportá-los a qualquer momento. O conteúdo das newsletters pertence aos respetivos autores; o inread limita-se a apresentá-lo para a tua leitura pessoal.
        </p>

        <h2 style={h2}>5. Disponibilidade e responsabilidade</h2>
        <p style={p}>
          Trabalhamos para manter o serviço disponível e os teus dados seguros, mas o inread é fornecido “tal como está”, sem garantias absolutas de disponibilidade. Na máxima medida permitida por lei, a nossa responsabilidade limita-se ao valor pago pelo serviço nos últimos 12 meses.
        </p>

        <h2 style={h2}>6. Fim da conta</h2>
        <p style={p}>
          Podes terminar a conta a qualquer momento escrevendo para <a href="mailto:suporte@inread.app" style={{ fontWeight: 600 }}>suporte@inread.app</a> — eliminamos os teus dados conforme a política de privacidade.
        </p>

        <h2 style={h2}>7. Alterações e lei aplicável</h2>
        <p style={p}>
          Podemos atualizar estes termos, avisando-te com antecedência razoável quando a alteração for relevante. Estes termos regem-se pela lei portuguesa, com foro na comarca de residência do titular do serviço.
        </p>
      </main>
    </SiteShell>
  );
}
