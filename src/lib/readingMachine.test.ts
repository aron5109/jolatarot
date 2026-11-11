import { describe, expect, it } from 'vitest';
import { DECK } from '../data/cards';
import type { DrawnCard } from './deck';
import {
  FULL_MOTION_TIMING,
  initialReadingState,
  phaseDuration,
  readingReducer,
  revealDuration,
  timedEventFor,
  type ReadingEvent,
  type ReadingState,
} from './readingMachine';

const layout: DrawnCard[] = DECK.slice(0, 9).map((card) => ({ card, reversed: false }));

function run(events: ReadingEvent[], start: ReadingState = initialReadingState) {
  return events.reduce(readingReducer, start);
}

describe('readingReducer', () => {
  it('walks a three-card reading through every phase', () => {
    let s = run([{ type: 'SHUFFLE', layout }]);
    expect(s.phase).toBe('shuffling');
    s = run([{ type: 'SHUFFLED' }], s);
    expect(s.phase).toBe('choosing');
    s = run([{ type: 'PICK', index: 4 }, { type: 'PICK', index: 0 }], s);
    expect(s.phase).toBe('choosing');
    s = run([{ type: 'PICK', index: 8 }], s);
    expect(s.phase).toBe('revealing');
    expect(s.picks).toEqual([4, 0, 8]);
    s = run([{ type: 'REVEALED' }, { type: 'RESET' }], s);
    expect(s.phase).toBe('resetting');
    s = run([{ type: 'RESET_DONE' }], s);
    expect(s).toEqual({ ...initialReadingState, round: 1 });
  });

  it('reveals a one-card reading after the first pick and keeps the spread', () => {
    const s = run([
      { type: 'SET_SPREAD', spread: 'one' },
      { type: 'SHUFFLE', layout },
      { type: 'SHUFFLED' },
      { type: 'PICK', index: 3 },
    ]);
    expect(s.phase).toBe('revealing');
    expect(s.picks).toEqual([3]);
    const after = run([{ type: 'REVEALED' }, { type: 'RESET' }, { type: 'RESET_DONE' }], s);
    expect(after.spread).toBe('one');
  });

  it('ignores duplicate, out-of-range and extra picks', () => {
    const choosing = run([{ type: 'SHUFFLE', layout }, { type: 'SHUFFLED' }]);
    const once = run([{ type: 'PICK', index: 2 }], choosing);
    expect(readingReducer(once, { type: 'PICK', index: 2 })).toBe(once);
    expect(readingReducer(once, { type: 'PICK', index: 9 })).toBe(once);
    expect(readingReducer(once, { type: 'PICK', index: -1 })).toBe(once);
    expect(readingReducer(once, { type: 'PICK', index: 1.5 })).toBe(once);
    const revealing = run([{ type: 'PICK', index: 3 }, { type: 'PICK', index: 4 }], once);
    expect(readingReducer(revealing, { type: 'PICK', index: 5 })).toBe(revealing);
  });

  it('returns the same state for events that do not apply', () => {
    const s = initialReadingState;
    for (const e of [{ type: 'SHUFFLED' }, { type: 'PICK', index: 0 }, { type: 'REVEALED' }, { type: 'RESET' }, { type: 'RESET_DONE' }] as ReadingEvent[]) {
      expect(readingReducer(s, e)).toBe(s);
    }
    const shuffling = run([{ type: 'SHUFFLE', layout }]);
    expect(readingReducer(shuffling, { type: 'SHUFFLE', layout })).toBe(shuffling);
    expect(readingReducer(shuffling, { type: 'SET_SPREAD', spread: 'one' })).toBe(shuffling);
    expect(readingReducer(s, { type: 'SET_SPREAD', spread: 'three' })).toBe(s);
  });

  it('refuses a layout too small for the spread', () => {
    expect(readingReducer(initialReadingState, { type: 'SHUFFLE', layout: layout.slice(0, 2) })).toBe(
      initialReadingState,
    );
  });
});

describe('timing', () => {
  it('times only the automatic phases', () => {
    expect(timedEventFor('idle')).toBeNull();
    expect(timedEventFor('choosing')).toBeNull();
    expect(timedEventFor('revealed')).toBeNull();
    expect(phaseDuration(initialReadingState, FULL_MOTION_TIMING)).toBeNull();
  });

  it('keeps a three-card reveal under two and a half seconds', () => {
    expect(revealDuration(FULL_MOTION_TIMING, 3)).toBeLessThan(2500);
    expect(revealDuration(FULL_MOTION_TIMING, 1)).toBeLessThan(revealDuration(FULL_MOTION_TIMING, 3));
  });
});
