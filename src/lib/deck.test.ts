import { describe, expect, it } from 'vitest';
import { DECK } from '../data/cards';
import { cardText, cardTitle, cryptoRandom, dealLayout, formatReadingForCopy, readingLines, shuffle } from './deck';

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a * 1664525 + 1013904223) % 4294967296;
    return a / 4294967296;
  };
}

describe('shuffle', () => {
  it('returns a permutation without touching the input', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const out = shuffle(input, seeded(1));
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...out].sort()).toEqual(input);
  });
});

describe('dealLayout', () => {
  it('deals nine distinct cards', () => {
    for (let seed = 1; seed < 50; seed += 1) {
      const layout = dealLayout(seeded(seed));
      expect(layout).toHaveLength(9);
      expect(new Set(layout.map((d) => d.card.id)).size).toBe(9);
    }
  });

  it('reverses cards only below the reversed chance', () => {
    expect(dealLayout(() => 0.99).every((d) => !d.reversed)).toBe(true);
    expect(dealLayout(() => 0).every((d) => d.reversed)).toBe(true);
  });

  it('eventually deals every card', () => {
    const seen = new Set<string>();
    const random = seeded(7);
    for (let i = 0; i < 200; i += 1) dealLayout(random).forEach((d) => seen.add(d.card.id));
    expect(seen.size).toBe(DECK.length);
  });

  it('crypto random stays in [0, 1)', () => {
    for (let i = 0; i < 100; i += 1) {
      const n = cryptoRandom();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});

describe('reading text', () => {
  const layout = [
    { card: DECK[0], reversed: false },
    { card: DECK[6], reversed: true },
    { card: DECK[21], reversed: false },
  ];

  it('maps picks to positions in the order they were chosen', () => {
    const lines = readingLines('three', layout, [2, 0, 1]);
    expect(lines.map((l) => [l.position, l.drawn.card.name])).toEqual([
      ['Aðventan', 'Nýja árið'],
      ['Jólin', 'Jólakötturinn'],
      ['Árið 2027', 'Möndlugrauturinn'],
    ]);
  });

  it('uses the reversed reading for reversed cards', () => {
    expect(cardText(layout[1])).toBe(DECK[6].reversed);
    expect(cardTitle(layout[1])).toBe('Möndlugrauturinn (öfugt)');
    expect(cardText(layout[0])).toBe(DECK[0].upright);
  });

  it('formats a copyable reading', () => {
    const text = formatReadingForCopy(readingLines('one', layout, [1]));
    expect(text).toContain('Jólaspilið þitt: Möndlugrauturinn (öfugt)');
    expect(text).toContain(DECK[6].reversed);
    expect(text.endsWith('— Jólatarot')).toBe(true);
  });
});
