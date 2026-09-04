# Prompt for Claude Fable — نور القرآن redesign & growth

Paste everything between the `=== BEGIN / END PROMPT ===` markers into **Claude Fable
(Fable 5) on claude.ai**. It's self-contained (Fable can't see the repo). Fable returns
an **implementation-ready spec**; paste its output back to Claude Code to build.

Positioning: **free forever, no ads, da'wah / ṣadaqah jāriyah**. Redesign: **both a
refined evolution and a bold reimagining, per screen**.

=== BEGIN PROMPT ===

You are a **cross-functional lead**: (1) senior product & growth strategist for
consumer mobile apps, (2) staff UI/UX design lead (mobile-first, RTL Arabic), and
(3) an advisor sensitive to **Islamic app etiquette and Quranic reverence**. Your
output will be handed to a coding agent (**Claude Code**) to implement, so it must be
concrete and implementation-ready — not vague advice.

## The product
**نور القرآن (Nour Al Quran)** — a finished, offline-first **Arabic Quran PWA**
(Progressive Web App), live at https://battastudio.github.io/Quran-AI/. It is a
**static site with no backend** (GitHub Pages); everything runs on-device. Optional
free Firebase can be added for cross-device sync. **Positioning: 100% free, no ads,
no paywall** — growth is da'wah- and community-driven (framing: *ṣadaqah jāriyah*).

### Tech (fixed — design within this)
Vite + React + TypeScript · vite-plugin-pwa (Workbox) · IndexedDB (idb) · Zustand ·
framer-motion · adhan-js · @huggingface/transformers (lazy, on-device Whisper). No
server. Data is bundled JSON + on-demand cached fetches (Quran text, tafsir, reciter
audio from CDNs). Arabic-first, RTL. 8+ selectable themes, Amiri Quran font for ayahs.

### Current feature inventory (already built — redesign/extend, don't re-spec from zero)
- **Reader**: verified Uthmani text; 5 view modes (continuous scroll, mushaf page with
  swipe, focus/night, ayah cards, word-by-word); tajwīd colouring; parchment mushaf;
  tap-a-word → root · grammar · غريب meaning · 🔊 word audio; word-synced highlight
  during recitation (one reciter). Real horizontal swipe between pages/surahs.
- **Tafsir & study**: Muyassar (bundled) + Ibn Kathīr/Ṭabarī/Saʿdī/Qurṭubī/Baghawī +
  full **إعراب** (grammar) — a "scholar panel" sheet; **tafsir search**; **root
  concordance** (tap root → all occurrences); **mutashābihāt** (similar-ayah finder);
  advanced search (by juz, Meccan/Medinan); **10-language translations** (downloadable).
- **Audio**: **176 reciters** with in-list **preview**, bitrate fallback, floating
  player (seek/speed/**A–B repeat**/sleep timer), per-surah **offline download**.
- **Tasmi' (recitation check)**: live follow-along · memorization test · ayah drill ·
  **offline on-device Whisper** (Web Worker); waveform + accuracy ring; center **mic
  FAB** in the bottom bar. (Honest: word-level tajwīd grading is NOT possible without a
  trained model; only word-accuracy.)
- **Memorization**: SM-2 spaced repetition; hide-word / first-letter practice;
  listen-and-repeat ×N; test-by-juz; weak-ayah tracking; **khatmah** plan; **recitation
  lab** (record your voice, replay, compare to reciter, mistake tracker).
- **Worship**: prayer times + **Qibla** + **adhan sound**; adhkar (counter + haptics +
  categories); **tasbīḥ**; **99 names**; **Quranic du‘ā**; **Hijri calendar** (fasting
  days + Islamic events).
- **Personal**: bookmarks + **folders**, per-ayah **notes**, colour **highlights**,
  **Markdown export**; **stats** (reading minutes · streak heatmap · per-juz progress ·
  **badges**).
- **Platform**: installable PWA (iOS + Android), home-screen shortcuts, one-tap
  **offline pack**, optional **Firebase live sync** (local-first), 8+ themes +
  high-contrast + reading-comfort, best-effort notifications, crash-safe.

