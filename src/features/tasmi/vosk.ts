export interface VoskSession {
  stop: () => void;
}

// Offline recognition via Vosk WASM. modelUrl points to a .tar.gz Arabic model
// (user-configured in Settings — no small Arabic model ships by default).
// Streams mic audio → partial/final transcripts into onText.
export async function startVosk(
  modelUrl: string,
  onText: (text: string, final: boolean) => void,
): Promise<VoskSession> {
  const { createModel } = await import('vosk-browser'); // lazy: heavy WASM, load on use
  const model = await createModel(modelUrl);
  const ctx = new AudioContext();
  const recognizer = new model.KaldiRecognizer(ctx.sampleRate);
  recognizer.setWords(true);

  recognizer.on('result', (m: unknown) => {
    const t = (m as { result?: { text?: string } }).result?.text;
    if (t) onText(t, true);
  });
  recognizer.on('partialresult', (m: unknown) => {
    const t = (m as { result?: { partial?: string } }).result?.partial;
    if (t) onText(t, false);
  });

  const media = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = ctx.createMediaStreamSource(media);
  const node = ctx.createScriptProcessor(4096, 1, 1);
  node.onaudioprocess = (e) => recognizer.acceptWaveformFloat(e.inputBuffer.getChannelData(0), ctx.sampleRate);
  source.connect(node);
  node.connect(ctx.destination);

  return {
    stop: () => {
      node.disconnect();
      source.disconnect();
      media.getTracks().forEach((t) => t.stop());
      void ctx.close();
      model.terminate();
    },
  };
}
