// Render an ayah to a decorated PNG (Nour design) and share (Web Share API) or
// download. The ayah is drawn as-is (Amiri Quran) — never edited. da'wah share.
type Fmt = 'square' | 'story';
export type CardTemplate = 'parchment' | 'night' | 'emerald' | 'royal' | 'minimal' | 'gold';
interface Opts { tafsir?: string; format?: Fmt; template?: CardTemplate; link?: string }

const INK = '#201B15';
const GREEN = '#004333';
const GOLD = '#785A00';
const GOLD_LINE = '#C9A54A';
const PAPER = '#FDF2E7';
const MUTED = '#5C6B62';
const SITE = 'battastudio.github.io/Quran-AI';

interface Tpl { panel: string; ink: string; ref: string; frame: string; foot: string; grad: [string, string] }
export const CARD_TEMPLATES: Record<CardTemplate, Tpl> = {
  parchment: { panel: '#FDF2E7', ink: '#201B15', ref: '#004333', frame: '#C9A54A', foot: '#5C6B62', grad: ['#0A3A32', '#08221a'] },
  night:     { panel: '#0E1613', ink: '#EDE6D6', ref: '#FCCE66', frame: '#C9A54A', foot: '#9DB0A5', grad: ['#141c18', '#000000'] },
  emerald:   { panel: '#083a31', ink: '#F1EBDD', ref: '#7EDBA9', frame: '#D9B95B', foot: '#B7D1C8', grad: ['#0A3A32', '#062B25'] },
  royal:     { panel: '#16244A', ink: '#F1EBDD', ref: '#E2C46A', frame: '#E2C46A', foot: '#B9C3E3', grad: ['#1D2F5E', '#0F1A33'] },
  minimal:   { panel: '#FFFFFF', ink: '#1F1A14', ref: '#0F5C48', frame: '#E4DFD3', foot: '#7D858B', grad: ['#F6F3EC', '#EEEAE0'] },
  gold:      { panel: '#1A1508', ink: '#F3E9C8', ref: '#E2C46A', frame: '#E2C46A', foot: '#B8A274', grad: ['#2a2008', '#120d02'] },
};

