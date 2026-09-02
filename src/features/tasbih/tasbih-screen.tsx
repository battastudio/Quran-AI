import { useEffect, useState } from 'react';
import { arabicNum } from '../../lib/format';
import { getKv, setKv } from '../../lib/db';
import { completeFeedback, tapFeedback } from '../../lib/haptics';

const PRESETS = ['سبحان الله', 'الحمد لله', 'الله أكبر', 'لا إله إلا الله', 'أستغفر الله'];

export function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [dhikr, setDhikr] = useState(PRESETS[0]);

  useEffect(() => { void getKv<number>('tasbihCount').then((c) => setCount(c ?? 0)); }, []);

  function tap() {
    const n = count + 1;
    setCount(n);
    void setKv('tasbihCount', n);
    if (n % target === 0) completeFeedback();
    else tapFeedback();
  }
  function reset() { setCount(0); void setKv('tasbihCount', 0); }

  return (
    <section className="screen">
      <h1 className="screen__title">المسبحة</h1>
      <div className="chips">
        {PRESETS.map((p) => <button key={p} className={dhikr === p ? 'chip chip--on' : 'chip'} onClick={() => setDhikr(p)}>{p}</button>)}
      </div>
      <p className="tasbih__dhikr">{dhikr}</p>
      <button className="tasbih__btn" onClick={tap}>
        <b>{arabicNum(count)}</b>
        <span>{arabicNum(count % target)} / {arabicNum(target)}</span>
      </button>
      <div className="tasbih__controls">
        <div className="chips">
          {[33, 100, 1000].map((t) => <button key={t} className={target === t ? 'chip chip--on' : 'chip'} onClick={() => setTarget(t)}>{arabicNum(t)}</button>)}
        </div>
        <button className="link" onClick={reset}>تصفير</button>
      </div>
    </section>
  );
}
