import { DECK, LAYOUT_SIZE, SPREADS, type SpreadId, type TarotCard } from '../data/cards';

export type Random = () => number;

/** A card lying on the table: which card it is and whether it came up reversed. */
export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
}

/** Chance that a drawn card comes up reversed ("öfugt"). */
export const REVERSED_CHANCE = 0.3;

/** Uniform random number in [0, 1) from the Web Crypto API, with Math.random as fallback. */
export const cryptoRandom: Random = () => {
  try {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    return buffer[0] / 4294967296;
  } catch {
    return Math.random();
  }
};

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(items: readonly T[], random: Random = cryptoRandom): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Shuffles the deck and deals `size` distinct cards face down. The outcome is
 * fixed here, once per shuffle, so which card a visitor taps decides the reading.
 */
export function dealLayout(
  random: Random = cryptoRandom,
  size: number = LAYOUT_SIZE,
  deck: readonly TarotCard[] = DECK,
): DrawnCard[] {
  return shuffle(deck, random)
    .slice(0, size)
    .map((card) => ({ card, reversed: random() < REVERSED_CHANCE }));
}

export interface ReadingLine {
  position: string;
  hint: string;
  drawn: DrawnCard;
}

export function readingLines(spread: SpreadId, layout: readonly DrawnCard[], picks: readonly number[]): ReadingLine[] {
  return SPREADS[spread].positions.flatMap((position, i) => {
    const drawn = layout[picks[i]];
    return drawn ? [{ position: position.label, hint: position.hint, drawn }] : [];
  });
}

export function cardText(drawn: DrawnCard): string {
  return drawn.reversed ? drawn.card.reversed : drawn.card.upright;
}

export function cardTitle(drawn: DrawnCard): string {
  return drawn.reversed ? `${drawn.card.name} (öfugt)` : drawn.card.name;
}

export function formatReadingForCopy(lines: readonly ReadingLine[]): string {
  const body = lines.map((line) => `${line.position}: ${cardTitle(line.drawn)}\n${cardText(line.drawn)}`).join('\n\n');
  return `Jólatarot – lesturinn minn\n\n${body}\n\n— Jólatarot`;
}
