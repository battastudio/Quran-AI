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

Enhancements: recitation renders on an **authentic Mushaf parchment page**
(`.mushaf__page--paper`) with **word-level highlight backgrounds** — green=correct,
red=wrong/skipped (yellow reserved, see below); tap a word → `WordSheet`. A floating
**live bar** (`tasmi-live-bar.tsx`) shows the mic + **waveform** + **accuracy ring**.
Session summary (accuracy + mistakes) after a live run.

The offline Whisper model runs in a **Web Worker** (`whisper-worker.ts`) so the UI
never freezes during download/inference; the client (`whisper.ts`) shows clear
states (download % → preparing → listening/checking).

### Download reliability
GitHub Pages doesn't set COOP/COEP → no cross-origin isolation → no `SharedArrayBuffer`,
so onnxruntime is forced to **single-threaded WASM** (`env.backends.onnx.wasm.numThreads
= 1`) or the model fails to init mid-download. The default model is **whisper-tiny**
(~40 MB, most reliable on phones); base/small are heavier and may fail on weak
devices/networks. The Settings download button shows the **real error** and retries
resume from cache. Online Tasmi' modes need no download.

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
