import { useEffect, useRef } from 'react';

// Live mic level meter (Web Audio AnalyserNode). Opens its own stream while active.
export function Waveform({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let ctx: AudioContext | null = null;
    let stream: MediaStream | null = null;
    let stopped = false;

    void (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        return;
      }
      if (stopped) return;
      ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const canvas = ref.current;
      const g = canvas?.getContext('2d');
      const color = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#1f7a54';

      const draw = () => {
        if (!canvas || !g) return;
        analyser.getByteFrequencyData(data);
        g.clearRect(0, 0, canvas.width, canvas.height);
        const bw = canvas.width / data.length;
        g.fillStyle = color;
        for (let i = 0; i < data.length; i++) {
          const h = Math.max(3, (data[i] / 255) * canvas.height);
          g.fillRect(i * bw, (canvas.height - h) / 2, bw - 2, h);
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      void ctx?.close();
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={ref} width={220} height={54} className="waveform" />;
}
