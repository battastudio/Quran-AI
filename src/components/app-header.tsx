import { useNavigate } from 'react-router-dom';
import { Icon } from './icons';

/** App-wide header: brand on the trailing side, quick actions leading. RTL-first. */
export function AppHeader({ section }: { section: string }) {
  const nav = useNavigate();
  return (
    <header className="app-header">
      <div className="app-header__actions">
        <button className="hicon" aria-label="الإعدادات" onClick={() => nav('/settings')}>
          <Icon name="gear" size={20} />
        </button>
        <button className="hicon" aria-label="التنبيهات" onClick={() => nav('/settings')}>
          <Icon name="bell" size={20} />
        </button>
      </div>
      <div className="app-header__brand">
        <div className="app-header__titles">
          <div className="app-header__name">نور القرآن</div>
          <div className="app-header__section">{section}</div>
        </div>
        <div className="app-header__logo" aria-hidden="true">
          <Icon name="book" size={20} />
        </div>
      </div>
    </header>
  );
}
