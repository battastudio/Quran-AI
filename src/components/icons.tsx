// Inline stroke icons (24×24, currentColor). One component, name-keyed — no dep.
const P: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  book: 'M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM18 3v16',
  mic: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  star: 'M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9 9z',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-2-4-2 1a7 7 0 0 0-2-1l-.5-2h-4L10 7a7 7 0 0 0-2 1L6 7 4 11l2 1a7 7 0 0 0 0 2l-2 1 2 4 2-1a7 7 0 0 0 2 1l.5 2h4l.5-2a7 7 0 0 0 2-1l2 1 2-4-2-1a7 7 0 0 0 0-2z',
  play: 'M7 5v14l12-7z',
  pause: 'M8 5v14M16 5v14',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  note: 'M4 20v-4L16 4l4 4L8 20zM14 6l4 4',
  share: 'M12 3v13M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6',
  plus: 'M12 5v14M5 12h14',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  next: 'M15 6l-6 6 6 6',
  prev: 'M9 6l6 6-6 6',
  up: 'M6 15l6-6 6 6',
  close: 'M6 6l12 12M18 6L6 18',
  download: 'M12 3v12M8 11l4 4 4-4M5 21h14',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  page: 'M6 3h9l3 3v15H6zM15 3v3h3',
  focus: 'M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 0-1 1h-4',
  check: 'M4 12l5 5L20 6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21a2 2 0 0 0 4 0',
  palette: 'M12 3a9 9 0 1 0 1 18 2 2 0 0 0 1-3.5 2 2 0 0 1 1.5-3.5H18a3 3 0 0 0 3-3 8 8 0 0 0-9-5zM7.5 12h.01M10 8h.01M14 8h.01',
};

interface Props {
  name: keyof typeof P | string;
  size?: number;
  fill?: boolean;
}

export function Icon({ name, size = 22, fill = false }: Props) {
  const d = P[name] ?? '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
