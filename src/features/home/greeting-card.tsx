import { Icon } from '../../components';

interface Props {
  name?: string | null;
  nextPrayer: string | null;
}

/** Salaam greeting + next-prayer meta + "saved" pill. */
export function GreetingCard({ name, nextPrayer }: Props) {
  return (
    <div className="greet">
      <div className="greet__row">
        <span className="greet__hi">
          <span className="greet__dot" />
          السلام عليكم{name ? `، ${name}` : ' ورحمة الله'}
        </span>
        <span className="greet__saved">
          <Icon name="cloud" size={14} /> محفوظ
        </span>
      </div>
      <div className="greet__meta">
        <span>{new Date().getHours() < 12 ? 'صباح النور' : 'مساء النور'}</span>
        {nextPrayer && (
          <span className="btn__row">
            <Icon name="clock" size={14} /> {nextPrayer}
          </span>
        )}
      </div>
    </div>
  );
}
