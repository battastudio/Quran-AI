# Features

Al-Furqan AI is an offline-first Arabic Quran PWA. All features run on-device;
sacred text is bundled and never model-generated (see `../../CLAUDE.md`).

| Feature | Doc | Offline |
|---|---|---|
| Home dashboard + streak | [home.md](home.md) | ✅ |
| Interactive Mushaf reader | [reader.md](reader.md) | ✅ bundled text |
| Tap-a-word + pronunciation | [words.md](words.md) | ✅ (audio after first play) |
| Search + go-to | [search.md](search.md) | ✅ |
| Tafsir (bundled + downloadable) | [tafsir.md](tafsir.md) | ✅ after download |
| Multi-reciter audio | [audio.md](audio.md) | ✅ after per-surah download |
| Prayer times + Qibla | [prayer.md](prayer.md) | ✅ after first GPS fix |
| Notifications | [notifications.md](notifications.md) | ⚠️ best-effort (iOS limits) |
| Memorization (SM-2) | [hifz.md](hifz.md) | ✅ |
| Khatmah reading plan | [khatmah.md](khatmah.md) | ✅ |
| Account & sync (optional) | [account.md](account.md) | ✅ local; sync needs Firebase |
| Settings hub | [settings.md](settings.md) | ✅ |
| Tasmi' follow-along | [tasmi.md](tasmi.md) | ⚠️ online, or offline w/ Vosk model |

Data pipeline: `scripts/fetch-data.mjs` fetches verified text + Muyassar tafsir
from AlQuran Cloud into `public/data/` (run once, output committed).
