import { describe, expect, it } from 'vitest';
import { targetCount } from './adhkar';

describe('targetCount', () => {
  it('detects 100', () => expect(targetCount('سبحان الله مئة مرة')).toBe(100));
  it('detects 33', () => expect(targetCount('سبحان الله ثلاثًا وثلاثين')).toBe(33));
  it('detects 3 / 7', () => {
    expect(targetCount('يقولها ثلاث مرات')).toBe(3);
    expect(targetCount('سبع مرات')).toBe(7);
  });
  it('detects Arabic-indic digits', () => expect(targetCount('يكرر ٣ مرات')).toBe(3));
  it('defaults to 1', () => expect(targetCount('لا إله إلا الله')).toBe(1));
});
