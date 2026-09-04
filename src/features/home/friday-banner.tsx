import { Icon } from '../../components';

/** Sunnah-of-the-day nudge: read al-Kahf (opens surah 18). */
export function FridayBanner({ onKahf }: { onKahf: () => void }) {
  return (
    <button className="friday" onClick={onKahf}>
      <span className="friday__icon"><Icon name="book" size={20} /></span>
      <span className="friday__body">
        <b>جمعة مباركة · سُنّة اليوم</b>
        <span>نوّر ما بين الجمعتين — اقرأ سورة الكهف</span>
      </span>
      <Icon name="prev" size={20} />
    </button>
  );
}
