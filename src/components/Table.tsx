import type { CSSProperties, RefObject } from 'react';
import { SPREADS } from '../data/cards';
import type { ReadingState, Timing } from '../lib/readingMachine';
import { CardBack, FlipCard } from './TarotCard';

const STACK = [0, 1, 2, 3, 4, 5, 6];

interface TableProps {
  state: ReadingState;
  timing: Timing;
  onShuffle: () => void;
  onPick: (index: number) => void;
  deckRef: RefObject<HTMLButtonElement | null>;
  firstChoiceRef: RefObject<HTMLButtonElement | null>;
}

const ORDINALS = ['fyrsta', 'annað', 'þriðja'];

/** The table: the deck, the face-down cards to choose from, and the finished spread. */
export function Table({ state, timing, onShuffle, onPick, deckRef, firstChoiceRef }: TableProps) {
  const { phase, layout, picks, spread } = state;
  const positions = SPREADS[spread].positions;

  if (phase === 'idle' || phase === 'shuffling') {
    return (
      <div className="table table--deck" data-phase={phase}>
        <div className="deck-glow" aria-hidden="true" />
        <button
          ref={deckRef}
          type="button"
          className="deck"
          onClick={onShuffle}
          disabled={phase !== 'idle'}
          aria-label="Stokka spilin"
        >
          {STACK.map((i) => (
            <span key={i} className="deck__card" style={{ '--i': i } as CSSProperties}>
              <CardBack />
            </span>
          ))}
        </button>
      </div>
    );
  }

  if (phase === 'choosing') {
    return (
      <div className="table table--choose" data-phase={phase}>
        <ul className="choices" aria-label="Spilin á borðinu">
          {layout.map((_, i) => {
            const order = picks.indexOf(i);
            const picked = order !== -1;
            const label = picked
              ? `Spil ${i + 1}, valið sem ${ORDINALS[order] ?? `${order + 1}.`} spil`
              : `Spil ${i + 1}`;
            return (
              <li key={i} className="choices__slot" style={{ '--i': i } as CSSProperties}>
                <button
                  ref={i === 0 ? firstChoiceRef : undefined}
                  type="button"
                  className="choice"
                  data-picked={picked || undefined}
                  aria-pressed={picked}
                  aria-label={label}
                  onClick={() => onPick(i)}
                >
                  <CardBack />
                  {picked && (
                    <span className="choice__badge" aria-hidden="true">
                      {order + 1}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="table table--spread" data-phase={phase} data-count={picks.length}>
      <ol className="spread" aria-label="Spilin þín">
        {picks.map((layoutIndex, i) => {
          const drawn = layout[layoutIndex];
          const delay = timing.revealLead + i * timing.revealStagger;
          return (
            <li key={layoutIndex} className="spread__slot" style={{ '--i': i } as CSSProperties}>
              <span className="spread__position">{positions[i]?.label}</span>
              <FlipCard drawn={drawn} flipped delay={delay} />
              {drawn.reversed && (
                <span className="spread__reversed" aria-hidden="true">
                  Öfugt
                </span>
              )}
              <span className="visually-hidden">
                {positions[i]?.label}: {drawn.card.name}
                {drawn.reversed ? ', öfugt' : ''}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
