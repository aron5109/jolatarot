import type { ReactElement } from 'react';
import type { CardId } from '../data/cards';

/*
 * Line-art emblems for the 22 cards, drawn in a 100 × 100 box.
 * Colours come from a small fixed palette so every card reads as one deck.
 */
const INK = '#174536';
const INK_SOFT = '#2F6A55';
const GOLD = '#C4913F';
const GOLD_LIGHT = '#E9C77E';
const RED = '#9A1F26';
const CREAM = '#FFF8EA';

function starPath(cx: number, cy: number, outer: number, inner: number, points: number, rotate = -90): string {
  const step = Math.PI / points;
  let d = '';
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (rotate * Math.PI) / 180 + i * step;
    d += `${i === 0 ? 'M' : 'L'}${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`;
  }
  return `${d}Z`;
}

const line = { fill: 'none', stroke: INK, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const thin = { ...line, strokeWidth: 1.5 } as const;
const goldLine = { ...line, stroke: GOLD, strokeWidth: 1.8 } as const;

function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g {...goldLine} opacity="0.9">
      <path d={`M${x - 8} ${y} c-4 -6 4 -9 0 -15`} />
      <path d={`M${x} ${y - 2} c-4 -6 4 -9 0 -15`} />
      <path d={`M${x + 8} ${y} c-4 -6 4 -9 0 -15`} />
    </g>
  );
}

function Sparkle({ x, y, r = 4, color = GOLD }: { x: number; y: number; r?: number; color?: string }) {
  return <path d={starPath(x, y, r, r * 0.28, 4)} fill={color} />;
}

function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-6" r="9" fill={GOLD_LIGHT} opacity="0.35" />
      <path d="M0 -15 C5 -9 6 -4 0 0 C-6 -4 -5 -9 0 -15Z" fill={GOLD} />
      <path d="M0 -9 C2 -6 2 -3 0 -1 C-2 -3 -2 -6 0 -9Z" fill={CREAM} />
    </g>
  );
}

const lightBulbs = [14, 31, 48, 65, 82].map((x, i) => {
  const y = 44 + Math.sin((x / 100) * Math.PI * 2.2) * 12;
  return { x, y, color: [RED, GOLD, INK_SOFT, RED, GOLD][i], tilt: (i % 2 === 0 ? -1 : 1) * 12 };
});

