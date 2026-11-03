/** Miniaturas determinísticas por remetente (gradiente a partir do email). */
const GRADS = [
  ['#4ACC5F', '#2FA44B'],
  ['#A7EDB6', '#1E7A30'],
  ['#C9F2D4', '#56B96B'],
  ['#8FE3A0', '#146A2E'],
  ['#D2F5DA', '#2FA44B'],
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
