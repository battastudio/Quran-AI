import { Icon } from '../../components';
import { arabicNum } from '../../lib/format';

interface Props {
  due: number;
  wirdPct: number | null; // null = no khatmah plan yet
  wird?: { done: number; total: number } | null; // today's page range from the wird engine
  onReview: () => void;
  onWird: () => void;
}

/** Side-by-side: hifz review due + today's wird progress. */
export function ReviewWird({ due, wirdPct, wird, onReview, onWird }: Props) {
  return (
    <div className="home-duo">
      <div className="duo-card duo-card--review">
        <div className="duo-card__top">
          <span className="duo-card__title"><Icon name="check" size={16} /> مراجعة الحفظ</span>
          <span className="tag">مستحق</span>
        </div>
        <div className="duo-card__big">{arabicNum(due)} آية مستحقّة</div>
        <button className="duo-card__cta" onClick={onReview}>ابدأ المراجعة</button>
      </div>
      <button className="duo-card duo-card--wird" onClick={onWird}>
        <div className="duo-card__top">
          <span className="duo-card__title"><Icon name="book" size={16} /> ورد اليوم</span>
          {wirdPct !== null && <span className="tag">{arabicNum(wirdPct)}٪</span>}
        </div>
        {wirdPct !== null ? (
          <>
            {wird && <span className="duo-card__big">{arabicNum(wird.done)} من {arabicNum(wird.total)} صفحات</span>}
            <div className="bar-line"><span className="bar-line__fill" style={{ width: `${wird ? Math.round((wird.done / wird.total) * 100) : wirdPct}%` }} /></div>
            <span className="duo-card__hint">متابعة الورد ›</span>
          </>
        ) : (
          <span className="duo-card__hint">ابدأ ختمة ›</span>
        )}
      </button>
    </div>
  );
}
