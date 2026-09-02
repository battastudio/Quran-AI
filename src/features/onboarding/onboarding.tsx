import { useEffect, useState } from 'react';
import { getKv, setKv } from '../../lib/db';
import { currentCoords } from '../../lib/geo';
import { requestNotifyPermission } from '../notifications';
import { useSettings } from '../../store/settings-store';
import { ReciterPicker } from '../audio';

// One-time first-run overlay: reciter + permissions.
export function Onboarding() {
  const [show, setShow] = useState(false);
  const reciter = useSettings((s) => s.reciter);
  const set = useSettings((s) => s.set);

  useEffect(() => {
    void getKv<boolean>('onboarded').then((d) => setShow(!d));
  }, []);

  if (!show) return null;
  const done = () => {
    void setKv('onboarded', true);
    setShow(false);
  };

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <h2>نور القرآن</h2>
        <p className="field__hint">مصحف يعمل دون إنترنت: قراءة، تلاوة، تفسير، مواقيت الصلاة والحفظ.</p>
        <div className="field">
          <span>اختر القارئ المفضّل</span>
          <ReciterPicker value={reciter} onChange={(id) => set({ reciter: id })} />
        </div>
        <button className="btn btn--sm" onClick={() => currentCoords().catch(() => {})}>تفعيل مواقيت الصلاة (الموقع)</button>
        <button className="btn btn--sm" onClick={() => void requestNotifyPermission()}>تفعيل التنبيهات</button>
        <button className="btn" onClick={done}>ابدأ</button>
      </div>
    </div>
  );
}
