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

## Offline model (where it comes from)
`whisper.ts` lazy-loads **transformers.js** and the model
**`onnx-community/whisper-base`** (multilingual → Arabic), which auto-downloads
from Hugging Face and caches (WebGPU→WASM). Nothing to host. Chunk is excluded
from precache (fetched on first use). Alternative streaming engine: **Vosk**
(`vosk.ts`) — Arabic models from https://alphacephei.com/vosk/models (`.zip`,
repackage to CORS `.tar.gz` and host yourself), URL set in Settings.

## Honest ceiling
Tarteel-grade tajwīd verification needs a purpose-trained model (proprietary) —
out of scope for a static PWA. This is word-accuracy + follow-along, labeled تجريبي.
