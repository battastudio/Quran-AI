import { useEffect, useMemo, useRef, useState } from 'react';
import { AppHeader, Spinner } from '../../components';
import { DhikrCounter } from './dhikr-counter';

interface Category {
  title: string;
  items: string[];
}
const BASE = import.meta.env.BASE_URL;

// Quick tabs mapped onto the Hisn al-Muslim category titles.
const TABS: { label: string; match: RegExp }[] = [
  { label: 'الصباح والمساء', match: /الصباح والمساء/ },
  { label: 'بعد الصلاة', match: /بعد السلام|الصلاة المكتوبة|أذكار.*الصلاة/ },
  { label: 'النوم', match: /النوم/ },
  { label: 'الاستيقاظ', match: /الاستيقاظ/ },
];

export function AdhkarScreen() {
  const [cats, setCats] = useState<Category[] | null>(null);
  const [active, setActive] = useState<Category | null>(null);
  const [idx, setIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetch(`${BASE}data/adhkar.json`).then((r) => r.json()).then(setCats);
  }, []);

  const quick = useMemo(
    () => TABS.map((t) => ({ ...t, cat: cats?.find((c) => t.match.test(c.title)) })).filter((t) => t.cat),
    [cats],
  );

  if (!cats) return <Spinner />;

  if (active) {
    const advance = () => {
      const next = Math.min(idx + 1, active.items.length - 1);
      setIdx(next);
      document.getElementById(`dh-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    return (
      <section className="screen">
        <button className="link" onClick={() => setActive(null)}>‹ كل الأذكار</button>
        <AppHeader section={active.title} />
        <div ref={listRef}>
          {active.items.map((t, i) => (
            <div id={`dh-${i}`} key={i} className={i === idx ? 'dh-current' : ''}>
              <DhikrCounter text={t} onComplete={advance} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const open = (c: Category) => { setActive(c); setIdx(0); };
  return (
    <section className="screen">
      <AppHeader section="الأذكار" />
      <div className="chips adhkar-tabs">
        {quick.map((t) => <button key={t.label} className="chip" onClick={() => open(t.cat!)}>{t.label}</button>)}
      </div>
      <ul className="adhkar-cats">
        {cats.map((c) => (
          <li key={c.title}>
            <button className="settings-list__item adhkar-cat" onClick={() => open(c)}>{c.title}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
