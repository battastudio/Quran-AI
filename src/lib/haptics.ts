// Light haptic + a short tap sound for counters. Both no-op if unsupported.
let ctx: AudioContext | null = null;

export function tapFeedback(): void {
  if ('vibrate' in navigator) navigator.vibrate(15);
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 660;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    /* audio blocked until a user gesture — fine */
  }
}

export function completeFeedback(): void {
  if ('vibrate' in navigator) navigator.vibrate([25, 40, 25]);
}
