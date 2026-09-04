import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReader } from '../store/reader-store';
import { todayAyah } from '../lib/wird';
import { Spinner } from '../components';

/** #/s/:s/:a — open the reader at a specific ayah (shared/deep link). */
export function SharedAyah() {
  const { s, a } = useParams();
  const nav = useNavigate();
  useEffect(() => {
    const surah = Math.min(114, Math.max(1, Number(s) || 1));
    const ayah = Math.max(1, Number(a) || 1);
    useReader.getState().goTo(surah, ayah);
    nav('/mushaf', { replace: true });
  }, [s, a, nav]);
  return <Spinner label="جارٍ فتح الآية…" />;
}

/** #/today — resume the ritual: last-read position, else al-Fatiha. */
export function TodayRedirect() {
  const nav = useNavigate();
  useEffect(() => {
    void todayAyah().then(({ surah, ayah }) => {
      useReader.getState().goTo(surah, ayah);
      nav('/mushaf', { replace: true });
    });
  }, [nav]);
  return <Spinner label="ورد اليوم…" />;
}
