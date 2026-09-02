import { Toggle } from '../../components';
import { useSettings } from '../../store/settings-store';
import { METHOD_NAMES } from '../prayer';
import { requestNotifyPermission } from '../notifications';

export function NotifySettings() {
  const { notify, calcMethod, adhanSound, set } = useSettings();
  const patch = (k: keyof typeof notify, v: boolean) => set({ notify: { ...notify, [k]: v } });

  return (
    <div className="stack">
      <button className="btn btn--sm" onClick={() => void requestNotifyPermission()}>
        السماح بالإشعارات
      </button>
      <Toggle label="تنبيه أوقات الصلاة" checked={notify.prayer} onChange={(v) => patch('prayer', v)} />
      <Toggle label="تشغيل الأذان صوتيًا" checked={adhanSound} onChange={(v) => set({ adhanSound: v })} />
      <Toggle label="أذكار الصباح والمساء" checked={notify.adhkar} onChange={(v) => patch('adhkar', v)} />
      <Toggle label="سورة الكهف يوم الجمعة" checked={notify.kahf} onChange={(v) => patch('kahf', v)} />
      <Toggle label="تذكير الصيام (الاثنين/الخميس)" checked={notify.fasting} onChange={(v) => patch('fasting', v)} />
      <Toggle label="تذكير مراجعة الحفظ" checked={notify.hifz} onChange={(v) => patch('hifz', v)} />
      <label className="field">
        <span>طريقة حساب المواقيت</span>
        <select value={calcMethod} onChange={(e) => set({ calcMethod: e.target.value })}>
          {Object.entries(METHOD_NAMES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </label>
      <p className="field__hint">
        ملاحظة: إشعارات الخلفية غير موثوقة في متصفّح آيفون؛ تظهر التذكيرات بأفضل جهد عند فتح التطبيق.
      </p>
    </div>
  );
}
