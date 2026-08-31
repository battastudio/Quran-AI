// Render an ayah to a decorated PNG and share (Web Share API) or download.
// The ayah is drawn as-is (Amiri Quran) with a gold frame + wordmark. No edits.
export async function shareAyahImage(text: string, ref: string): Promise<void> {
  const W = 1080;
  await loadFont();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  const quran = "56px 'Amiri Quran', serif";
  const lines = wrap(ctx, text, W - 220, quran);
  const H = 420 + lines.length * 92;
  canvas.height = H;

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#0e3327');
  g.addColorStop(1, '#08221a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // gold frame
  ctx.strokeStyle = '#c9a54a';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  ctx.fillStyle = '#f7f3e3';
  ctx.font = quran;
  lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 170 + i * 92));

  ctx.fillStyle = '#e2c274';
  ctx.font = "32px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText(ref, W / 2, H - 150);
  ctx.fillStyle = '#9dc4b2';
  ctx.font = "28px 'IBM Plex Sans Arabic', sans-serif";
  ctx.fillText('نور القرآن', W / 2, H - 96);

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
  if (!blob) return;
  const file = new File([blob], 'ayah.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: `${text}\n${ref}` });
  else download(blob);
}

async function loadFont() {
  try {
    await Promise.all([
      document.fonts.load("56px 'Amiri Quran'"),
      document.fonts.load("32px 'IBM Plex Sans Arabic'"),
    ]);
  } catch { /* fall back to system */ }
}

function download(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ayah.png';
  a.click();
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
