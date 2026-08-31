# Tasmi' (recitation follow-along) — EXPERIMENTAL

`src/features/tasmi/` — labeled تجريبي in the UI.

## How it works
Because we already know the expected ayah, this is **forced alignment**, not open
transcription — the key advantage over generic ASR.
- `align.ts` (pure, tested) aligns heard tokens to the expected token stream in
  order, tolerant to a one-char slip (Levenshtein ≤1). Returns per-word status
  `done | current | wrong | pending` + a moving cursor + `accuracy()`.
- `tasmi-screen.tsx` follows along live: words turn green as recited, the current
  word is highlighted, it auto-scrolls, and shows a session accuracy %.
- **Online engine:** browser `SpeechRecognition` (`speech.ts`, `ar-SA`).
- **Offline engine (optional):** `vosk.ts` — lazy-loaded Vosk WASM + an Arabic
  model whose `.tar.gz` URL the user sets in Settings → "التسميع دون إنترنت".
  Streams mic audio through the same `align` pipeline.

## Honest ceiling (do not oversell)
Word-accuracy + follow-along only — **no tajwīd verdict**. Off-the-shelf
recognition (browser or generic Vosk) isn't trained on Quranic Arabic and can't
grade tajwīd; that needs a purpose-trained model, out of scope for a static PWA.
No small official Arabic Vosk model exists (available ones are large), so offline
is an advanced/experimental opt-in, not a default. Never marketed as verified.