export async function shareAyahImage(text: string, ref: string, opts: Opts = {}): Promise<void> {
  const blob = await renderAyahCard(text, ref, opts);
  if (!blob) return;
  const file = new File([blob], 'nour-ayah.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: `${text}\n${ref} — نور القرآن` });
  else download(blob);
}

export async function renderAyahCard(text: string, ref: string, opts: Opts = {}): Promise<Blob | null> {
  const story = opts.format === 'story';
  const W = 1080;
  await loadFonts();
  const ctx0 = document.createElement('canvas').getContext('2d');
  if (!ctx0) return null;

  // measure content on a scratch context
  const quran = "56px 'Amiri Quran', serif";
  const tafFont = "30px 'IBM Plex Sans Arabic', sans-serif";
  ctx0.direction = 'rtl';
  const lines = wrap(ctx0, text, W - 300, quran);
  const tafLines = opts.tafsir ? wrap(ctx0, opts.tafsir, W - 320, tafFont).slice(0, 4) : [];
  const contentH = 260 + lines.length * 92 + (tafLines.length ? 60 + tafLines.length * 46 : 0);

  const t = CARD_TEMPLATES[opts.template ?? 'parchment'];
  const H = story ? 1920 : contentH;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.direction = 'rtl';
  ctx.textAlign = 'center';

  // background
  if (story) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, t.grad[0]); g.addColorStop(1, t.grad[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = t.panel; ctx.fillRect(0, 0, W, H);
  }

  // panel (inset on story) + gold double frame
  const px = 48, py = story ? (H - contentH) / 2 : 40;
  const pw = W - px * 2, ph = contentH;
  if (story) { ctx.fillStyle = t.panel; roundRect(ctx, px, py, pw, ph, 36); ctx.fill(); }
  ctx.strokeStyle = t.frame; ctx.lineWidth = 4;
  roundRect(ctx, px + 8, py + 8, pw - 16, ph - 16, 28); ctx.stroke();
  ctx.lineWidth = 1;
  roundRect(ctx, px + 22, py + 22, pw - 44, ph - 44, 20); ctx.stroke();

  let y = py + 96;
  ctx.fillStyle = t.ref;
  ctx.font = "34px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText('﴿ نور القرآن ﴾', W / 2, y);
  y += 90;
  ctx.fillStyle = t.ink; ctx.font = quran;
  lines.forEach((ln) => { ctx.fillText(ln, W / 2, y); y += 92; });
  y += 6;
  ctx.fillStyle = t.frame; ctx.font = "34px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText('◈', W / 2, y); y += 54;
  ctx.fillStyle = t.ref; ctx.font = "34px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText(ref, W / 2, y); y += 54;
  if (tafLines.length) {
    ctx.fillStyle = t.foot; ctx.font = tafFont;
    tafLines.forEach((ln) => { ctx.fillText(ln, W / 2, y); y += 46; });
  }
  // footer: deep link (da'wah provenance) + free-forever line
  ctx.fillStyle = t.foot;
  ctx.font = "22px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText(opts.link ?? SITE, W / 2, py + ph - 58);
  ctx.fillText('مجاناً بلا إعلانات', W / 2, py + ph - 28);

  return new Promise((r) => canvas.toBlob(r, 'image/png'));
}

// Ijāza / achievement certificate — portrait, ornate gold frame. Shareable image.
export async function shareCertificate(title: string, name: string, body: string): Promise<void> {
  const blob = await renderCertificate(title, name, body);
  if (!blob) return;
  const file = new File([blob], 'nour-certificate.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: `${title} — نور القرآن` });
  else download(blob);
}

export async function renderCertificate(title: string, name: string, body: string): Promise<Blob | null> {
  const W = 1080, H = 1350;
  await loadFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.direction = 'rtl'; ctx.textAlign = 'center';

  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  // ornate double gold frame
  ctx.strokeStyle = GOLD_LINE; ctx.lineWidth = 6; roundRect(ctx, 50, 50, W - 100, H - 100, 24); ctx.stroke();
  ctx.lineWidth = 2; roundRect(ctx, 74, 74, W - 148, H - 148, 16); ctx.stroke();

  ctx.fillStyle = GREEN; ctx.font = "36px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText('﴿ نور القرآن ﴾', W / 2, 190);
  ctx.fillStyle = GOLD; ctx.font = "64px 'Amiri Quran', serif";
  ctx.fillText(title, W / 2, 340);
  ctx.fillStyle = MUTED; ctx.font = "30px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText('تشهد نور القرآن بأنّ', W / 2, 470);
  ctx.fillStyle = INK; ctx.font = "56px 'Amiri Quran', serif";
  ctx.fillText(name || 'الطالب/ة', W / 2, 570);

  ctx.fillStyle = INK; ctx.font = "34px 'IBM Plex Sans Arabic', sans-serif";
  const lines = wrap(ctx, body, W - 280, ctx.font);
  let y = 700; lines.forEach((ln) => { ctx.fillText(ln, W / 2, y); y += 52; });

  ctx.fillStyle = GOLD; ctx.font = "40px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText('◈', W / 2, H - 240);
  ctx.fillStyle = MUTED; ctx.font = "26px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText(SITE, W / 2, H - 150);
  return new Promise((r) => canvas.toBlob(r, 'image/png'));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
}

async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load("56px 'Amiri Quran'"),
      document.fonts.load("30px 'IBM Plex Sans Arabic'"),
    ]);
  } catch { /* fall back to system */ }
}

function download(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'nour-ayah.png'; a.click();
  URL.revokeObjectURL(url);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, font: string): string[] {
  ctx.font = font;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
