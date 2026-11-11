import { describe, expect, it } from 'vitest';
import { DECK, LAYOUT_SIZE, SPREADS, toRoman } from './cards';

describe('the deck', () => {
  it('has 22 cards numbered 0 to 21 in order', () => {
    expect(DECK).toHaveLength(22);
    DECK.forEach((card, i) => expect(card.number).toBe(i));
  });

  it('has unique ids, names and readings', () => {
    const all = DECK.flatMap((c) => [c.upright, c.reversed]);
    expect(new Set(DECK.map((c) => c.id)).size).toBe(DECK.length);
    expect(new Set(DECK.map((c) => c.name)).size).toBe(DECK.length);
    expect(new Set(all).size).toBe(all.length);
  });

  it('keeps readings tidy and short', () => {
    for (const card of DECK) {
      expect(card.keywords).toHaveLength(3);
      for (const text of [card.upright, card.reversed]) {
        expect(text.length).toBeLessThanOrEqual(160);
        expect(text).toMatch(/[.!?]$/);
        expect(text).not.toMatch(/\s{2}|^\s|\s$/);
      }
    }
  });

  it('deals enough cards for every spread', () => {
    for (const spread of Object.values(SPREADS)) {
      expect(spread.positions.length).toBeLessThanOrEqual(LAYOUT_SIZE);
    }
  });
});

describe('toRoman', () => {
  it.each([
    [0, '0'],
    [4, 'IV'],
    [9, 'IX'],
    [14, 'XIV'],
    [19, 'XIX'],
    [21, 'XXI'],
  ])('%i → %s', (n, roman) => expect(toRoman(n)).toBe(roman));
});
