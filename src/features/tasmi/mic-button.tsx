import { motion } from 'framer-motion';
import { Icon } from '../../components';

// Big animated mic — pulses while listening.
export function MicButton({ active, onClick, disabled }: { active: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button className={active ? 'mic mic--on' : 'mic'} onClick={onClick} disabled={disabled} aria-label={active ? 'إيقاف' : 'ابدأ'}>
      {active && (
        <motion.span
          className="mic__pulse"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
      <Icon name={active ? 'pause' : 'mic'} size={30} />
    </button>
  );
}
