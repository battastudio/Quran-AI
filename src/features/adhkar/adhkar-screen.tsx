import { useEffect, useState } from 'react';
import { Spinner } from '../../components';

interface Category {
  title: string;
  items: string[];
}
const BASE = import.meta.env.BASE_URL;

export function AdhkarScreen() {
  const [cats, setCats] = useState<Category[] | null>(null);
  const [active, setActive] = useState<Category | null>(null);

  useEffect(() => {
    void fetch(`${BASE}data/adhkar.json`).then((r) => r.json()).then(setCats);
  }, []);

  if (!cats) return <Spinner />;

  if (active)
    return (
      <section className="screen">
        <button className="link" onClick={() => setActive(null)}>‹ كل الأذكار</button>
        <h1 className="screen__title">{active.title}</h1>
        {active.items.map((t, i) => (
          <DhikrCard key={i} text={t} />
        ))}
      </section>
    );

  return (
    <section className="screen">
      <h1 className="screen__title">الأذكار</h1>
      <ul className="adhkar-cats">
        {cats.map((c) => (
          <li key={c.title}>
            <button className="settings-list__item adhkar-cat" onClick={() => setActive(c)}>
              {c.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Tap the counter to track repetitions.
function DhikrCard({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  return (
    <div className="dhikr" onClick={() => setCount((c) => c + 1)}>
      <p className="dhikr__text">{text}</p>
      <span className="dhikr__count">{count > 0 ? `عدد: ${count}` : 'اضغط للعدّ'}</span>
    </div>
  );
}
