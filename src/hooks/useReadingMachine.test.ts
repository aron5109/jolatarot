import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DECK } from '../data/cards';
import { FULL_MOTION_TIMING } from '../lib/readingMachine';
import { advance } from '../test/timers';
import { useReadingMachine } from './useReadingMachine';

const layout = DECK.slice(0, 9).map((card) => ({ card, reversed: false }));

describe('useReadingMachine', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('deals only once for two taps in the same frame', () => {
    const deal = vi.fn(() => layout);
    const { result } = renderHook(() => useReadingMachine({ timing: FULL_MOTION_TIMING, deal }));
    act(() => {
      result.current.shuffle();
      result.current.shuffle();
    });
    expect(deal).toHaveBeenCalledOnce();
    expect(result.current.state.phase).toBe('shuffling');
    advance(FULL_MOTION_TIMING.shuffling + 40);
    expect(result.current.state.phase).toBe('choosing');
  });

  it('clears its timer on unmount', () => {
    const { result, unmount } = renderHook(() => useReadingMachine({ timing: FULL_MOTION_TIMING, deal: () => layout }));
    act(() => {
      result.current.shuffle();
    });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
