// Forced alignment: match what was heard against the KNOWN expected ayah tokens
// (in order). This is why a Quran follow-along beats open transcription — we
// already know the text, so we align to it and tolerate small recognition errors.

export type TokenStatus = 'done' | 'current' | 'pending' | 'wrong';

// Levenshtein ≤ max? (early-exit, tokens are short).
export function closeEnough(a: string, b: string, max = 1): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > max) return false;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length] <= max;
}

export interface Alignment {
  status: TokenStatus[];
  cursor: number; // next expected index still pending
}

export function align(expected: string[], heard: string[]): Alignment {
  const status: TokenStatus[] = expected.map(() => 'pending');
  let ei = 0;
  for (const h of heard) {
    if (ei >= expected.length) break;
    if (closeEnough(h, expected[ei])) {
      status[ei] = 'done';
      ei++;
    } else if (ei + 1 < expected.length && closeEnough(h, expected[ei + 1])) {
      status[ei] = 'wrong'; // one expected word skipped/misrecited
      status[ei + 1] = 'done';
      ei += 2;
    }
    // stray heard token (noise/repeat) → ignore
  }
  if (ei < expected.length) status[ei] = 'current';
  return { status, cursor: ei };
}

export function accuracy(status: TokenStatus[]): number {
  const graded = status.filter((s) => s === 'done' || s === 'wrong').length;
  if (!graded) return 0;
  return Math.round((status.filter((s) => s === 'done').length / graded) * 100);
}
