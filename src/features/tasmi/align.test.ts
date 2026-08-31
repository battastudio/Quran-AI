import { describe, expect, it } from 'vitest';
import { accuracy, align, closeEnough } from './align';

const E = ['بسم', 'الله', 'الرحمن', 'الرحيم'];

describe('align', () => {
  it('perfect recitation → all done', () => {
    const { status, cursor } = align(E, E);
    expect(status).toEqual(['done', 'done', 'done', 'done']);
    expect(cursor).toBe(4);
  });
  it('partial → matched done, next current', () => {
    const { status, cursor } = align(E, ['بسم', 'الله']);
    expect(status).toEqual(['done', 'done', 'current', 'pending']);
    expect(cursor).toBe(2);
  });
  it('tolerates a one-char slip', () => {
    expect(closeEnough('الرحمن', 'الرحمان')).toBe(true);
    const { status } = align(E, ['بسم', 'الله', 'الرحمان']);
    expect(status[2]).toBe('done');
  });
  it('marks a skipped word wrong', () => {
    const { status } = align(E, ['بسم', 'الرحمن']);
    expect(status[1]).toBe('wrong');
    expect(status[2]).toBe('done');
  });
  it('accuracy reflects done vs graded', () => {
    expect(accuracy(['done', 'wrong', 'done', 'current'])).toBe(67);
  });
});
