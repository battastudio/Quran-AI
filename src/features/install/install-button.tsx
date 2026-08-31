import { useState } from 'react';
import { BottomSheet, Icon } from '../../components';
import { isIOS, useInstall } from './install-store';

// Always-visible install button (hidden once the app is installed).
export function InstallButton({ block }: { block?: boolean }) {
  const { deferred, installed, promptInstall } = useInstall();
  const [help, setHelp] = useState(false);
  if (installed) return null;

  const onClick = () => (deferred ? void promptInstall() : setHelp(true));

  return (
    <>
      <button className={block ? 'btn install-btn' : 'btn btn--sm install-btn'} onClick={onClick}>
        <Icon name="download" size={18} /> تثبيت التطبيق على الجهاز
      </button>
      <BottomSheet open={help} title="تثبيت التطبيق" onClose={() => setHelp(false)}>
        {isIOS() ? (
          <ol className="install-steps">
            <li>افتح القائمة عبر زر «المشاركة» ⬆ في سفاري.</li>
            <li>اختر «أضف إلى الشاشة الرئيسية».</li>
            <li>اضغط «إضافة» — سيظهر التطبيق كأيقونة مستقلة.</li>
          </ol>
        ) : (
          <ol className="install-steps">
            <li>افتح قائمة المتصفّح (⋮).</li>
            <li>اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</li>
          </ol>
        )}
      </BottomSheet>
    </>
  );
}
