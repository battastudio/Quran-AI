import { MicButton } from './mic-button';
import { AccuracyRing } from './accuracy-ring';
import { Waveform } from './waveform';

interface Props {
  active: boolean;
  accuracy: number;
  onToggle: () => void;
  disabled?: boolean;
  status?: string;
}

// Floating "التسميع المباشر" bar: waveform + accuracy + big mic. Sits above tabs.
export function TasmiLiveBar({ active, accuracy, onToggle, disabled, status }: Props) {
  return (
    <div className="tasmi-bar">
      <span className="tasmi-bar__label">التسميع المباشر</span>
      <div className="tasmi-bar__row">
        <AccuracyRing value={accuracy} />
        <div className="tasmi-bar__wave">
          {active ? <Waveform active /> : <span className="field__hint">{status ?? 'اضغط الميكروفون وابدأ التلاوة'}</span>}
        </div>
        <MicButton active={active} onClick={onToggle} disabled={disabled} />
      </div>
    </div>
  );
}
