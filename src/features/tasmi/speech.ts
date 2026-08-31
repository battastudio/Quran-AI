// Minimal wrapper over the browser SpeechRecognition (online, not Quran-tuned).
// Experimental: used only for a rough word-match, never for tajwīd judgement.

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
}
interface SpeechRecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
type Ctor = new () => SpeechRecognition;

function ctor(): Ctor | null {
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const speechSupported = () => ctor() !== null;

export function listen(onTranscript: (text: string) => void): { stop: () => void } | null {
  const C = ctor();
  if (!C) return null;
  const rec = new C();
  rec.lang = 'ar-SA';
  rec.continuous = true;
  rec.interimResults = true;
  rec.onresult = (e) => {
    let text = '';
    for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' ';
    onTranscript(text);
  };
  rec.start();
  return { stop: () => rec.stop() };
}
