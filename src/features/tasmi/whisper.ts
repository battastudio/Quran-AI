// Main-thread client for the Whisper Web Worker (whisper-worker.ts). Keeps the
// UI responsive during model download + inference.
let worker: Worker | null = null;
let ready = false;
let loadedModel = '';

export const WHISPER_MODELS = [
  { id: 'onnx-community/whisper-tiny', label: 'الأخفّ (~٤٠م.ب) — الأكثر نجاحًا · موصى به' },
  { id: 'onnx-community/whisper-base', label: 'متوازن (~٧٥م.ب)' },
  { id: 'onnx-community/whisper-small', label: 'الأدقّ (~٢٥٠م.ب) — ثقيل، قد يفشل على الأجهزة الضعيفة' },
];

function getWorker(): Worker {
  worker ??= new Worker(new URL('./whisper-worker.ts', import.meta.url), { type: 'module' });
  return worker;
}

export function ensureWhisper(modelId: string, onProgress?: (p: { progress?: number }) => void): Promise<void> {
  if (ready && loadedModel === modelId) return Promise.resolve();
  const w = getWorker();
  return new Promise((resolve, reject) => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (d.type === 'progress') onProgress?.({ progress: d.progress });
      else if (d.type === 'ready') { w.removeEventListener('message', onMsg); ready = true; loadedModel = modelId; resolve(); }
      else if (d.type === 'error') { w.removeEventListener('message', onMsg); reject(new Error(d.error)); }
    };
    w.addEventListener('message', onMsg);
    w.postMessage({ type: 'load', model: modelId });
  });
}

export function transcribe(audio: Float32Array): Promise<string> {
  const w = getWorker();
  return new Promise((resolve, reject) => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (d.type === 'result') { w.removeEventListener('message', onMsg); resolve(d.text); }
      else if (d.type === 'error') { w.removeEventListener('message', onMsg); reject(new Error(d.error)); }
    };
    w.addEventListener('message', onMsg);
    w.postMessage({ type: 'transcribe', audio }, [audio.buffer]);
  });
}

// Record mic audio; stop() returns mono Float32 resampled to 16 kHz for Whisper.
export async function startRecording(): Promise<{ stop: () => Promise<Float32Array> }> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  rec.start();
  return {
    stop: () =>
      new Promise((resolve) => {
        rec.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const buf = await new Blob(chunks).arrayBuffer();
          const ctx = new AudioContext();
          const decoded = await ctx.decodeAudioData(buf);
          void ctx.close();
          resolve(await resample16k(decoded));
        };
        rec.stop();
      }),
  };
}

async function resample16k(buffer: AudioBuffer): Promise<Float32Array> {
  const off = new OfflineAudioContext(1, Math.ceil(buffer.duration * 16000), 16000);
  const src = off.createBufferSource();
  src.buffer = buffer;
  src.connect(off.destination);
  src.start();
  return (await off.startRendering()).getChannelData(0);
}
