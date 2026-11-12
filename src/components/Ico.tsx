/** Ícones minimalistas de linha (24×24, traço currentColor) — usados em toda a app em vez de emojis. */
const P: Record<string, string> = {
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 15l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9L19 15z',
  phone: 'M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01',
  bell: 'M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  trend: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  monitor: 'M20 3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2zM8 21h8M12 17v4',
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  finance: 'M3 3v18h18M7 14l4-4 4 3 5-6',
  headphones: 'M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z',
  bookmark: 'M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-3.5-3.5',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z',
  building: 'M3 21h18M5 21V5a2 2 0 012-2h7a2 2 0 012 2v16M16 21V9h3a2 2 0 012 2v10M8 7h3M8 11h3M8 15h3',
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  play: 'M6 4l14 8-14 8V4z',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
};

export type IcoNome = keyof typeof P;

export default function Ico({ n, s = 16, fill = false }: { n: string; s?: number; fill?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: '0 0 auto', verticalAlign: '-0.15em' }}
    >
      <path d={P[n] ?? ''} />
    </svg>
  );
}
