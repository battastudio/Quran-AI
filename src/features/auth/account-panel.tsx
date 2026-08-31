import { useState } from 'react';
import { useAuth } from './auth-store';

const STATUS: Record<string, string> = {
  idle: '', syncing: 'جارٍ المزامنة…', synced: 'تمت المزامنة ✓', error: 'تعذّرت المزامنة',
};

// Settings → الحساب. Hidden entirely when Firebase isn't configured.
export function AccountPanel() {
  const { cloud, user, status, signInGoogle, signInEmail, signOutUser, sync } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isNew, setIsNew] = useState(false);

  if (!cloud)
    return <p className="field__hint">المزامنة السحابية غير مُفعّلة. تعمل بياناتك محليًّا على هذا الجهاز.</p>;

  if (user)
    return (
      <div className="stack">
        <div className="account-row">
          <span>{user.email ?? user.displayName ?? 'مسجّل الدخول'}</span>
          <span className="sync-status">{STATUS[status]}</span>
        </div>
        <button className="btn btn--sm" onClick={() => void sync()}>مزامنة الآن</button>
        <button className="link" onClick={() => void signOutUser()}>تسجيل الخروج</button>
      </div>
    );

  return (
    <div className="stack">
      <button className="btn btn--sm" onClick={() => void signInGoogle()}>الدخول بحساب Google</button>
      <input className="search-input" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="search-input" type="password" placeholder="كلمة المرور" value={pass} onChange={(e) => setPass(e.target.value)} />
      <button className="btn btn--sm" onClick={() => void signInEmail(email, pass, isNew)}>
        {isNew ? 'إنشاء حساب' : 'تسجيل الدخول'}
      </button>
      <button className="link" onClick={() => setIsNew(!isNew)}>
        {isNew ? 'لديّ حساب بالفعل' : 'إنشاء حساب جديد'}
      </button>
    </div>
  );
}
