import { describe, expect, it } from 'vitest';
import { notesMarkdown } from './export';
import { grams } from './mutashabihat';

describe('notesMarkdown', () => {
  it('renders sections only when non-empty', () => {
    const md = notesMarkdown(
      [{ surah: 2, ayah: 255, folder: 'أوراد' }],
      [{ surah: 1, ayah: 1, text: 'تأمل' }],
      [{ surah: 36, ayah: 1, color: 'green' }],
    );
    expect(md).toContain('## الإشارات المرجعية');
    expect(md).toContain('(أوراد)');
    expect(md).toContain('**1:1** — تأمل');
    expect(md).toContain('(green)');
  });
  it('omits empty sections', () => {
    expect(notesMarkdown([], [], [])).not.toContain('##');
  });
});

describe('grams (mutashabihat)', () => {
  it('produces 4-word shingles', () => {
    expect(grams(['a', 'b', 'c', 'd', 'e'])).toEqual(['a b c d', 'b c d e']);
    expect(grams(['a', 'b'])).toEqual([]);
  });
});
