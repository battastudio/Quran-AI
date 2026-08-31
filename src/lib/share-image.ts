// Render an ayah to a PNG and share (Web Share API) or download. No text is
// altered — the ayah is drawn as-is with attribution.
export async function shareAyahImage(text: string, ref: string): Promise<void> {
  const W = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  const lines = wrap(ctx, text, W - 140, 46);
  const H = 360 + lines.length * 78;
  canvas.height = H;

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#1f7a54');
  g.addColorStop(1, '#0f5138');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#f7f3e3';
  ctx.font = '46px serif';
  lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 150 + i * 78));
  ctx.fillStyle = '#d8e8df';
  ctx.font = '30px sans-serif';
  ctx.fillText(ref, W / 2, H - 110);
  ctx.font = '26px sans-serif';
  ctx.fillText('نور القرآن', W / 2, H - 60);

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
  if (!blob) return;
  const file = new File([blob], 'ayah.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file] });
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ayah.png';
    a.click();
    URL.revokeObjectURL(url);
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, size: number): string[] {
  ctx.font = `${size}px serif`;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
