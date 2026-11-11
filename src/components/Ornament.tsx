/** Crescent moon holding a star — the brand mark above the title. */
export function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ornament-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBE7B5" />
          <stop offset="0.5" stopColor="#E2B865" />
          <stop offset="1" stopColor="#B07F37" />
        </linearGradient>
      </defs>
      <path
        d="M34 6.5A21.5 21.5 0 1 0 49.5 40 18 18 0 1 1 34 6.5Z"
        fill="none"
        stroke="url(#ornament-gold)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M36 21l1.7 4.6 4.8.4-3.7 3.1 1.2 4.7L36 31.2l-4 2.6 1.2-4.7-3.7-3.1 4.8-.4z" fill="url(#ornament-gold)" />
      <circle cx="45" cy="14" r="1.2" fill="#FBE7B5" />
      <circle cx="49" cy="26" r="0.9" fill="#FBE7B5" />
    </svg>
  );
}