### Screens / routes (redesign each)
Bottom bar: **الرئيسية (home) · المصحف (reader) · [🎙 التسميع center FAB] · الحفظ ·
الإعدادات**. Screens: Home/dashboard, Reader (5 views), Tasmi', Prayer/Qibla, Hifz +
Practice, Search, Tafsir-search, Root/Similar lists, Khatmah, Bookmarks/Notes/
Highlights, Stats/Badges, Tasbīḥ, 99 Names, Du‘ā, Hijri Calendar, Recitation Lab,
Settings (collapsible sections). Global bottom sheets: word, scholar/tafsir, note,
**ayah-actions** (play·tafsir·bookmark·note·highlight·copy·share text·share image·
memorize·similar), audio player.

### Hard constraints & red lines (design within these)
- **Static PWA, no backend** (except optional free Firebase). Offline-first: must work
  in airplane mode after first load. Background notifications are best-effort;
  **iOS is foreground-only** (platform limit).
- **Quranic text is sacred**: never generated/altered; byte-faithful. Tafsir/i'rab/
  translations are attributed sources.
- **Reverence**: gamification must **never trivialize** sacred content — motivate
  without cheapening (no cartoonish rewards on ayahs, no leaderboards that shame).
- **Free forever, no ads.** Any "monetization" = optional donation/waqf only if you
  recommend it, never gating core worship features.
- **Arabic-first RTL**, accessibility (dynamic type, high contrast, screen-reader),
  and a lean performance budget (it's a static site loaded on mid-range phones).

## What I need from you (deliver ALL, in this order)

**A. Viral / da'wah growth strategy.** Respectful, halal, no-ads growth: shareable
moments (ayah cards, progress, streaks), community/**halaqa** features, invite/da'wah
loops, habit rituals (morning/evening, prayer-linked), ASO/store optimisation, content
& seasonal hooks (Ramadan, Fridays). Give a **prioritised experiment backlog** (table:
idea · why-viral · effort S/M/L · North-Star metric) and the 2–3 highest-leverage bets.
Flag which need a backend (and the lightest way to add it).

**B. Advanced feature roadmap.** Phased (Now / Next / Later), each item with
value-vs-effort and whether it fits a static PWA (or needs optional Firebase). Build on
what exists; avoid duplicating shipped features.

**C. Full screen-by-screen redesign — the core deliverable.** For **every** screen
above, provide **two** directions: **(1) a refined evolution** of the current design and
**(2) a bold reimagining** (new IA/visual language). For each screen include:
- purpose & primary user action; information hierarchy;
- **layout** (ASCII wireframe or precise structural description), RTL-correct;
- **component spec** (each element: type, content, behaviour, tap targets);
- **all states**: loading (skeletons), empty, error, **offline**;
- **motion** (enter/exit, gestures, micro-interactions) — framer-motion-friendly;
- **tokens used** (colour/type/spacing) + accessibility notes;
- **acceptance criteria** (checklist a coding agent can verify).

**D. Design system spec.** Concrete tokens a coding agent can drop in: colour roles
(for light + the dark/emerald/royal families), type scale (Amiri Quran for ayahs +
Arabic UI font), spacing/radius/elevation, motion durations/easings, iconography style,
and the **bottom-bar + center-mic-FAB** pattern. Include the new/updated CSS-variable set.

## Output format (strict)
- Structured Markdown with the sections **A, B, C (one sub-section per screen), D**.
- Be **concrete**: real copy (Arabic), real numbers, real token values — no
  placeholders like "nice spacing".
- Where a decision is needed, **state your recommended default** so Claude Code can
  proceed without another round-trip.
- Explicitly **flag** anything that needs new data/assets (fonts, images, datasets),
  a backend, or a licence — Claude Code will source or ask.
- Keep reverence and the free/offline/RTL constraints in every recommendation.
- End with a **prioritised build order** (what Claude Code should implement first →
  last) mapping each item to the screens/sections it touches.

Begin with **Section A**, then B, C (screen by screen), and D.

=== END PROMPT ===

## After Fable replies
- Fable returns a **spec/plan**, not code — paste its output back to Claude Code and it
  will implement screen by screen, keeping the build green + offline.
- If Fable proposes a **backend** (community/leaderboards/push), the lightest
  halal-friendly path is **free Firebase** (already wired) or a tiny serverless
  function. Claude Code will advise before adding anything that breaks "static + free".
- The reverence guardrail is intentional — it keeps "viral" ideas from cheapening the
  Quran.
