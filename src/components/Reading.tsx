import type { CSSProperties, RefObject } from 'react';
import { toRoman } from '../data/cards';
import { cardText, type ReadingLine } from '../lib/deck';

interface ReadingProps {
  lines: readonly ReadingLine[];
  headingRef: RefObject<HTMLHeadingElement | null>;
}

/** The written reading, one entry per position in the spread. */
export function Reading({ lines, headingRef }: ReadingProps) {
  return (
    <section className="reading" aria-labelledby="reading-heading">
      <h2 id="reading-heading" className="reading__heading" ref={headingRef} tabIndex={-1}>
        Lesturinn þinn
      </h2>
      <ol className="reading__list" id="reading-text">
        {lines.map(({ position, hint, drawn }, i) => (
          <li key={drawn.card.id} className="reading__item" style={{ '--i': i } as CSSProperties}>
            <p className="reading__position">
              {position}
              <span className="reading__hint"> · {hint}</span>
            </p>
            <h3 className="reading__card">
              <span className="reading__number">{toRoman(drawn.card.number)}</span> {drawn.card.name}
              {drawn.reversed && <span className="reading__reversed">Öfugt</span>}
            </h3>
            <p className="reading__keywords">{drawn.card.keywords.join(' · ')}</p>
            <p className="reading__text">{cardText(drawn)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
