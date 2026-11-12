# Jólatarot

**Spilin sem sjá jólin fyrir.** Jólatarot is an interactive Icelandic Christmas tarot for staff. Visitors shuffle a deck of 22 original Christmas cards, pick one or three cards from nine laid face down, and watch them turn over to reveal a funny, warm reading in Icelandic for Aðventan, Jólin and Árið 2027.

No login, no backend, no personal data. It is a static site hosted on GitHub Pages, built in the same way as its sibling [Jólakexið](https://github.com/aron5109/jolakexid).

Intended URL: **https://aron5109.github.io/jolatarot/**

---

## Tech stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite (`base: '/jolatarot/'`) |
| Styling | Modern CSS with custom properties, inline SVG and CSS animation (no animation library) |
| Fonts | EB Garamond in true small caps on every card (Renaissance roman), Playfair Display and Manrope for the page; all self-hosted in `src/assets/fonts` (SIL OFL) |
| Tests | Vitest + Testing Library (jsdom) |
| Quality | ESLint (typescript-eslint, react-hooks) and `tsc` |

The only runtime dependencies are `react` and `react-dom`. Nothing is fetched from external fonts, images, analytics or APIs at runtime. All card art is hand-drawn SVG in `src/components/cardArt.tsx`.

## Local development

Requires Node 22 (see `.nvmrc`).

```bash
npm ci            # install exactly what package-lock.json pins
npm run dev       # dev server: http://localhost:5173/jolatarot/
npm run build     # production build into dist/
npm run preview   # serve the production build: http://localhost:4173/jolatarot/
```

## Testing

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # Vitest, single run
npm run check       # all of the above
```

The suite covers the deck (22 cards numbered 0–XXI, unique and tidy readings), dealing (distinct cards, reversed cards, every card reachable), the state machine (every transition, duplicate and extra picks ignored), the hook (one deal per double tap, timers cleaned up) and the app end to end (one- and three-card readings, new reading, copy success and failure, keyboard focus, reduced motion).

## How a reading works

A small, pure state machine in `src/lib/readingMachine.ts`:

```
idle → shuffling → choosing → revealing → revealed → resetting → idle
```

1. **Stokka spilin**: the deck riffles (about 1.25 s). The nine cards on the table are dealt once, here, from a Fisher–Yates shuffle using `crypto.getRandomValues`. Each card has a 30% chance of coming up reversed ("öfugt").
2. **Choosing**: the nine face-down cards are laid out (two rows on phones, an arc on larger screens). Each tap picks one card; picks are final and numbered.
3. **Revealing**: once the spread is complete, the chosen cards move into their positions and turn over one by one (about 2.2 s for three cards).
4. **Revealed**: the written reading appears with "Ný lögn" and "Afrita lestur".

`useReadingMachine` mirrors the state in a ref, so taps in the same frame can't shuffle twice or pick an extra card, and each timed phase owns one timer that is cleared when the phase changes or the component unmounts.

## Editing the cards

All cards and spreads live in **`src/data/cards.ts`**. Each card has a number, a name, three keywords, an upright reading and a reversed reading. Its emblem is in `src/components/cardArt.tsx` under the same id. The card typeface is EB Garamond (from [octaviopardo/EBGaramond12](https://github.com/octaviopardo/EBGaramond12)), subset to Latin-1 with its OpenType small caps (`smcp`, `c2sc`) kept, and set with `font-variant-caps: small-caps` and `font-synthesis: none`, so the small caps are the real drawn ones, never faked. Spread positions (Aðventan, Jólin, Árið 2027, and Jólaspilið þitt for one card) are in `SPREADS`.

Guidelines (enforced in part by the tests):

- Readings are 160 characters or fewer and end with punctuation.
- Avoid words that inflect for the reader's gender, so every reading fits everyone.
- No jokes about specific colleagues, protected characteristics or sensitive circumstances.

## Accessibility

- `lang="is"`, semantic HTML, every control is a native `<button>` or radio input with visible focus.
- Focus moves to the first card when cards are dealt, to the "Lesturinn þinn" heading when the reading is ready, and back to the deck after a new reading.
- The finished reading and "Afritað!" are announced through `aria-live` regions.
- With `prefers-reduced-motion: reduce`, shuffling, dealing and flipping become short fades, and the snow, aurora and twinkling stop.
- Touch targets are at least 44 px and text contrast meets WCAG AA.

## GitHub Pages deployment

`.github/workflows/deploy.yml` uses only official GitHub actions: `npm ci`, typecheck, lint, tests, `npm run build`, then `actions/upload-pages-artifact` and `actions/deploy-pages`. Pull requests only validate and build; deployment runs on every push to `main` (or via *Run workflow*). The build job has `contents: read`; only the deploy job gets `pages: write` and `id-token: write`.

### One-time manual GitHub settings

1. **Settings → Pages → Build and deployment → Source: "GitHub Actions".**
2. If the repository is private, GitHub Pages needs a paid plan (Pro, Team or Enterprise), or the repository must be made public. That is the owner's decision.
