/* Section edges: honey drips hanging into the next section, and a soft
   cloud bank rising out of one. Both use a wide viewBox with `slice` so the
   shapes keep their proportions and simply crop on narrow screens. */

const f = (n: number) => n.toFixed(1);

type Drip = { x: number; w: number; len: number; drop?: boolean };

const defaultDrips: Drip[] = [
  { x: 40, w: 46, len: 54 },
  { x: 150, w: 34, len: 92, drop: true },
  { x: 260, w: 52, len: 40 },
  { x: 390, w: 38, len: 118 },
  { x: 500, w: 30, len: 58 },
  { x: 610, w: 56, len: 76, drop: true },
  { x: 760, w: 34, len: 44 },
  { x: 860, w: 44, len: 104 },
  { x: 990, w: 30, len: 52 },
  { x: 1080, w: 50, len: 86, drop: true },
  { x: 1210, w: 36, len: 48 },
  { x: 1300, w: 46, len: 112 },
  { x: 1400, w: 32, len: 60 },
];

const BAND = 26;

function dripPath(drips: Drip[]) {
  // Top band, then walk right-to-left along its lower edge, dipping into each drip.
  const sorted = [...drips].sort((a, b) => b.x - a.x);
  let d = `M0,0 H1440 V${BAND}`;
  for (const { x, w, len } of sorted) {
    const r = w * 0.34;
    const neckY = BAND + len - r;
    d += ` L${f(x + w)},${BAND}`;
    d += ` C${f(x + w * 0.72)},${BAND} ${f(x + w * 0.68)},${BAND + 8} ${f(x + w * 0.68)},${f(neckY)}`;
    d += ` A${f(r)},${f(r)} 0 1 1 ${f(x + w * 0.32)},${f(neckY)}`;
    d += ` C${f(x + w * 0.32)},${BAND + 8} ${f(x + w * 0.28)},${BAND} ${f(x)},${BAND}`;
  }
  return d + ` L0,${BAND} Z`;
}

export function DripEdge({
  color = "var(--honey-deep)",
  shine = "#ffd77a",
  drips = defaultDrips,
  className,
}: {
  color?: string;
  shine?: string;
  drips?: Drip[];
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 1440 170" preserveAspectRatio="xMidYMin slice" aria-hidden>
      <path d={dripPath(drips)} fill={color} />
      {drips.map((dr, i) => (
        <g key={i}>
          {/* highlight down the left of each drip */}
          <rect
            x={dr.x + dr.w * 0.38}
            y={BAND + 6}
            width={dr.w * 0.08}
            height={Math.max(4, dr.len - dr.w * 0.55)}
            rx={dr.w * 0.04}
            fill={shine}
            opacity="0.55"
          />
          {dr.drop && (
            <ellipse cx={dr.x + dr.w / 2} cy={BAND + dr.len + 20} rx={dr.w * 0.16} ry={dr.w * 0.21} fill={color} />
          )}
        </g>
      ))}
    </svg>
  );
}

const puffs = [
  [0, 70, 70], [110, 52, 60], [210, 74, 80], [330, 58, 58], [430, 80, 76],
  [560, 60, 66], [670, 76, 82], [800, 56, 60], [900, 72, 78], [1030, 58, 62],
  [1140, 78, 80], [1270, 60, 64], [1380, 70, 74], [1460, 64, 60],
] as const;

export function CloudEdge({ color = "#fff", className }: { color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 140" preserveAspectRatio="xMidYMax slice" aria-hidden>
      {/* back row, slightly transparent for depth */}
      <g fill={color} opacity="0.55">
        {puffs.map(([x, , r], i) => (
          <circle key={i} cx={x + 50} cy={86} r={r * 0.9} />
        ))}
      </g>
      <g fill={color}>
        {puffs.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y + 40} r={r} />
        ))}
        <rect x="-20" y="110" width="1480" height="40" />
      </g>
    </svg>
  );
}

/* Layered dusk ridges for the quality band. */
export function Landscape({ className }: { className?: string }) {
  const ridge = (base: number, amp: number, seed: number) => {
    let d = `M0,${base}`;
    for (let x = 0; x <= 1440; x += 60) {
      const y = base - amp * (0.5 + 0.5 * Math.sin(x / 140 + seed) * Math.cos(x / 310 + seed * 2));
      d += ` L${x},${f(y)}`;
    }
    return d + " V600 H0 Z";
  };
  return (
    <svg className={className} viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1d5c" />
          <stop offset="0.55" stopColor="#b5527a" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
        <radialGradient id="ls-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff2c2" />
          <stop offset="0.4" stopColor="#ffd06a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb547" stopOpacity="0" />
        </radialGradient>
        <filter id="ls-fog" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width="1440" height="600" fill="url(#ls-sky)" />
      <circle cx="1040" cy="330" r="190" fill="url(#ls-sun)" />
      <path d={ridge(360, 120, 0.4)} fill="#7d3f6e" opacity="0.75" />
      <ellipse cx="400" cy="380" rx="420" ry="26" fill="#ffe4c4" opacity="0.45" filter="url(#ls-fog)" />
      <path d={ridge(420, 110, 1.7)} fill="#5a2a5e" />
      <ellipse cx="1100" cy="440" rx="460" ry="28" fill="#ffe4c4" opacity="0.4" filter="url(#ls-fog)" />
      <path d={ridge(480, 90, 3.1)} fill="#3d1c48" />
      <path d={ridge(540, 60, 4.6)} fill="#261233" />
    </svg>
  );
}
