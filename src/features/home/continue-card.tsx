import { Icon } from '../../components';
import { arabicNum } from '../../lib/format';

interface Props {
  surahName: string;
  ayah: number;
  juz: number;
  text: string;
  onOpen: () => void;
}

/** Resume-reading card showing the last-read ayah (sacred text from bundled data). */
export function ContinueCard({ surahName, ayah, juz, text, onOpen }: Props) {
  return (
    <button className="cont" onClick={onOpen}>
      <div className="cont__top">
        <span className="tag tag--green">تابع القراءة ›</span>
        <span className="cont__meta">{surahName} · الآية {arabicNum(ayah)}</span>
      </div>
      <p className="cont__ayah ayah__text">{text}</p>
      <div className="cont__bottom">
        <span className="cont__meta">الجزء {arabicNum(juz)}</span>
        <span className="cont__cta">
          <Icon name="book" size={16} /> مواصلة التلاوة
        </span>
      </div>
    </button>
  );
}
