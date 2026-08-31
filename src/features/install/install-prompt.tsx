import { useEffect, useState } from 'react';
import { Icon } from '../../components';
import { getKv, setKv } from '../../lib/db';
import { isIOS, isStandalone, useInstall } from './install-store';

// Passive banner (dismissible). The always-on button lives in Home/Settings.
export function InstallPrompt() {
  const { deferred, promptInstall } = useInstall();
  const [dismissed, setDismissed] = useState(true);
  const iosHint = isIOS() && !isStandalone();

  useEffect(() => {
    void getKv<boolean>('installDismissed').then((d) => setDismissed(Boolean(d)));
  }, []);

  if (dismissed || isStandalone() || (!deferred && !iosHint)) return null;

  const close = () => {
    setDismissed(true);
    void setKv('installDismissed', true);
  };

  return (
    <div className="install-banner">
      {deferred ? (
        <>
          <span>ثبّت «نور القرآن» على جهازك</span>
          <button className="btn btn--sm" onClick={() => void promptInstall()}>تثبيت</button>
        </>
      ) : (
        <span>للتثبيت على آيفون: المشاركة ⬆ ثم «أضف إلى الشاشة الرئيسية»</span>
      )}
      <button className="icon-btn" aria-label="إغلاق" onClick={close}><Icon name="close" size={18} /></button>
    </div>
  );
}
