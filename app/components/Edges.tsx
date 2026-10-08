/* Section edges: honey drips hanging into the next section, and a soft
   cloud bank rising out of one. Both use a wide viewBox with `slice` so the
   shapes keep their proportions and simply crop on narrow screens. */

const f = (n: number) => n.toFixed(1);

type Drip = { x: number; w: number; len: number; drop?: boolean };

// Fewer, fatter drips of varied length: viscous honey, not paint.
const defaultDrips: Drip[] = [
  { x: 10, w: 70, len: 38 },
  { x: 140, w: 92, len: 112, drop: true },
  { x: 320, w: 58, len: 26 },
  { x: 420, w: 80, len: 74 },
  { x: 590, w: 112, len: 142, drop: true },
  { x: 790, w: 60, len: 40 },
  { x: 890, w: 86, len: 96 },
  { x: 1050, w: 66, len: 30 },
  { x: 1150, w: 98, len: 126, drop: true },
  { x: 1330, w: 74, len: 58 },
];

const BAND = 22;
// The band's lower edge undulates gently instead of running ruler-straight.
const edgeY = (x: number) => BAND + 5 * Math.sin(x / 95) + 3 * Math.sin(x / 37 + 1.3);

// One drip: broad shoulders that pinch into a neck and swell into a bulb.
function dripSegment({ x, w, len }: Drip) {
  const cx = x + w / 2;
  const r = w * 0.24; // bulb radius
  const neck = r * 0.78; // half-width of the neck
  const yR = edgeY(x + w);
  const yL = edgeY(x);
  const bulbY = Math.max(yR, yL) + len - r;
  return [
    `L${f(x + w)},${f(yR)}`,
    `C${f(x + w * 0.74)},${f(yR + 2)} ${f(cx + neck)},${f(yR + len * 0.22)} ${f(cx + neck)},${f(bulbY - r * 0.55)}`,
    `C${f(cx + neck)},${f(bulbY - r * 0.2)} ${f(cx + r)},${f(bulbY - r * 0.35)} ${f(cx + r)},${f(bulbY)}`,
    `A${f(r)},${f(r)} 0 1 1 ${f(cx - r)},${f(bulbY)}`,
    `C${f(cx - r)},${f(bulbY - r * 0.35)} ${f(cx - neck)},${f(bulbY - r * 0.2)} ${f(cx - neck)},${f(bulbY - r * 0.55)}`,
    `C${f(cx - neck)},${f(yL + len * 0.22)} ${f(x + w * 0.26)},${f(yL + 2)} ${f(x)},${f(yL)}`,
  ].join(" ");
}

function dripPath(drips: Drip[], width: number) {
  // Top band, then walk right-to-left along its wavy lower edge, dipping into each drip.
  const sorted = [...drips].sort((a, b) => b.x - a.x);
  let d = `M0,0 H${width + 20} V${f(edgeY(width + 20))}`;
  let cursor = width + 20;
  for (const dr of sorted) {
    const to = dr.x + dr.w;
    const mid = (cursor + to) / 2;
    // gentle sag between drips
    d += ` Q${f(mid)},${f(edgeY(mid) + 4)} ${f(to)},${f(edgeY(to))}`;
    d += " " + dripSegment(dr);
    cursor = dr.x;
  }
  d += ` Q${f(cursor / 2)},${f(edgeY(cursor / 2) + 4)} -20,${f(edgeY(-20))} V0 Z`;
  return d;
}

// One drip on its own (for per-drip shading), closed along the band edge.
function singleDrip(dr: Drip) {
  return `M${f(dr.x + dr.w)},${f(edgeY(dr.x + dr.w))} ` + dripSegment(dr).replace(/^L[^ ]+ /, "") + " Z";
}

/* Glossy amber honey edge: warm cast shadow, a gold-to-amber body, rounded
   shading across each drip, a specular streak down its lit side, glints on
   the bulbs and a sheen along the band. `id` keeps gradient ids unique when
   the edge is used more than once on a page. */
