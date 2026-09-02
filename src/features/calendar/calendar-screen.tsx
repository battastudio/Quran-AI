import { arabicNum } from '../../lib/format';
import { fastingReason, hijriLabel, upcomingEvents } from '../../lib/hijri';

export function CalendarScreen() {
  const label = hijriLabel();
  const fasting = fastingReason();
  const events = upcomingEvents(new Date(), 6);
  return (
    <section className="screen">
      <h1 className="screen__title">التقويم الهجري</h1>
      <div className="prayer-next"><b>{label}</b></div>
      {fasting && <p className="cal-fast">اليوم يُستحبّ صيامه ({fasting}) 🌙</p>}
      <h2 className="stats-h">مناسبات قادمة</h2>
      <ul className="cal-events">
        {events.map((e, i) => (
          <li key={i} className="cal-event">
            <span>{e.name}</span>
            <span className="cal-event__in">{e.inDays === 0 ? 'اليوم' : `بعد ${arabicNum(e.inDays)} يوم`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
