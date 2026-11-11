import type { CSSProperties } from 'react';

/** Deterministic pseudo-random numbers so the decoration is identical on every render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1225);
const STARS = Array.from({ length: 46 }, () => ({
  left: rand() * 100,
  top: rand() * 70,
  size: 1 + rand() * 2.2,
  delay: rand() * 7,
  duration: 3 + rand() * 5,
}));
const SNOW = Array.from({ length: 28 }, () => ({
  left: rand() * 100,
  size: 2 + rand() * 3,
  delay: -rand() * 18,
  duration: 14 + rand() * 12,
  drift: (rand() - 0.5) * 60,
}));

/** A row of spruce silhouettes along the bottom edge. */
function Forest({ className, seed, count }: { className: string; seed: number; count: number }) {
  const r = mulberry32(seed);
  const trees = Array.from({ length: count }, (_, i) => {
    const x = (i + r() * 0.6) * (400 / count);
    const h = 40 + r() * 50;
    const w = h * (0.38 + r() * 0.1);
    return { x, h, w };
  });
  return (
    <svg className={className} viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {trees.map(({ x, h, w }, i) => (
        <path
          key={i}
          d={`M${x} ${100 - h}L${x + w * 0.32} ${100 - h * 0.66}H${x + w * 0.18}L${x + w * 0.5} ${100 - h * 0.3}H${x + w * 0.3}L${x + w * 0.62} 100H${x - w * 0.62}L${x - w * 0.3} ${100 - h * 0.3}H${x - w * 0.5}L${x - w * 0.18} ${100 - h * 0.66}H${x - w * 0.32}Z`}
        />
      ))}
      <rect x="0" y="96" width="400" height="4" />
    </svg>
  );
}

/** Fixed, decorative night sky behind the content. Hidden from assistive tech. */
export function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__base" />
      <div className="bg__aurora" />
      <div className="bg__stars">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="star"
            style={
              {
                left: `${s.left}%`,
                top: `${s.top}%`,
                '--size': `${s.size}px`,
                '--delay': `${s.delay}s`,
                '--duration': `${s.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="bg__snow">
        {SNOW.map((s, i) => (
          <span
            key={i}
            className="snow"
            style={
              {
                left: `${s.left}%`,
                '--size': `${s.size}px`,
                '--delay': `${s.delay}s`,
                '--duration': `${s.duration}s`,
                '--drift': `${s.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <Forest className="forest forest--back" seed={3} count={14} />
      <Forest className="forest forest--front" seed={11} count={9} />
      <div className="bg__vignette" />
    </div>
  );
}
