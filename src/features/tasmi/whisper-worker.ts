// Runs off the main thread so model download + inference never freeze the UI.
// Loads transformers.js Whisper (WASM in-worker) and transcribes posted audio.
type Pipe = (audio: Float32Array, opts: object) => Promise<{ text: string }>;
let pipe: Pipe | null = null;
let loaded = '';

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data as { type: string; model?: string; audio?: Float32Array };
  try {
    if (msg.type === 'load') {
      if (pipe && loaded === msg.model) return post({ type: 'ready' });
      const { pipeline, env } = await import('@huggingface/transformers');
      env.allowLocalModels = false;
      // GitHub Pages doesn't set COOP/COEP → no SharedArrayBuffer → force
      // single-threaded WASM so onnxruntime can init reliably.
      const wasm = env.backends?.onnx?.wasm;
      if (wasm) wasm.numThreads = 1;
      pipe = (await pipeline('automatic-speech-recognition', msg.model!, {
        device: 'wasm',
        progress_callback: ((p: { progress?: number }) => post({ type: 'progress', progress: p.progress ?? 0 })) as never,
      })) as unknown as Pipe;
      loaded = msg.model!;
      post({ type: 'ready' });
    } else if (msg.type === 'transcribe') {
      if (!pipe) throw new Error('not loaded');
      const out = await pipe(msg.audio!, { language: 'arabic', task: 'transcribe' });
      post({ type: 'result', text: out.text ?? '' });
    }
  } catch (err) {
    post({ type: 'error', error: String(err) });
  }
};

function post(m: unknown) {
  (self as unknown as { postMessage: (m: unknown) => void }).postMessage(m);
}
