import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpreadId } from '../data/cards';
import type { DrawnCard } from '../lib/deck';
import {
  initialReadingState,
  phaseDuration,
  readingReducer,
  timedEventFor,
  type ReadingEvent,
  type ReadingState,
  type Timing,
} from '../lib/readingMachine';

interface Options {
  timing: Timing;
  deal: () => DrawnCard[];
  onChange?: (next: ReadingState, previous: ReadingState) => void;
}

/**
 * Drives the reading state machine. A ref mirrors the state synchronously so two
 * taps in the same frame can never shuffle twice or pick a fourth card, and each
 * timed phase owns exactly one timer, cleared when the phase ends or on unmount.
 */
export function useReadingMachine({ timing, deal, onChange }: Options) {
  const [state, setState] = useState<ReadingState>(initialReadingState);
  const stateRef = useRef(state);
  const onChangeRef = useRef(onChange);
  const timingRef = useRef(timing);

  useEffect(() => {
    onChangeRef.current = onChange;
    timingRef.current = timing;
  });

  const send = useCallback((event: ReadingEvent) => {
    const previous = stateRef.current;
    const next = readingReducer(previous, event);
    if (next === previous) return false;
    stateRef.current = next;
    setState(next);
    onChangeRef.current?.(next, previous);
    return true;
  }, []);

  useEffect(() => {
    const event = timedEventFor(state.phase);
    const duration = phaseDuration(stateRef.current, timingRef.current);
    if (!event || duration === null) return;
    const timer = window.setTimeout(() => send(event), duration);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.round, send]);

  const shuffle = useCallback(() => {
    if (stateRef.current.phase !== 'idle') return false;
    return send({ type: 'SHUFFLE', layout: deal() });
  }, [deal, send]);

  const pick = useCallback((index: number) => send({ type: 'PICK', index }), [send]);
  const reset = useCallback(() => send({ type: 'RESET' }), [send]);
  const setSpread = useCallback((spread: SpreadId) => send({ type: 'SET_SPREAD', spread }), [send]);

  return { state, shuffle, pick, reset, setSpread };
}
