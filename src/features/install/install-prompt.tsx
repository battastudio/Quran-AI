import { useEffect, useState } from 'react';
import { getKv, setKv } from '../../lib/db';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
}

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as { standalone?: boolean }).standalone === true;

// Android/Chrome: native install prompt. iOS Safari: manual instructions.
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    void getKv<boolean>('installDismissed').then((d) => setDismissed(Boolean(d)));
    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener('beforeinstallprompt', onBip);
    if (isIOS() && !standalone()) setIosHint(true);
    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);

  if (dismissed || standalone() || (!deferred && !iosHint)) return null;

  const close = () => {
    setDismissed(true);
    void setKv('installDismissed', true);
  };

  return (
    <div className="install-banner">
      {deferred ? (
        <>
          <span>ثبّت «نور القرآن» على جهازك</span>
          <button className="btn btn--sm" onClick={() => void deferred.prompt()}>تثبيت</button>
        </>
      ) : (
        <span>للتثبيت على آيفون: المشاركة ⬆ ثم «أضف إلى الشاشة الرئيسية»</span>
      )}
      <button className="icon-btn" aria-label="إغلاق" onClick={close}>✕</button>
    </div>
  );
}
