// Offline recognition via transformers.js Whisper (onnx-community/whisper-base,
// multilingual → Arabic). Model auto-downloads from Hugging Face and caches, so
// it works fully offline after the first load. Lazy-imported (heavy).
type Transcriber = (audio: Float32Array, opts: object) => Promise<{ text: string }>;
let transcriber: Transcriber | null = null;

export async function ensureWhisper(onProgress?: (p: { progress?: number }) => void): Promise<void> {
  if (transcriber) return;
  const { pipeline } = await import('@huggingface/transformers');
  const hasGPU = 'gpu' in navigator;
  transcriber = (await pipeline('automatic-speech-recognition', 'onnx-community/whisper-base', {
    device: hasGPU ? 'webgpu' : 'wasm',
    progress_callback: onProgress as never,
  })) as unknown as Transcriber;
}

export async function transcribe(audio: Float32Array): Promise<string> {
  if (!transcriber) throw new Error('whisper not loaded');
  const out = await transcriber(audio, { language: 'arabic', task: 'transcribe' });
  return out.text ?? '';
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
  const length = Math.ceil((buffer.duration * 16000));
  const off = new OfflineAudioContext(1, length, 16000);
  const src = off.createBufferSource();
  src.buffer = buffer;
  src.connect(off.destination);
  src.start();
  const rendered = await off.startRendering();
  return rendered.getChannelData(0);
}
