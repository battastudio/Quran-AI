import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader,Spinner } from '../../components';
import { arabicNum } from '../../lib/format';
import { useReader } from '../../store/reader-store';

interface Dua { title: string; s: number; a: number }
const BASE = import.meta.env.BASE_URL;

export function DuasScreen() {
  const [duas, setDuas] = useState<Dua[] | null>(null);
  const goTo = useReader((s) => s.goTo);
  const nav = useNavigate();
  useEffect(() => { void fetch(`${BASE}data/duas.json`).then((r) => r.json()).then(setDuas); }, []);
  if (!duas) return <Spinner />;
  return (
    <section className="screen">
      <AppHeader section="أدعية من القرآن" />
      <ul className="dua-list">
        {duas.map((d, i) => (
          <li key={i}>
            <button className="dua-item" onClick={() => { goTo(d.s, d.a); nav('/mushaf'); }}>
              <span className="dua-item__title">{d.title}</span>
              <span className="dua-item__ref">{arabicNum(d.s)}:{arabicNum(d.a)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
