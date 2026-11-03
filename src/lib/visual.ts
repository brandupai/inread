/** Miniaturas determinísticas por remetente (gradiente a partir do email). */
const GRADS = [
  ['#A6D6AE', '#679281'],
  ['#BFE3C6', '#4F7D69'],
  ['#CDE8D8', '#86A98F'],
  ['#9FC6B4', '#30493F'],
  ['#D4EBD2', '#6FA183'],
  ['#B2D8C4', '#54836E'],
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
