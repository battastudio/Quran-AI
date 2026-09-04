// Shared framer-motion variants (Fable §D.6). Import these instead of inlining
// transitions so motion is consistent and honours prefers-reduced-motion.
import { useReducedMotion } from 'framer-motion';

export const pageEnter = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.2, ease: [0.2, 0, 0, 1] as const },
};

export const ayahReveal = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.48 },
};

export const sheetUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: 0.24, ease: [0.05, 0.7, 0.1, 1] as const },
};

export const crossFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const press = { whileTap: { scale: 0.98 }, transition: { duration: 0.12 } };

export const barFill = (w: number) => ({
  initial: { width: 0 },
  animate: { width: `${w}%` },
  transition: { duration: 0.32, ease: [0.2, 0, 0, 1] as const },
});

export const ringFill = (p: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: p },
  transition: { duration: 0.48, ease: [0.05, 0.7, 0.1, 1] as const },
});

export const staggerIn = { animate: { transition: { staggerChildren: 0.06 } } };

export const chromeHide = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: -56, opacity: 0 },
  transition: { duration: 0.2 },
};

/** Returns transitions collapsed to ~0 when the user prefers reduced motion. */
export function useMotionOK(): boolean {
  return !useReducedMotion();
}
