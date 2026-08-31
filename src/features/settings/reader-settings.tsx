import { Toggle } from '../../components';
import { arabicNum } from '../../lib/format';
import { useSettings } from '../../store/settings-store';
import { RULES } from '../../lib/tajweed';
import type { ThemeMode } from '../../lib/types';

const THEMES: { id: ThemeMode; label: string }[] = [
  { id: 'auto', label: 'تلقائي' },
  { id: 'light', label: 'فاتح' },
  { id: 'dark', label: 'داكن' },
];

export function ReaderSettings() {
  const { theme, fontSize, showWordHints, tajweed, set } = useSettings();
  return (
    <div className="stack">
      <div className="field">
        <span>السمة</span>
        <div className="chips">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={theme === t.id ? 'chip chip--on' : 'chip'}
              onClick={() => set({ theme: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <label className="field">
        <span>حجم خط الآية: {arabicNum(fontSize)}</span>
        <input
          type="range"
          min={22}
          max={44}
          value={fontSize}
          onChange={(e) => set({ fontSize: Number(e.target.value) })}
        />
      </label>
      <Toggle
        label="إظهار تلميح الكلمة عند اللمس"
        checked={showWordHints}
        onChange={(v) => set({ showWordHints: v })}
      />
      <Toggle label="تلوين أحكام التجويد" checked={tajweed} onChange={(v) => set({ tajweed: v })} />
      {tajweed && (
        <div className="tajweed-legend">
          {Object.values(RULES)
            .filter((r, i, arr) => arr.findIndex((x) => x.name === r.name) === i)
            .map((r) => (
              <span key={r.name} className="tajweed-legend__item">
                <span className="tajweed-legend__dot" style={{ background: r.color }} />
                {r.name}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
