import { BottomSheet, Icon } from '../../components';
import { useInvite, shareApp } from './invite';

/** One-time da'wah invite, shown after the first completed wird (§A.4). */
export function InviteSheet() {
  const { open, close } = useInvite();
  return (
    <BottomSheet open={open} title="ادعُ من تحب" onClose={close}>
      <p className="t-md" style={{ lineHeight: 1.9, marginTop: 0 }}>
        كل حرف يُقرأ بسببك أجرٌ لك. شارك التطبيق — صدقة جارية 🤍
      </p>
      <div className="stack">
        <button className="btn btn--block" onClick={async () => { await shareApp(); close(); }}>
          <span className="btn__row"><Icon name="share" size={18} /> مشاركة التطبيق</span>
        </button>
        <button className="link" onClick={close}>ليس الآن</button>
      </div>
    </BottomSheet>
  );
}
