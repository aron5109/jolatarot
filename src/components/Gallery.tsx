import { DECK } from '../data/cards';
import { CardFace } from './TarotCard';

/** All 22 cards, upright, with their keywords. */
export function Gallery() {
  return (
    <details className="gallery">
      <summary className="gallery__summary">Skoða öll 22 spilin</summary>
      <ul className="gallery__grid">
        {DECK.map((card) => (
          <li key={card.id} className="gallery__item">
            <div className="gallery__card" aria-hidden="true">
              <CardFace drawn={{ card, reversed: false }} />
            </div>
            <p className="gallery__name">{card.name}</p>
            <p className="gallery__keywords">{card.keywords.join(' · ')}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}
