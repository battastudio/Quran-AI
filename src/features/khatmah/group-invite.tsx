import { useState } from 'react';
import { arabicNum } from '../../lib/format';
import { groupLink } from './group';

/** Create a shareable group-khatmah invite link (no backend). */
export function GroupInvite() {
  const [title, setTitle] = useState('');
  const [size, setSize] = useState(30);

  async function share() {
    const link = groupLink({ t: title.trim() || 'ختمة جماعية', n: size });
    const text = `انضمّ إلى ختمتنا الجماعية «${title.trim() || 'ختمة جماعية'}» — اختر جزءك:\n${link}`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch { /* cancelled */ } }
    await navigator.clipboard?.writeText(text);
  }

  return (
    <div className="ach-card" style={{ marginTop: 16 }}>
      <div className="ach-card__title">ختمة جماعية</div>
      <p className="ach-card__body">وزّع الأجزاء على أهلك أو حلقتك برابط واحد — بلا حساب ولا خادم.</p>
      <input className="search-input" placeholder="اسم الختمة (مثلاً: ختمة العائلة)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="field">
        <span>عدد المشاركين: {arabicNum(size)}</span>
        <input type="range" min={2} max={30} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </label>
      <button className="btn btn--sm" onClick={() => void share()}>أنشئ الرابط وشارك</button>
    </div>
  );
}
