import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DECK } from './data/cards';
import { advance } from './test/timers';

const READINGS = new Set(DECK.flatMap((c) => [c.upright, c.reversed]));

async function flushPromises() {
  await act(async () => {
    await Promise.resolve();
  });
}

function choices() {
  return within(screen.getByRole('list', { name: 'Spilin á borðinu' })).getAllByRole('button');
}

function readingTexts(): string[] {
  return Array.from(document.querySelectorAll('.reading__text')).map((p) => p.textContent ?? '');
}

function shuffleAndWait() {
  fireEvent.click(screen.getAllByRole('button', { name: 'Stokka spilin' })[0]);
  advance(1400);
}

describe('App', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the Icelandic landing composition', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Jólatarot' })).toBeInTheDocument();
    expect(screen.getByText('Spilin sem sjá jólin fyrir')).toBeInTheDocument();
    expect(screen.getByText('Hvað segja spilin um jólin þín?')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Stokka spilin' })).toHaveLength(2);
    expect(screen.getByRole('radio', { name: 'Þrjú spil' })).toBeChecked();
  });

  it('shuffles, lets the visitor pick three cards and reveals the reading', () => {
    render(<App />);
    shuffleAndWait();
    const cards = choices();
    expect(cards).toHaveLength(9);

    fireEvent.click(cards[2]);
    fireEvent.click(cards[2]);
    expect(cards[2]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Tvö spil eftir.')).toBeInTheDocument();
    fireEvent.click(cards[5]);
    fireEvent.click(cards[8]);

    advance(2400);
    expect(screen.getByRole('heading', { name: 'Lesturinn þinn' })).toHaveFocus();
    const texts = readingTexts();
    expect(texts).toHaveLength(3);
    texts.forEach((t) => expect(READINGS.has(t)).toBe(true));
    expect(screen.getByText(/Lesturinn þinn er tilbúinn\. Aðventan: .+\. Jólin: .+\. Árið 2027: .+\./)).toBeInTheDocument();
  });

  it('starts a new reading after "Ný lögn"', () => {
    render(<App />);
    shuffleAndWait();
    choices().slice(0, 3).forEach((c) => fireEvent.click(c));
    advance(2400);
    fireEvent.click(screen.getByRole('button', { name: /Ný lögn/ }));
    advance(600);
    expect(screen.queryByRole('heading', { name: 'Lesturinn þinn' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Stokka spilin' })[0]).toHaveFocus();

    shuffleAndWait();
    expect(choices()).toHaveLength(9);
  });

  it('draws a single card when "Eitt spil" is chosen', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('radio', { name: 'Eitt spil' }));
    shuffleAndWait();
    fireEvent.click(choices()[4]);
    advance(1400);
    expect(readingTexts()).toHaveLength(1);
    expect(screen.getByText('Jólaspilið þitt', { selector: '.reading__position' })).toBeInTheDocument();
  });

  it('locks the spread picker while a reading is in progress', () => {
    render(<App />);
    shuffleAndWait();
    expect(screen.getByRole('radio', { name: 'Eitt spil' })).toBeDisabled();
  });

  it('moves keyboard focus to the first card once they are dealt', () => {
    render(<App />);
    const deck = screen.getAllByRole('button', { name: 'Stokka spilin' })[0];
    deck.focus();
    fireEvent.click(deck);
    advance(1400);
    expect(choices()[0]).toHaveFocus();
  });

  it('copies the reading and confirms with "Afritað!"', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<App />);
    shuffleAndWait();
    choices().slice(0, 3).forEach((c) => fireEvent.click(c));
    advance(2400);

    fireEvent.click(screen.getByRole('button', { name: /Afrita lestur/ }));
    await flushPromises();
    expect(writeText).toHaveBeenCalledOnce();
    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toMatch(/^Jólatarot – lesturinn minn/);
    readingTexts().forEach((t) => expect(copied).toContain(t));
    expect(screen.getByRole('button', { name: /Afritað!/ })).toBeInTheDocument();
    advance(2300);
    expect(screen.getByRole('button', { name: /Afrita lestur/ })).toBeInTheDocument();
  });

  it('explains when copying fails', async () => {
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('nei')) },
      configurable: true,
    });
    render(<App />);
    shuffleAndWait();
    choices().slice(0, 3).forEach((c) => fireEvent.click(c));
    advance(2400);
    fireEvent.click(screen.getByRole('button', { name: /Afrita lestur/ }));
    await flushPromises();
    expect(screen.getByText(/Ekki tókst að afrita sjálfkrafa/)).toBeInTheDocument();
  });

  it('uses short timings with reduced motion', () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    try {
      render(<App />);
      expect(document.querySelector('main')).toHaveAttribute('data-reduced-motion', 'true');
      fireEvent.click(screen.getAllByRole('button', { name: 'Stokka spilin' })[0]);
      advance(200);
      choices().slice(0, 3).forEach((c) => fireEvent.click(c));
      advance(300);
      expect(readingTexts()).toHaveLength(3);
    } finally {
      window.matchMedia = original;
    }
  });

  it('lists all 22 cards in the gallery', () => {
    render(<App />);
    expect(document.querySelectorAll('.gallery__item')).toHaveLength(22);
  });
});