export function DripEdge({
  id = "drip",
  drips: baseDrips = defaultDrips,
  scale = 0.4,
  className,
}: {
  id?: string;
  drips?: Drip[];
  /** Size of the drips relative to the 1440-wide design (render the SVG at 200 × scale px tall). */
  scale?: number;
  className?: string;
}) {
  // A smaller scale needs a wider canvas, so repeat the drip pattern to fill it.
  const width = Math.round(1440 / scale);
  const drips = Array.from({ length: Math.ceil(width / 1440) }, (_, k) =>
    baseDrips.map((d) => ({ ...d, x: d.x + k * 1440 })),
  ).flat();
  const g = (name: string) => `${id}-${name}`;
  const shine = "#fff6d2";
  const shade = "#7a3a00";
  return (
    <svg className={className} viewBox={`0 0 ${width} 200`} preserveAspectRatio="xMidYMin slice" aria-hidden>
      <defs>
        <linearGradient id={g("body")} x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd56a" />
          <stop offset="0.18" stopColor="#f8b230" />
          <stop offset="0.55" stopColor="#e68a0c" />
          <stop offset="1" stopColor="#b85c00" />
        </linearGradient>
        <linearGradient id={g("round")} x1="0" x2="1">
          <stop offset="0" stopColor={shade} stopOpacity="0.55" />
          <stop offset="0.2" stopColor={shade} stopOpacity="0.1" />
          <stop offset="0.42" stopColor="#fff2b0" stopOpacity="0.22" />
          <stop offset="0.68" stopColor={shade} stopOpacity="0.1" />
          <stop offset="1" stopColor={shade} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={g("sheen")} x1="0" x2="1">
          <stop offset="0" stopColor={shine} stopOpacity="0" />
          <stop offset="0.25" stopColor={shine} stopOpacity="0.7" />
          <stop offset="0.5" stopColor={shine} stopOpacity="0.15" />
          <stop offset="0.75" stopColor={shine} stopOpacity="0.65" />
          <stop offset="1" stopColor={shine} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={g("ball")} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.35" stopColor="#f6a91f" />
          <stop offset="1" stopColor="#a65000" />
        </radialGradient>
        <filter id={g("shadow")} x="-5%" y="-20%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={g("soft")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      {/* warm cast shadow on the section behind */}
      <path d={dripPath(drips, width)} fill="#120600" opacity="0.5" transform="translate(5 10)" filter={`url(#${g("shadow")})`} />

      {/* honey body */}
      <path d={dripPath(drips, width)} fill={`url(#${g("body")})`} />

      {/* sheen running along the band */}
      <path
        d={`M0,${BAND * 0.42} C${width * 0.25},${BAND * 0.2} ${width * 0.5},${BAND * 0.62} ${width * 0.75},${BAND * 0.36} S${width * 0.97},${BAND * 0.3} ${width},${BAND * 0.4}`}
        fill="none"
        stroke={`url(#${g("sheen")})`}
        strokeWidth="3"
        strokeLinecap="round"
        filter={`url(#${g("soft")})`}
      />

      {drips.map((dr, i) => {
        const cx = dr.x + dr.w / 2;
        const r = dr.w * 0.24;
        const top = Math.max(edgeY(dr.x), edgeY(dr.x + dr.w));
        const bulbY = top + dr.len - r;
        return (
          <g key={i}>
            <path d={singleDrip(dr)} fill={`url(#${g("round")})`} />
            {/* specular streak curving into the bulb */}
            <path
              d={`M${f(cx - r * 0.35)},${f(top + 4)} C${f(cx - r * 0.5)},${f(top + dr.len * 0.4)} ${f(cx - r * 0.55)},${f(bulbY - r * 0.6)} ${f(cx - r * 0.6)},${f(bulbY - r * 0.1)}`}
              fill="none"
              stroke={shine}
              strokeOpacity="0.8"
              strokeWidth={Math.max(2, dr.w * 0.05)}
              strokeLinecap="round"
              filter={`url(#${g("soft")})`}
            />
            {/* bulb glint + warm bounce light underneath */}
            <ellipse cx={cx - r * 0.4} cy={bulbY - r * 0.15} rx={r * 0.22} ry={r * 0.32} fill="#fff" opacity="0.9" />
            <ellipse cx={cx + r * 0.25} cy={bulbY + r * 0.6} rx={r * 0.45} ry={r * 0.14} fill="#ffe08a" opacity="0.55" />
            {dr.drop && (
              <g>
                <ellipse cx={cx + 4} cy={bulbY + r + 26} rx={r * 0.5} ry={r * 0.6} fill="#120600" opacity="0.35" filter={`url(#${g("shadow")})`} />
                <ellipse cx={cx} cy={bulbY + r + 20} rx={r * 0.48} ry={r * 0.62} fill={`url(#${g("ball")})`} />
                <ellipse cx={cx - r * 0.16} cy={bulbY + r + 20 - r * 0.22} rx={r * 0.12} ry={r * 0.17} fill="#fff" opacity="0.9" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* Layered wave edge rising out of a section: a honey-gold ribbon at the
   back, a translucent middle wave for depth, and a clean front wave in the
   next section's colour. `id` keeps gradient ids unique per instance. */
export function WaveEdge({
  id = "wave",
  color = "#fff",
  className,
}: {
  id?: string;
  color?: string;
  className?: string;
}) {
  const g = (name: string) => `${id}-${name}`;
  return (
    <svg className={className} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={g("gold")} x1="0" x2="1">
          <stop offset="0" stopColor="#ffd56a" />
          <stop offset="0.5" stopColor="#f6a313" />
          <stop offset="1" stopColor="#e8860a" />
        </linearGradient>
      </defs>
      <path d="M0,40 C300,6 560,78 840,38 S1240,8 1440,30 V120 H0 Z" fill={`url(#${g("gold")})`} />
      <path d="M0,56 C260,92 540,22 780,52 S1180,90 1440,44 V120 H0 Z" fill={color} opacity="0.4" />
      <path d="M0,74 C240,40 480,104 740,70 S1200,38 1440,66 V120 H0 Z" fill={color} />
    </svg>
  );
}

/* Minimal dusk forest for the quality band: a muted sky, a faint sun and
   three flat purple canopy silhouettes. Geometry comes from a seeded
   generator so server and client render the same trees. */

// Small deterministic PRNG so server and client render the same trees.
function rng(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Crown = { x: number; y: number; r: number };

// A canopy layer: overlapping rounded crowns along a baseline, filled to the bottom.
function canopy(base: number, rMin: number, rMax: number, seed: number) {
  const rand = rng(seed);
  const crowns: Crown[] = [];
  let x = -rMax;
  while (x < 1440 + rMax) {
    const r = rMin + rand() * (rMax - rMin);
    // occasional tall emergent tree
    const lift = rand() < 0.12 ? r * (0.8 + rand() * 0.6) : rand() * r * 0.35;
    crowns.push({ x, y: base - lift, r });
    // tight spacing so neighbouring crowns always overlap (no notches)
    x += r * (0.65 + rand() * 0.35);
  }
  return crowns;
}

// far → near: flat purple silhouettes for a calm, minimal forest
const layers = [
  { base: 380, rMin: 22, rMax: 38, seed: 11, fill: "#6a4a7a", opacity: 0.55 },
  { base: 450, rMin: 30, rMax: 52, seed: 23, fill: "#43285a", opacity: 0.9 },
  { base: 530, rMin: 42, rMax: 70, seed: 37, fill: "#2a1640", opacity: 1 },
];

// Each crown is a cluster of three circles, so the canopy reads as lumpy foliage.
const puffsOf = (c: Crown) => [
  { cx: c.x, cy: c.y, r: c.r },
  { cx: c.x - c.r * 0.6, cy: c.y + c.r * 0.28, r: c.r * 0.72 },
  { cx: c.x + c.r * 0.58, cy: c.y + c.r * 0.22, r: c.r * 0.76 },
];

export function Forest({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="fr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1640" />
          <stop offset="0.6" stopColor="#4d2d5e" />
          <stop offset="1" stopColor="#8a5a6a" />
        </linearGradient>
        <radialGradient id="fr-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f6cf7a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6cf7a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="600" fill="url(#fr-sky)" />
      <circle cx="1040" cy="360" r="150" fill="url(#fr-sun)" />

      {layers.map((l) => (
        <g key={l.seed} fill={l.fill} opacity={l.opacity}>
          {canopy(l.base, l.rMin, l.rMax, l.seed)
            .flatMap(puffsOf)
            .map((p, k) => (
              <circle key={k} cx={p.cx} cy={p.cy} r={p.r} />
            ))}
          <rect x="0" y={l.base} width="1440" height={600 - l.base} />
        </g>
      ))}
    </svg>
  );
}
