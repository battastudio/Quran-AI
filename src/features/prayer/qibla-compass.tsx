import { useEffect, useState } from 'react';
import { arabicNum } from '../../lib/format';

// Qibla direction as an arrow that rotates with the device heading.
// heading needs a compass sensor; without it we show the fixed bearing only.
export function QiblaCompass({ qibla }: { qibla: number }) {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const h = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
      if (h != null) setHeading(h);
    };
    window.addEventListener('deviceorientation', onOrient, true);
    return () => window.removeEventListener('deviceorientation', onOrient, true);
  }, []);

  const rotation = heading == null ? qibla : qibla - heading;
  return (
    <div className="qibla">
      <div className="qibla__dial">
        <div className="qibla__arrow" style={{ transform: `rotate(${rotation}deg)` }}>↑</div>
      </div>
      <p className="qibla__deg">اتجاه القبلة {arabicNum(Math.round(qibla))}°</p>
      {heading == null && <p className="field__hint">حرّك الجهاز لتفعيل البوصلة (قد تحتاج إذن الحسّاس).</p>}
    </div>
  );
}
