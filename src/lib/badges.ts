export interface BadgeState {
  streak: number;
  memorized: number; // total memorized ayahs
  juz30Done: boolean; // all of juz 30 memorized
  khatmahPct: number; // 0..100
  minutes: number; // total reading minutes
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
}

export function badges(s: BadgeState): Badge[] {
  return [
    { id: 'streak7', name: 'مواظبة ٧ أيام', icon: '🔥', earned: s.streak >= 7 },
    { id: 'streak30', name: 'مواظبة ٣٠ يومًا', icon: '🏅', earned: s.streak >= 30 },
    { id: 'memo10', name: 'حفظ ١٠ آيات', icon: '🌱', earned: s.memorized >= 10 },
    { id: 'memo100', name: 'حفظ ١٠٠ آية', icon: '🌟', earned: s.memorized >= 100 },
    { id: 'juz30', name: 'حافظ جزء عمّ', icon: '📗', earned: s.juz30Done },
    { id: 'khatmah', name: 'إتمام ختمة', icon: '🕌', earned: s.khatmahPct >= 100 },
    { id: 'reader10h', name: 'قارئ ١٠ ساعات', icon: '📖', earned: s.minutes >= 600 },
  ];
}

export function earnedCount(s: BadgeState): number {
  return badges(s).filter((b) => b.earned).length;
}
