import type { CSSProperties } from 'react';
import { toRoman } from '../data/cards';
import type { DrawnCard } from '../lib/deck';
import { CardArt } from './cardArt';

/** The patterned back shared by every card. */
export function CardBack() {
  return (
    <div className="card-back">
      <span className="card-back__pattern" />
      <svg className="card-back__emblem" viewBox="0 0 60 60" aria-hidden="true" focusable="false">
        <circle cx="30" cy="30" r="21" fill="#0B2B22" stroke="#E2B865" strokeWidth="1.2" />
        <circle cx="30" cy="30" r="17" fill="none" stroke="#E2B865" strokeWidth="0.6" strokeDasharray="1 2" />
        <path d="M30 13 33 26 46 30 33 34 30 47 27 34 14 30 27 26Z" fill="#E9C77E" />
        <path d="M30 21 31.6 28.4 39 30 31.6 31.6 30 39 28.4 31.6 21 30 28.4 28.4Z" fill="#0B2B22" />
        <circle cx="30" cy="30" r="2" fill="#E9C77E" />
      </svg>
    </div>
  );
}

/** The illustrated front of one card. Reversed cards are turned upside down. */
export function CardFace({ drawn }: { drawn: DrawnCard }) {
  const { card, reversed } = drawn;
  return (
    <div className="card-face" data-reversed={reversed || undefined}>
      <div className="card-face__frame">
        <span className="card-face__number">{toRoman(card.number)}</span>
        <CardArt id={card.id} className="card-face__art" />
        <span
          className="card-face__name"
          style={{ '--longest-word': Math.max(...card.name.split(' ').map((w) => w.length)) } as CSSProperties}
        >
          {card.name}
        </span>
      </div>
    </div>
  );
}

interface FlipCardProps {
  drawn: DrawnCard;
  flipped: boolean;
  /** Delay before this card turns, in ms. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/** A card that can turn from its back to its face. Purely visual. */
export function FlipCard({ drawn, flipped, delay = 0, className = '', style }: FlipCardProps) {
  return (
    <div
      className={`flip-card ${className}`}
      data-flipped={flipped || undefined}
      style={{ ...style, '--flip-delay': `${delay}ms` } as CSSProperties}
      aria-hidden="true"
    >
      <div className="flip-card__inner">
        <div className="flip-card__side flip-card__side--back">
          <CardBack />
        </div>
        <div className="flip-card__side flip-card__side--face">
          <CardFace drawn={drawn} />
        </div>
      </div>
    </div>
  );
}
