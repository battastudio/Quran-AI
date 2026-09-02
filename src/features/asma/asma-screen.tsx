import { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import { arabicNum } from '../../lib/format';

interface Name { n: number; name: string; t: string }
const BASE = import.meta.env.BASE_URL;

export function AsmaScreen() {
  const [names, setNames] = useState<Name[] | null>(null);
  useEffect(() => { void fetch(`${BASE}data/asma.json`).then((r) => r.json()).then(setNames); }, []);
  if (!names) return <Spinner />;
  return (
    <section className="screen">
      <h1 className="screen__title">أسماء الله الحسنى</h1>
      <div className="asma-grid">
        {names.map((x) => (
          <div key={x.n} className="asma-cell">
            <span className="asma-cell__n">{arabicNum(x.n)}</span>
            <b className="asma-cell__name">{x.name}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