const ART: Record<CardId, ReactElement> = {
  jolakotturinn: (
    <>
      <path d="M68 20a10 10 0 1 0 8 15a8 8 0 1 1 -8 -15Z" fill={GOLD} />
      <path
        d="M30 88C26 70 30 54 40 46L36 26 46 36Q50 35 54 36L64 26 60 46C70 54 74 70 70 88Z"
        fill={INK}
      />
      <path d="M70 84C86 82 90 68 80 58" {...line} strokeWidth={4} />
      <path d="M41 49.5q3 -3 6 0q-3 3 -6 0Z" fill={GOLD_LIGHT} />
      <path d="M53 49.5q3 -3 6 0q-3 3 -6 0Z" fill={GOLD_LIGHT} />
      <path d="M30 88H74" {...thin} />
    </>
  ),
  kertasnikir: (
    <>
      <circle cx="50" cy="30" r="20" fill={GOLD_LIGHT} opacity="0.22" />
      <rect x="42" y="40" width="16" height="42" rx="2" fill={RED} />
      <path d="M45 40v10q2 3 4 0v-10M53 40v6q2 3 3 0v-6" fill={CREAM} opacity="0.55" />
      <path d="M50 40v-5" {...thin} />
      <Flame x={50} y={35} s={1.25} />
      <ellipse cx="50" cy="84" rx="24" ry="5" fill="none" stroke={INK} strokeWidth="2.4" />
      <path d="M74 84q8 0 8 -6" {...line} />
      <Sparkle x={24} y={28} />
      <Sparkle x={77} y={22} r={3} />
    </>
  ),
  jolastjarnan: (
    <>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8;
        const r1 = 30;
        const r2 = i % 2 === 0 ? 44 : 38;
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * r1}
            y1={50 + Math.sin(a) * r1}
            x2={50 + Math.cos(a) * r2}
            y2={50 + Math.sin(a) * r2}
            {...goldLine}
            strokeWidth={1.2}
          />
        );
      })}
      <path d={starPath(50, 50, 28, 10, 8)} fill={GOLD} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <path d={starPath(50, 50, 14, 6, 8, -67.5)} fill={CREAM} opacity="0.8" />
      <circle cx="50" cy="50" r="3.5" fill={INK} />
    </>
  ),
  gryla: (
    <>
      <Steam x={50} y={38} />
      <path d="M68 46 84 14" {...line} strokeWidth={3} />
      <ellipse cx="85" cy="12" rx="6" ry="4" fill={INK} transform="rotate(-62 85 12)" />
      <path d="M22 50H78C78 70 66 82 50 82C34 82 22 70 22 50Z" fill={INK} />
      <rect x="18" y="45" width="64" height="7" rx="3.5" fill={INK_SOFT} />
      <path d="M32 80 28 90M68 80 72 90" {...line} strokeWidth={3} />
      <path d="M30 62q20 8 40 0" {...goldLine} />
      <circle cx="40" cy="70" r="1.6" fill={GOLD} />
      <circle cx="60" cy="70" r="1.6" fill={GOLD} />
    </>
  ),
  ljosaserian: (
    <>
      <path
        d={`M4 ${44 + Math.sin(0.04 * Math.PI * 2.2) * 12} ${Array.from({ length: 25 }, (_, i) => {
          const x = 4 + i * 4;
          return `L${x} ${(44 + Math.sin((x / 100) * Math.PI * 2.2) * 12).toFixed(2)}`;
        }).join(' ')}`}
        {...line}
        strokeWidth={1.8}
      />
      <path d="M8 80c10 -12 22 4 32 -6s18 8 26 -2 14 6 26 -4" {...thin} opacity="0.7" />
      <path d="M40 74c-6 4 -2 10 4 8" {...thin} opacity="0.7" />
      {lightBulbs.map((b, i) => (
        <g key={i} transform={`rotate(${b.tilt} ${b.x} ${b.y})`}>
          <rect x={b.x - 3} y={b.y} width="6" height="5" rx="1" fill={INK} />
          <path
            d={`M${b.x} ${b.y + 4}c6 4 6 12 0 18c-6 -6 -6 -14 0 -18Z`}
            fill={b.color}
            opacity={i === 2 ? 0.45 : 1}
          />
          {i !== 2 && <circle cx={b.x} cy={b.y + 14} r="9" fill={GOLD_LIGHT} opacity="0.22" />}
        </g>
      ))}
    </>
  ),
  jolatred: (
    <>
      <path d={starPath(50, 14, 7, 3, 5)} fill={GOLD} />
      <path d="M50 22 36 42H43L30 60H38L24 78H76L62 60H70L57 42H64Z" fill={INK} />
      <rect x="45" y="78" width="10" height="9" fill={INK_SOFT} />
      <path d="M32 90H68" {...line} />
      <path d="M38 50q12 6 24 -2M33 68q17 7 34 -3" {...goldLine} strokeWidth={1.4} />
      {(
        [
          [46, 40, RED],
          [56, 55, GOLD],
          [41, 60, RED],
          [61, 71, RED],
          [36, 74, GOLD],
          [51, 69, GOLD],
        ] as const
      ).map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={c} />
      ))}
    </>
  ),
  mondlugrauturinn: (
    <>
      <Steam x={50} y={36} />
      <path d="M16 52H84C82 72 68 84 50 84C32 84 18 72 16 52Z" fill={INK} />
      <ellipse cx="50" cy="52" rx="34" ry="7" fill={CREAM} stroke={INK} strokeWidth="2" />
      <path d="M40 86H60" {...line} strokeWidth={3} />
      <ellipse cx="56" cy="51" rx="6" ry="3" fill={GOLD} stroke={INK} strokeWidth="1" transform="rotate(-18 56 51)" />
      <path d="M26 64q24 9 48 0" {...goldLine} strokeWidth={1.4} />
      <path d="M70 50 88 28" {...line} strokeWidth={3} />
      <Sparkle x={66} y={42} r={3.5} />
    </>
  ),
  laufabraudid: (
    <>
      <circle cx="50" cy="52" r="36" fill={GOLD_LIGHT} stroke={INK} strokeWidth="2.4" />
      <circle cx="50" cy="52" r="30" fill="none" stroke={GOLD} strokeWidth="1.2" strokeDasharray="2 3" />
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 50 52)`}>
          <path d="M50 26 58 38 50 46 42 38Z" fill={INK} />
          <path d="M50 30 54 37 50 41 46 37Z" fill={GOLD_LIGHT} />
        </g>
      ))}
      {[45, 135, 225, 315].map((deg) => (
        <path key={deg} d="M50 30 53 36 50 40 47 36Z" fill={RED} transform={`rotate(${deg} 50 52)`} />
      ))}
      <path d={starPath(50, 52, 7, 3, 4, -45)} fill={INK} />
    </>
  ),
  jolabokaflodid: (
    <>
      <rect x="22" y="64" width="56" height="12" rx="2" fill={RED} />
      <rect x="27" y="52" width="48" height="12" rx="2" fill={INK} />
      <rect x="20" y="40" width="54" height="12" rx="2" fill={GOLD} />
      <path d="M26 46H68M32 58H68M28 70H70" stroke={CREAM} strokeWidth="1.2" opacity="0.6" />
      <path d="M32 40C38 30 48 30 50 34C52 30 62 30 68 40" fill={CREAM} stroke={INK} strokeWidth="2" />
      <path d="M50 34V40" {...thin} />
      <path d="M8 86c7 -5 14 5 21 0s14 5 21 0 14 5 21 0 14 5 21 0" {...line} stroke={INK_SOFT} strokeWidth={2} />
      <path d="M14 94c7 -5 14 5 21 0s14 5 21 0 14 5 21 0" {...thin} stroke={INK_SOFT} opacity="0.6" />
      <Sparkle x={80} y={26} />
    </>
  ),
  skorinn: (
    <>
      <rect x="20" y="10" width="60" height="62" rx="3" fill={INK} />
      <path d="M50 12V70M22 40H78" stroke={GOLD} strokeWidth="2" />
      <path d="M36 20a6 6 0 1 0 5 9a5 5 0 1 1 -5 -9Z" fill={GOLD_LIGHT} />
      <Sparkle x={66} y={24} r={3} color={GOLD_LIGHT} />
      <Sparkle x={60} y={33} r={2} color={GOLD_LIGHT} />
      <Sparkle x={32} y={54} r={2.2} color={GOLD_LIGHT} />
      <rect x="14" y="72" width="72" height="6" rx="1.5" fill={INK_SOFT} />
      <path d="M38 72V60C38 56 46 56 46 60V64C54 64 64 66 66 72Z" fill={RED} stroke={INK} strokeWidth="1.6" />
      <rect x="37" y="56" width="10" height="4" rx="1" fill={CREAM} stroke={INK} strokeWidth="1" />
      <path d="M44 66l6 -2M48 68l6 -2" stroke={CREAM} strokeWidth="1" />
      <path d="M26 86H74" {...thin} opacity="0.6" />
    </>
  ),
  hangikjotid: (
    <>
      <ellipse cx="50" cy="78" rx="38" ry="9" fill="none" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="50" cy="78" rx="30" ry="6" fill="none" stroke={GOLD} strokeWidth="1.2" />
      <path d="M22 66C14 48 26 28 46 28C62 28 72 40 68 54L60 64C48 74 30 76 22 66Z" fill={RED} />
      <path d="M30 60C26 48 34 38 46 37" {...line} stroke={CREAM} strokeWidth={1.6} opacity="0.55" />
      <path d="M64 56 80 44" stroke={CREAM} strokeWidth="6" strokeLinecap="round" />
      <path d="M64 56 80 44" stroke={INK} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <circle cx="82" cy="40" r="4" fill={CREAM} stroke={INK} strokeWidth="1.4" />
      <circle cx="85" cy="45" r="4" fill={CREAM} stroke={INK} strokeWidth="1.4" />
      <path d="M36 48q6 -4 12 0M34 56q8 -3 16 1" {...goldLine} strokeWidth={1.2} />
      <Steam x={44} y={22} />
    </>
  ),
  skatan: (
    <>
      <path d="M50 16C64 28 84 42 88 50C72 56 60 62 50 72C40 62 28 56 12 50C16 42 36 28 50 16Z" fill={INK} />
      <path d="M50 72C50 80 54 84 50 94" {...line} strokeWidth={2.4} />
      <circle cx="44" cy="36" r="2" fill={GOLD_LIGHT} />
      <circle cx="56" cy="36" r="2" fill={GOLD_LIGHT} />
      {(
        [
          [34, 48],
          [66, 48],
          [42, 56],
          [58, 56],
          [50, 46],
        ] as const
      ).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={GOLD} />
      ))}
      <path d="M24 50q26 10 52 0" {...goldLine} strokeWidth={1} opacity="0.7" />
      <path d="M14 84c6 -3 10 3 16 0M70 84c6 -3 10 3 16 0" {...thin} stroke={INK_SOFT} />
    </>
  ),
  nordurljosin: (
    <>
      <path d="M8 34C26 18 40 40 58 26S86 22 94 16" fill="none" stroke={INK_SOFT} strokeWidth="5" strokeLinecap="round" opacity="0.55" />
      <path d="M6 48C24 30 44 52 62 36S88 34 96 28" fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
      <path d="M10 58C28 44 46 62 64 48S88 46 94 40" fill="none" stroke={INK_SOFT} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <Sparkle x={20} y={20} r={2.5} />
      <Sparkle x={78} y={56} r={2.2} />
      <Sparkle x={44} y={14} r={2} />
      <path d="M4 88L26 62 38 74 54 52 72 78 82 68 96 88Z" fill={INK} />
      <path d="M54 52 48 60 54 58 58 62Z" fill={CREAM} />
      <path d="M26 62 22 68 27 66 30 69Z" fill={CREAM} />
    </>
  ),
  snjokarlinn: (
    <>
      <circle cx="50" cy="68" r="20" fill={CREAM} stroke={INK} strokeWidth="2.4" />
      <circle cx="50" cy="38" r="13" fill={CREAM} stroke={INK} strokeWidth="2.4" />
      <rect x="38" y="18" width="24" height="5" rx="1.5" fill={INK} />
      <rect x="42" y="6" width="16" height="13" rx="1.5" fill={INK} />
      <rect x="42" y="15" width="16" height="3" fill={RED} />
      <circle cx="45" cy="35" r="1.6" fill={INK} />
      <circle cx="55" cy="35" r="1.6" fill={INK} />
      <path d="M50 39 62 42 50 42Z" fill={GOLD} />
      <path d="M38 50Q50 56 62 50L64 55Q50 61 36 55Z" fill={RED} />
      <path d="M58 55 62 66 66 64 62 54" fill={RED} />
      <circle cx="50" cy="64" r="1.6" fill={INK} />
      <circle cx="50" cy="72" r="1.6" fill={INK} />
      <path d="M32 60 18 50M68 60 82 50M20 52l-4 -4M80 52l4 -4" {...line} strokeWidth={2} />
      <path d="M22 90H78" {...thin} />
      <path d="M38 90c0 -4 4 -4 6 -2" {...thin} opacity="0.6" />
    </>
  ),
  konfektkassinn: (
    <>
      <g transform="rotate(-6 50 54)">
        <rect x="16" y="26" width="68" height="56" rx="4" fill={INK} />
        <rect x="20" y="30" width="60" height="48" rx="2" fill="none" stroke={GOLD} strokeWidth="1.2" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const x = 32 + c * 18;
            const y = 42 + r * 13;
            const empty = r === 1 && c === 2;
            return empty ? (
              <circle key={`${r}${c}`} cx={x} cy={y} r="5.5" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="2 2" />
            ) : (
              <g key={`${r}${c}`}>
                <circle cx={x} cy={y} r="5.5" fill={(r + c) % 2 === 0 ? '#5A3420' : '#7A4A2C'} />
                <path d={`M${x - 3} ${y - 1}q3 -3 6 0`} stroke={GOLD_LIGHT} strokeWidth="1" fill="none" />
              </g>
            );
          }),
        )}
      </g>
      <path d="M70 18 84 10M78 22 92 20" {...goldLine} />
      <Sparkle x={88} y={30} r={3} />
    </>
  ),
  jolapakkinn: (
    <>
      <rect x="20" y="42" width="60" height="44" rx="2" fill={RED} />
      <rect x="16" y="34" width="68" height="12" rx="2" fill={RED} stroke={INK} strokeWidth="1.4" />
      <rect x="45" y="34" width="10" height="52" fill={GOLD} />
      <path d="M50 34C40 18 24 20 30 30C34 36 44 34 50 34Z" fill="none" stroke={GOLD} strokeWidth="3" />
      <path d="M50 34C60 18 76 20 70 30C66 36 56 34 50 34Z" fill="none" stroke={GOLD} strokeWidth="3" />
      <path d="M48 34 40 46M52 34 60 46" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 58H45M55 58H80" stroke={INK} strokeWidth="1" opacity="0.4" />
      <Sparkle x={14} y={22} r={3.5} />
      <Sparkle x={86} y={20} r={2.6} />
      <path d="M8 46l4 -2M88 52l5 -1" {...goldLine} />
    </>
  ),
  litlujolin: (
    <>
      <g transform="rotate(-16 36 60)">
        <path d="M24 40H48V70C48 78 24 78 24 70Z" fill={INK} />
        <path d="M48 48C58 48 58 64 48 64" {...line} strokeWidth={3} />
        <path d="M24 44H48" stroke={GOLD} strokeWidth="2" />
        <ellipse cx="36" cy="40" rx="12" ry="3" fill={CREAM} />
      </g>
      <g transform="rotate(16 64 60)">
        <path d="M52 40H76V70C76 78 52 78 52 70Z" fill={RED} />
        <path d="M52 48C42 48 42 64 52 64" {...line} stroke={RED} strokeWidth={3} />
        <path d="M52 44H76" stroke={GOLD} strokeWidth="2" />
        <ellipse cx="64" cy="40" rx="12" ry="3" fill={CREAM} />
      </g>
      <path d={starPath(50, 22, 8, 3, 4)} fill={GOLD} />
      <path d="M38 18l-4 -4M62 18l4 -4M50 8V4" {...goldLine} />
      <Sparkle x={24} y={26} r={2.4} />
      <Sparkle x={78} y={28} r={2.4} />
      <path d="M22 90H78" {...thin} />
    </>
  ),
  adventukransinn: (
    <>
      <ellipse cx="50" cy="72" rx="36" ry="13" fill="none" stroke={INK} strokeWidth="9" />
      <ellipse cx="50" cy="72" rx="36" ry="13" fill="none" stroke={INK_SOFT} strokeWidth="2" strokeDasharray="3 5" />
      {(
        [
          [22, 66, true],
          [40, 60, true],
          [60, 60, false],
          [78, 66, false],
        ] as const
      ).map(([x, y, lit], i) => (
        <g key={i}>
          <rect x={x - 4} y={y - 24} width="8" height="24" rx="1" fill={RED} />
          <path d={`M${x} ${y - 24}v-3`} {...thin} />
          {lit ? <Flame x={x} y={y - 27} s={0.75} /> : null}
        </g>
      ))}
      {(
        [
          [30, 80],
          [50, 85],
          [70, 80],
        ] as const
      ).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.6" fill={RED} />
          <circle cx={x + 4} cy={y - 1} r="2.2" fill={RED} />
        </g>
      ))}
    </>
  ),
  solstodur: (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI + (i * Math.PI) / 8;
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * 26}
            y1={62 + Math.sin(a) * 26}
            x2={50 + Math.cos(a) * 38}
            y2={62 + Math.sin(a) * 38}
            {...goldLine}
            strokeWidth={i % 2 === 0 ? 2.4 : 1.4}
          />
        );
      })}
      <path d="M30 62A20 20 0 0 1 70 62Z" fill={GOLD} />
      <path d="M36 62A14 14 0 0 1 64 62" fill="none" stroke={CREAM} strokeWidth="1.4" opacity="0.7" />
      <path d="M8 62H92" {...line} />
      <path d="M8 72c10 -4 20 4 30 0s20 4 30 0 16 4 24 0" {...thin} stroke={INK_SOFT} />
      <path d="M14 82c10 -4 20 4 30 0s20 4 30 0" {...thin} stroke={INK_SOFT} opacity="0.7" />
      <path d="M74 22a7 7 0 1 0 6 10a6 6 0 1 1 -6 -10Z" fill={INK} opacity="0.75" />
    </>
  ),
  kakobollinn: (
    <>
      <Steam x={46} y={30} />
      <path d="M24 38H68V70C68 82 24 82 24 70Z" fill={INK} />
      <path d="M68 46C82 46 82 66 68 66" {...line} strokeWidth={4} />
      <path d="M22 38C22 30 32 28 36 32C38 26 50 26 52 32C56 28 70 30 70 38Z" fill={CREAM} stroke={INK} strokeWidth="1.6" />
      <path d="M30 52H62" stroke={GOLD} strokeWidth="2" />
      <path d={starPath(46, 62, 5, 2, 5)} fill={GOLD} />
      <ellipse cx="46" cy="86" rx="32" ry="4" fill="none" stroke={INK} strokeWidth="2" />
    </>
  ),
  aramotabrennan: (
    <>
      <path d="M18 86 82 72M18 72 82 86" {...line} strokeWidth={6} stroke="#5A3420" />
      <path d="M50 20C62 34 70 44 66 60C64 68 58 74 50 74C42 74 34 68 32 60C28 46 40 40 42 28C46 36 48 34 50 20Z" fill={RED} />
      <path d="M50 38C58 48 60 56 56 64C54 68 46 68 44 64C40 56 46 50 50 38Z" fill={GOLD} />
      <path d="M50 54C53 58 53 62 50 66C47 62 47 58 50 54Z" fill={CREAM} />
      {(
        [
          [28, 30],
          [72, 24],
          [62, 12],
          [36, 14],
          [78, 42],
        ] as const
      ).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.8 : 1.3} fill={GOLD} />
      ))}
    </>
  ),
  nyjaarid: (
    <>
      <circle cx="50" cy="50" r="40" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="50" cy="50" r="36" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="1.5 3" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <g key={i}>
            <line
              x1={50 + Math.cos(a) * 8}
              y1={44 + Math.sin(a) * 8}
              x2={50 + Math.cos(a) * 24}
              y2={44 + Math.sin(a) * 24}
              {...goldLine}
              strokeWidth={1.6}
            />
            <circle cx={50 + Math.cos(a) * 27} cy={44 + Math.sin(a) * 27} r="1.8" fill={i % 3 === 0 ? RED : GOLD} />
          </g>
        );
      })}
      <path d={starPath(50, 44, 6, 2.4, 4)} fill={RED} />
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="12"
        fontWeight="600"
        fill={INK}
        letterSpacing="1"
      >
        2027
      </text>
    </>
  ),
};

export function CardArt({ id, className }: { id: CardId; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {ART[id]}
    </svg>
  );
}
