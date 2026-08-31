# Tasmi' (recitation) — 4 modes · EXPERIMENTAL

`src/features/tasmi/` (center **mic** in the bottom bar). Mode in `tasmi-store.ts`.
All modes use forced alignment (`align.ts`, tested) against the known ayah, so we
follow the text rather than open-transcribe. Word-accuracy only — **no tajwīd verdict**.

- **follow** (`live-tasmi.tsx`) — live follow-along (Web Speech), words go green in
  order, auto-scroll, accuracy ring + animated mic.
- **memorize** — same engine, text blurred while reciting; reveals + marks misses.
- **drill** (`drill-tasmi.tsx`) — one ayah: listen (reciter) → recite → compare → next.
- **offline** (`offline-tasmi.tsx` + `whisper.ts`) — record an ayah, on-device
  **Whisper** checks it. Fully offline after first model load.

Enhancements: real mic **waveform** (`waveform.tsx`, Web Audio AnalyserNode),
**session summary** (accuracy + mistakes) after a live run, continuous auto-scroll.

## Offline model (chooseable + downloadable)
Settings → محرّك التسميع picks a **Whisper** model and downloads it:
`onnx-community/whisper-tiny` (~40 MB) · `whisper-base` (~75 MB, default) ·
`whisper-small` (~250 MB). `whisper.ts` lazy-loads transformers.js; models
auto-download from Hugging Face and cache (WebGPU→WASM) — nothing to host; the
chunk is excluded from precache. Alternative streaming engine: **Vosk**
(`vosk.ts`) — Arabic models from https://alphacephei.com/vosk/models (`.zip`,
repackage to CORS `.tar.gz` and host yourself), URL set in the same panel.

## Honest ceiling
Tarteel-grade tajwīd verification needs a purpose-trained model (proprietary) —
out of scope for a static PWA. This is word-accuracy + follow-along, labeled تجريبي.
