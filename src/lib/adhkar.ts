// Infer a dhikr's repetition target from its Arabic text (best-effort; default 1).
const WORD_RULES: [RegExp, number][] = [
  [/مئة|مائة/, 100],
  [/ثلاث\S*\s*وثلاث/, 33],
  [/أربع\S*\s*وثلاث/, 34],
  [/عشر/, 10],
  [/سبع/, 7],
  [/خمس/, 5],
  [/ثلاث/, 3],
  [/مرتين|مرّتين/, 2],
];

const AR_DIGIT = /[٠-٩]/;
const arToNum = (s: string) => Number(s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))));

export function targetCount(text: string): number {
  const digits = text.match(/([0-9٠-٩]{1,3})\s*مر/); // "٣ مرات" / "3 مرات"
  if (digits) return AR_DIGIT.test(digits[1]) ? arToNum(digits[1]) : Number(digits[1]);
  for (const [re, n] of WORD_RULES) if (re.test(text)) return n;
  return 1;
}
