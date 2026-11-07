/** Miniaturas determinísticas por remetente (gradiente a partir do email). */
const GRADS = [
  ['#1BE03C', '#15B832'],
  ['#A8F7B9', '#0B6B34'],
  ['#C9F2D4', '#2ACB49'],
  ['#8FE3A0', '#09572C'],
  ['#D2F5DA', '#15B832'],
  ['#A0E8B0', '#166A2E'],
];

export function grad(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const [a, b] = GRADS[h % GRADS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).slice(0, 2);
  return partes.map((p) => p[0]?.toUpperCase() ?? '').join('');
}

/** "há 12 min", "há 2 h", "ontem", "3 nov". */
export function tempoRelativo(d: Date): string {
  const seg = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (seg < 60) return 'agora mesmo';
  const min = Math.floor(seg / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const dias = Math.floor(h / 24);
  if (dias === 1) return 'ontem';
  if (dias < 7) return `há ${dias} dias`;
  return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
}
