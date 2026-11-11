import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Background } from './components/Background';
import { Gallery } from './components/Gallery';
import { Ornament } from './components/Ornament';
import { Reading } from './components/Reading';
import { SpreadPicker } from './components/SpreadPicker';
import { Table } from './components/Table';
import { CheckIcon, CopyIcon, ShuffleIcon, SparkIcon } from './components/icons';
import { SPREADS } from './data/cards';
import { useReadingMachine } from './hooks/useReadingMachine';
import { useReducedMotion } from './hooks/useReducedMotion';
import { copyText } from './lib/clipboard';
import { cardTitle, dealLayout, formatReadingForCopy, readingLines } from './lib/deck';
import {
  FULL_MOTION_TIMING,
  REDUCED_MOTION_TIMING,
  cardsNeeded,
  type ReadingState,
} from './lib/readingMachine';

type CopyStatus = 'idle' | 'copied' | 'failed';

const COPIED_RESET_MS = 2200;
const NUMBER_WORDS = ['', 'Eitt', 'Tvö', 'Þrjú'];

function focusIsLost(): boolean {
  const active = document.activeElement as HTMLElement | null;
  return !active || active === document.body || (active as HTMLButtonElement).disabled === true;
}

function instructionFor(state: ReadingState): string {
  const spread = SPREADS[state.spread];
  switch (state.phase) {
    case 'idle':
      return state.spread === 'one'
        ? 'Stokkaðu spilin og dragðu eitt jólaspil.'
        : 'Stokkaðu spilin og veldu þrjú: aðventuna, jólin og árið 2027.';
    case 'shuffling':
      return 'Spilin eru stokkuð…';
    case 'choosing': {
      const left = cardsNeeded(state.spread) - state.picks.length;
      if (state.picks.length === 0) return `${spread.instruction}. Láttu innsæið ráða.`;
      return left === 1 ? 'Eitt spil eftir.' : `${NUMBER_WORDS[left] ?? left} spil eftir.`;
    }
    case 'revealing':
      return 'Spilin snúast við…';
    default:
      return 'Svona líta jólin þín út í spilunum.';
  }
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const timing = reducedMotion ? REDUCED_MOTION_TIMING : FULL_MOTION_TIMING;
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [announcement, setAnnouncement] = useState('');
  const copyTimer = useRef<number | undefined>(undefined);
  // Bumped on every reset so a slow clipboard write can't report on the next reading.
  const copyGeneration = useRef(0);

  const deckRef = useRef<HTMLButtonElement>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const deal = useCallback(() => dealLayout(), []);

  const onChange = useCallback((next: ReadingState) => {
    switch (next.phase) {
      case 'choosing':
        if (next.picks.length === 0) setAnnouncement(`${SPREADS[next.spread].instruction} af níu.`);
        break;
      case 'revealed': {
        const lines = readingLines(next.spread, next.layout, next.picks);
        setAnnouncement(
          `Lesturinn þinn er tilbúinn. ${lines.map((l) => `${l.position}: ${cardTitle(l.drawn)}.`).join(' ')}`,
        );
        break;
      }
      case 'resetting':
        copyGeneration.current += 1;
        window.clearTimeout(copyTimer.current);
        setCopyStatus('idle');
        setAnnouncement('');
        break;
      default:
        break;
    }
  }, []);

  const { state, shuffle, pick, reset, setSpread } = useReadingMachine({ timing, deal, onChange });
  const lines = useMemo(() => readingLines(state.spread, state.layout, state.picks), [state]);

  // Keep keyboard focus somewhere sensible as controls appear and disappear.
  useEffect(() => {
    if (state.phase === 'choosing' && state.picks.length === 0 && focusIsLost()) firstChoiceRef.current?.focus();
    if (state.phase === 'revealed' && focusIsLost()) headingRef.current?.focus();
    if (state.phase === 'idle' && state.round > 0 && focusIsLost()) deckRef.current?.focus();
  }, [state.phase, state.picks.length, state.round]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const handleCopy = useCallback(async () => {
    if (lines.length === 0) return;
    const generation = copyGeneration.current;
    const ok = await copyText(formatReadingForCopy(lines));
    if (generation !== copyGeneration.current) return;
    window.clearTimeout(copyTimer.current);
    if (ok) {
      setCopyStatus('copied');
      copyTimer.current = window.setTimeout(() => setCopyStatus('idle'), COPIED_RESET_MS);
    } else {
      setCopyStatus('failed');
      const text = document.getElementById('reading-text');
      const selection = window.getSelection();
      if (text && selection) {
        const range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [lines]);

  const { phase } = state;
  const showReading = phase === 'revealed' || phase === 'resetting';

  return (
    <>
      <Background />
      <main
        className="app"
        data-phase={phase}
        data-reduced-motion={reducedMotion || undefined}
        style={
          {
            '--shuffle-ms': `${timing.shuffling}ms`,
            '--flip-ms': `${timing.flip}ms`,
            '--lead-ms': `${timing.revealLead}ms`,
            '--reset-ms': `${timing.resetting}ms`,
          } as CSSProperties
        }
      >
        <header className="hero">
          <Ornament />
          <h1 className="title">Jólatarot</h1>
          <p className="subtitle">Spilin sem sjá jólin fyrir</p>
        </header>

        <p className="intro">Hvað segja spilin um jólin þín?</p>

        <SpreadPicker value={state.spread} disabled={phase !== 'idle'} onChange={setSpread} />

        <p className="instruction" aria-hidden={phase === 'choosing' ? undefined : true}>
          {instructionFor(state)}
        </p>

        <Table
          state={state}
          timing={timing}
          onShuffle={shuffle}
          onPick={pick}
          deckRef={deckRef}
          firstChoiceRef={firstChoiceRef}
        />

        <div className="actions">
          {(phase === 'idle' || phase === 'shuffling') && (
            <button type="button" className="btn btn--primary" onClick={shuffle} disabled={phase !== 'idle'}>
              <ShuffleIcon className="btn__icon" />
              Stokka spilin
            </button>
          )}
          {showReading && (
            <>
              <button type="button" className="btn btn--primary" onClick={reset} disabled={phase !== 'revealed'}>
                <SparkIcon className="btn__icon" />
                Ný lögn
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleCopy}
                disabled={phase !== 'revealed'}
                data-status={copyStatus}
              >
                {copyStatus === 'copied' ? <CheckIcon className="btn__icon" /> : <CopyIcon className="btn__icon" />}
                {copyStatus === 'copied' ? 'Afritað!' : 'Afrita lestur'}
              </button>
            </>
          )}
        </div>
        <p className="copy-status" role="status" aria-live="polite">
          {copyStatus === 'copied' && <span className="visually-hidden">Afritað!</span>}
          {copyStatus === 'failed' && 'Ekki tókst að afrita sjálfkrafa. Lesturinn er valinn svo þú getur afritað hann handvirkt.'}
        </p>

        {showReading && <Reading lines={lines} headingRef={headingRef} />}

        <Gallery />

        <footer className="footer">
          <p>Til gamans gert. Spilin vita margt, en ekki hvar þú lagðir símann.</p>
        </footer>

        <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </main>
    </>
  );
}
