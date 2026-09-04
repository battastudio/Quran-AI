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

// Reverent, quality-named badges with geometric (non-cartoon) motifs. No ranks,
// no shaming — the streak is «الاستمرار». (Fable §C.11)
export function badges(s: BadgeState): Badge[] {
  return [
    { id: 'streak7', name: 'بداية الاستمرار', icon: '✧', earned: s.streak >= 7 },
    { id: 'streak30', name: 'المُواظِب', icon: '✦', earned: s.streak >= 30 },
    { id: 'memo10', name: 'الغارِس', icon: '❁', earned: s.memorized >= 10 },
    { id: 'memo100', name: 'الحافِظ', icon: '❂', earned: s.memorized >= 100 },
    { id: 'juz30', name: 'حافظ جزء عمّ', icon: '◈', earned: s.juz30Done },
    { id: 'khatmah', name: 'الخاتِم', icon: '✺', earned: s.khatmahPct >= 100 },
    { id: 'reader10h', name: 'المُرتِّل', icon: '✵', earned: s.minutes >= 600 },
  ];
}

export function earnedCount(s: BadgeState): number {
  return badges(s).filter((b) => b.earned).length;
}
