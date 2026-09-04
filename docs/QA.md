# On-device QA checklist

Test on a real **iPhone (Safari)** and **Android (Chrome)** against the live URL
`https://battastudio.github.io/Quran-AI/`. Focus is the items fixed without on-device
testing. For each: ✅ works / ⚠️ partial / ❌ broken — report the row + what you saw.

## Install
- [ ] Android: in-app «تثبيت» button installs; launches standalone (no address bar).
- [ ] iPhone: Share ⬆ → «أضف إلى الشاشة الرئيسية»; launches standalone.
- [ ] App icon + name «نور القرآن» correct on the home screen.

## Offline (airplane mode after first load)
- [ ] Reader (all views), surah switch, tajwīd colours work.
- [ ] Adhkar, tasbih, 99 names, duas, hijri calendar work.
- [ ] Tafsir search (Muyassar) returns results.
- [ ] Downloaded audio surahs play; prayer times show (after one GPS fix).

## Audio (the bitrate-fallback fix)
- [ ] Play several reciters incl. **Sudais, Abdul Basit, Minshawi, Husary, Afasy** —
      all start (no silent failures). If one fails, note which.
- [ ] Reciter **preview ▶** in the list plays a sample.
- [ ] Floating player: seek, speed, A–B repeat (loop a range N×), sleep timer.
- [ ] Word-sync highlight (▶mic in reader) lights up words in time (Alafasy).

## Offline Tasmi' model (the q8 / single-thread fix)
- [ ] Settings → محرّك التسميع → keep **tiny** → «تنزيل النموذج» → reaches 100% and
      «تم التنزيل ✓» (no `MatMulNBits` error). If it errors, copy the exact message.
- [ ] Offline Tasmi' mode records an ayah and returns a result.

## Notifications / adhan (Android, installed)
- [ ] Allow notifications; adhkar/prayer reminder appears (best-effort).
- [ ] Adhan sound plays at the scheduled prayer (app open).
- [ ] iOS: expected to be foreground-only (documented limit).

## Data & sync
- [ ] Highlight an ayah (colour persists + shows in المحفوظات); bookmark folders filter.
- [ ] Notes save; export Markdown downloads a `.md`.
- [ ] (If Firebase configured) sign in on two devices → a bookmark on one appears on
      the other within seconds (live sync).

## Scholarly (needs internet first time, then cached)
- [ ] Tafsir sheet: switch to Ibn Kathīr / إعراب / غريب — text loads.
- [ ] Word sheet shows غريب meaning + root; «كل مواضع الجذر» lists occurrences.
- [ ] «آيات متشابهة» lists similar ayahs.

## Recitation lab
- [ ] Record → «تسجيلي» replays; «الأصل» plays the reciter; delete works.

## Nour design + theme
- [ ] Default look is the parchment/green **Nour** theme; status bar is green (light) /
      dark (dark mode).
- [ ] Settings → المظهر: switch light/dark/emerald/royal/… — all readable, RTL correct.
- [ ] Bottom bar: 5 tabs + centre mic FAB; reselecting a tab scrolls to top; haptic tap.

## Deep links (share/growth)
- [ ] Open `…/#/s/2/255` → lands on Ayat al-Kursi in the reader.
- [ ] Open `…/#/today` → opens today's wird position (or al-Fatiha if no plan).
- [ ] Send an ayah link in WhatsApp → preview shows the ayah (OG page) on a fresh device.

## Share cards (da'wah)
- [ ] Ayah actions → «صورة» shares a square card; «بطاقة قصة» shares a 9:16 story with
      tafsir; both carry the deep link + «مجاناً بلا إعلانات».
- [ ] Achievements → «شهادة الإتقان» / «تقرير التقدّم» export a certificate image.

## Khatmah group + invite
- [ ] Khatmah → «ختمة جماعية» → «أنشئ الرابط وشارك» produces a link; opening it shows the
      juz picker; tapping a juz opens the reader there.
- [ ] Complete a wird once → one-time invite sheet appears (not again after dismiss);
      Settings → «شارك التطبيق» works anytime.

## Reverence
- [ ] Reader ayah text matches the mushaf exactly (no odd glyphs); source line present.
- [ ] Stats badges use quality names + geometric motifs; streak reads «الاستمرار».
- [ ] Tasmi shows «يقيس صحّة الكلمات فقط، ولا يقيّم أحكام التجويد».

Report back the ❌/⚠️ rows and I'll fix them.
