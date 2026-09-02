import { Toggle } from '../../components';
import { useSettings } from '../../store/settings-store';
import type { AyahFont, ReaderView, SwipeDir, ThemeMode } from '../../lib/types';

const SWIPES: { id: SwipeDir; label: string }[] = [
  { id: 'rtl', label: 'يمين ← يسار' },
  { id: 'ltr', label: 'يسار ← يمين' },
];

const THEMES: { id: ThemeMode; label: string; swatch: string }[] = [
  { id: 'auto', label: 'تلقائي', swatch: 'linear-gradient(135deg,#f6f4ee 50%,#0f1511 50%)' },
  { id: 'light', label: 'فاتح', swatch: '#f6f4ee' },
  { id: 'dark', label: 'داكن', swatch: '#0f1511' },
  { id: 'emerald', label: 'زمرّدي', swatch: 'linear-gradient(135deg,#103a2d,#d8b45f)' },
  { id: 'royal', label: 'ملكي', swatch: 'linear-gradient(135deg,#0d0c0f 55%,#c9a24a)' },
  { id: 'midnight', label: 'أخضر داكن', swatch: '#071310' },
  { id: 'sepia', label: 'ورقي', swatch: '#f3ead6' },
  { id: 'night', label: 'ليلي', swatch: '#14110c' },
  { id: 'contrast', label: 'تباين عالٍ', swatch: 'linear-gradient(135deg,#000 50%,#fff 50%)' },
];
const FONTS: { id: AyahFont; label: string }[] = [
  { id: 'amiri', label: 'أميري (مصحفي)' },
  { id: 'system', label: 'النظام' },
];
const VIEWS: { id: ReaderView; label: string }[] = [
  { id: 'scroll', label: 'تمرير' },
  { id: 'page', label: 'صفحات' },
  { id: 'focus', label: 'تركيز' },
  { id: 'cards', label: 'بطاقات' },
  { id: 'wbw', label: 'كلمة بكلمة' },
];

export function ThemeSettings() {
  const { theme, ayahFont, readerView, swipeDir, mushafPaper, comfort, set } = useSettings();
  return (
    <div className="stack">
      <div className="field">
        <span>السمة</span>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={theme === t.id ? 'theme-chip theme-chip--on' : 'theme-chip'}
              onClick={() => set({ theme: t.id })}
            >
              <span className="theme-chip__swatch" style={{ background: t.swatch }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <span>خط الآيات</span>
        <div className="chips">
          {FONTS.map((f) => (
            <button key={f.id} className={ayahFont === f.id ? 'chip chip--on' : 'chip'} onClick={() => set({ ayahFont: f.id })}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="field">
        <span>عرض المصحف الافتراضي</span>
        <div className="chips">
          {VIEWS.map((v) => (
            <button key={v.id} className={readerView === v.id ? 'chip chip--on' : 'chip'} onClick={() => set({ readerView: v.id })}>{v.label}</button>
          ))}
        </div>
      </div>
      <div className="field">
        <span>اتجاه التمرير بين الصفحات والسور</span>
        <div className="chips">
          {SWIPES.map((v) => (
            <button key={v.id} className={swipeDir === v.id ? 'chip chip--on' : 'chip'} onClick={() => set({ swipeDir: v.id })}>{v.label}</button>
          ))}
        </div>
      </div>
      <Toggle label="صفحة المصحف بخلفية ورقية مزخرفة" checked={mushafPaper} onChange={(v) => set({ mushafPaper: v })} />
      <Toggle label="راحة القراءة (تباعد أوسع)" checked={comfort} onChange={(v) => set({ comfort: v })} />
    </div>
  );
}
