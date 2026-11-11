import { SPREADS, type SpreadId } from '../data/cards';
import type { DrawnCard } from './deck';

/** idle → shuffling → choosing → revealing → revealed → resetting → idle */
export type ReadingPhase = 'idle' | 'shuffling' | 'choosing' | 'revealing' | 'revealed' | 'resetting';

export interface ReadingState {
  phase: ReadingPhase;
  spread: SpreadId;
  /** Face-down cards dealt for this reading. Fixed when the deck is shuffled. */
  layout: readonly DrawnCard[];
  /** Indices into `layout`, in the order the visitor chose them. */
  picks: readonly number[];
  /** Increases every time the table is cleared. */
  round: number;
}

export type ReadingEvent =
  | { type: 'SET_SPREAD'; spread: SpreadId }
  | { type: 'SHUFFLE'; layout: readonly DrawnCard[] }
  | { type: 'SHUFFLED' }
  | { type: 'PICK'; index: number }
  | { type: 'REVEALED' }
  | { type: 'RESET' }
  | { type: 'RESET_DONE' };

export const initialReadingState: ReadingState = {
  phase: 'idle',
  spread: 'three',
  layout: [],
  picks: [],
  round: 0,
};

export function cardsNeeded(spread: SpreadId): number {
  return SPREADS[spread].positions.length;
}

/**
 * Pure transition function. Events that are not valid in the current phase
 * return the exact same state object, so repeated taps are harmless.
 */
export function readingReducer(state: ReadingState, event: ReadingEvent): ReadingState {
  switch (state.phase) {
    case 'idle':
      if (event.type === 'SET_SPREAD') return event.spread === state.spread ? state : { ...state, spread: event.spread };
      if (event.type === 'SHUFFLE' && event.layout.length >= cardsNeeded(state.spread)) {
        return { ...state, phase: 'shuffling', layout: event.layout, picks: [] };
      }
      return state;
    case 'shuffling':
      return event.type === 'SHUFFLED' ? { ...state, phase: 'choosing' } : state;
    case 'choosing': {
      if (event.type !== 'PICK') return state;
      const { index } = event;
      if (!Number.isInteger(index) || index < 0 || index >= state.layout.length || state.picks.includes(index)) {
        return state;
      }
      const picks = [...state.picks, index];
      return { ...state, picks, phase: picks.length === cardsNeeded(state.spread) ? 'revealing' : 'choosing' };
    }
    case 'revealing':
      return event.type === 'REVEALED' ? { ...state, phase: 'revealed' } : state;
    case 'revealed':
      return event.type === 'RESET' ? { ...state, phase: 'resetting' } : state;
    case 'resetting':
      return event.type === 'RESET_DONE'
        ? { ...initialReadingState, spread: state.spread, round: state.round + 1 }
        : state;
  }
}

export interface Timing {
  shuffling: number;
  /** Before the first card turns. */
  revealLead: number;
  /** Gap between one card turning and the next. */
  revealStagger: number;
  /** How long one card takes to turn. */
  flip: number;
  resetting: number;
}

export const FULL_MOTION_TIMING: Timing = {
  shuffling: 1250,
  revealLead: 450,
  revealStagger: 520,
  flip: 760,
  resetting: 480,
};

export const REDUCED_MOTION_TIMING: Timing = {
  shuffling: 120,
  revealLead: 0,
  revealStagger: 0,
  flip: 220,
  resetting: 160,
};

export function revealDuration(timing: Timing, cards: number): number {
  return timing.revealLead + Math.max(0, cards - 1) * timing.revealStagger + timing.flip;
}

/** How long a timed phase lasts, or null for phases that wait for the visitor. */
export function phaseDuration(state: ReadingState, timing: Timing): number | null {
  switch (state.phase) {
    case 'shuffling':
      return timing.shuffling;
    case 'revealing':
      return revealDuration(timing, cardsNeeded(state.spread));
    case 'resetting':
      return timing.resetting;
    default:
      return null;
  }
}

export function timedEventFor(phase: ReadingPhase): ReadingEvent | null {
  switch (phase) {
    case 'shuffling':
      return { type: 'SHUFFLED' };
    case 'revealing':
      return { type: 'REVEALED' };
    case 'resetting':
      return { type: 'RESET_DONE' };
    default:
      return null;
  }
}
