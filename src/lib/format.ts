const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

// Western digits → Arabic-Indic (for ayah numbers, counts).
export function arabicNum(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => AR_DIGITS[+d]);
}

// End-of-ayah ornament with the ayah number inside.
export function ayahMark(n: number): string {
  return `۝${arabicNum(n)}`;
}
