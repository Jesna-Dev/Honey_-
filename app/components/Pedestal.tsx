/* Illustrated 3D honeycomb slab the hero jar rests on.
   The geometry is computed: hex cells are laid out on the flat top (squashed
   into perspective) and wrapped around the cylinder wall (foreshortened toward
   the silhouette), each shaded by a light from the upper left. */

const CX = 300; // centre x
const R = 270; // radius
const RY = 58; // perspective squash of the top ellipse
const TOP = 82; // y of the top ellipse centre
const H = 122; // wall height
const LIGHT = -0.5; // light direction around the cylinder (radians, left of front)

const f = (n: number) => n.toFixed(1);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Mix two hex colours.
const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp(t, 0, 1))).join(",")})`;
};

// Pointy-top hexagon vertices around (x, y) in some 2D parameter space.
const hex = (x: number, y: number, s: number) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 180) * (60 * k - 30);
    return [x + s * Math.cos(a), y + s * Math.sin(a)] as const;
  });

const poly = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");

/* ---------- Top surface: hex grid on the plane, projected ---------- */
const TOP_S = 21;
const topCells: { outer: string; inner: string; glint: [number, number]; shade: number }[] = [];
{
  const w = Math.sqrt(3) * TOP_S;
  for (let row = -12; row <= 12; row++) {
    for (let col = -11; col <= 11; col++) {
      const px = col * w + (row % 2 ? w / 2 : 0);
      const pz = row * TOP_S * 1.5;
      if (Math.hypot(px, pz) > R + TOP_S) continue;
      const project = ([x, z]: readonly [number, number]) =>
        [CX + x, TOP + (z * RY) / R] as const;
      const outer = hex(px, pz, TOP_S * 0.97).map(project);
      const inner = hex(px, pz, TOP_S * 0.72).map(project);
      const [gx, gy] = project([px - TOP_S * 0.28, pz - TOP_S * 0.3]);
      // brighter toward the back-left, darker toward the front-right
      const shade = 0.55 - (px / R) * 0.25 - (pz / R) * 0.2;
      topCells.push({ outer: poly(outer), inner: poly(inner), glint: [gx, gy], shade });
    }
  }
}

/* ---------- Side wall: hex grid in (arc length, height), wrapped ---------- */
const SIDE_S = 19;
const sideCells: { pts: string; shade: number }[] = [];
{
  const w = Math.sqrt(3) * SIDE_S;
  const maxArc = (Math.PI / 2) * R;
  for (let row = 0; row * SIDE_S * 1.5 < H + SIDE_S * 2; row++) {
    for (let col = -20; col <= 20; col++) {
      const arc = col * w + (row % 2 ? w / 2 : 0);
      if (Math.abs(arc) > maxArc + w) continue;
      const h = row * SIDE_S * 1.5 + SIDE_S * 0.4;
      const wrap = ([a, y]: readonly [number, number]) => {
        const u = clamp(a / R, -Math.PI / 2, Math.PI / 2);
        return [CX + R * Math.sin(u), TOP + RY * Math.cos(u) + y] as const;
      };
      const pts = hex(arc, h, SIDE_S * 0.84).map(wrap);
      const u = arc / R;
      const shade = Math.max(0, Math.cos(u - LIGHT)) * (1 - (h / H) * 0.35);
      sideCells.push({ pts: poly(pts), shade });
    }
  }
}

/* ---------- Drips hanging off the front rim ---------- */
const drips = [
  { u: -1.05, len: 30, w: 13 },
  { u: -0.58, len: 58, w: 15 },
  { u: -0.12, len: 22, w: 11 },
  { u: 0.36, len: 46, w: 14 },
  { u: 0.95, len: 34, w: 12 },
].map(({ u, len, w }) => {
  const x = CX + R * Math.sin(u);
  const y = TOP + RY * Math.cos(u) - 4;
  const r = w / 2;
  // narrow neck widening into a rounded bulb
  const d = [
    `M${f(x - r * 0.8)},${f(y)}`,
    `C${f(x - r * 0.8)},${f(y + len * 0.5)} ${f(x - r)},${f(y + len * 0.6)} ${f(x - r)},${f(y + len)}`,
    `A${f(r)},${f(r)} 0 0 0 ${f(x + r)},${f(y + len)}`,
    `C${f(x + r)},${f(y + len * 0.6)} ${f(x + r * 0.8)},${f(y + len * 0.5)} ${f(x + r * 0.8)},${f(y)}`,
    "Z",
  ].join(" ");
  return { d, x, y, len, r };
});

const SIDE_PATH = `M${CX - R},${TOP} V${TOP + H} A${R},${RY} 0 0 0 ${CX + R},${TOP + H} V${TOP} Z`;

export default function Pedestal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 290" aria-hidden>
      <defs>
        {/* cylinder shading across the wall: dark rims, lit left-centre */}
        <linearGradient id="pd-wall-light" x1="0" x2="1">
          <stop offset="0" stopColor="#3a1c00" stopOpacity="0.55" />
          <stop offset="0.12" stopColor="#3a1c00" stopOpacity="0.18" />
          <stop offset="0.36" stopColor="#ffd77a" stopOpacity="0.25" />
          <stop offset="0.6" stopColor="#3a1c00" stopOpacity="0.05" />
          <stop offset="0.88" stopColor="#3a1c00" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3a1c00" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="pd-wall-ao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" stopOpacity="0.3" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#4a2500" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="pd-wall-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9a335" />
          <stop offset="1" stopColor="#b8680c" />
        </linearGradient>

        <radialGradient id="pd-cell-honey" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffd77a" />
          <stop offset="0.55" stopColor="#e39a25" />
          <stop offset="1" stopColor="#9c5506" />
        </radialGradient>
        <radialGradient id="pd-top-light" cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff8e0" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#fff8e0" stopOpacity="0" />
          <stop offset="1" stopColor="#5a2c00" stopOpacity="0.25" />
        </radialGradient>
        <radialGradient id="pd-pool" cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#d98a17" stopOpacity="0.95" />
          <stop offset="0.7" stopColor="#e8a63a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f2bb55" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pd-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1c2" />
          <stop offset="0.5" stopColor="#f6c860" />
          <stop offset="1" stopColor="#c98018" />
        </linearGradient>
        <linearGradient id="pd-drip" x1="0" x2="1">
          <stop offset="0" stopColor="#b8650a" />
          <stop offset="0.35" stopColor="#f2b04a" />
          <stop offset="0.65" stopColor="#e39a2a" />
          <stop offset="1" stopColor="#a65908" />
        </linearGradient>

        <clipPath id="pd-top-clip">
          <ellipse cx={CX} cy={TOP} rx={R - 6} ry={RY - 3} />
        </clipPath>
        <clipPath id="pd-side-clip">
          <path d={SIDE_PATH} />
        </clipPath>
        <filter id="pd-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="pd-soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* ground shadow: wide soft + tight contact */}
      <ellipse cx={CX + 10} cy={TOP + H + RY - 2} rx={R + 18} ry={22} fill="#6b3d06" opacity="0.28" filter="url(#pd-blur)" />
      <ellipse cx={CX} cy={TOP + H + RY - 6} rx={R - 10} ry={10} fill="#4a2500" opacity="0.35" filter="url(#pd-soft)" />

      {/* wall */}
      <path d={SIDE_PATH} fill="url(#pd-wall-base)" />
      <g clipPath="url(#pd-side-clip)">
        {sideCells.map((c, i) => (
          <polygon
            key={i}
            points={c.pts}
            fill={mix("#a95c08", "#ffcf6b", c.shade)}
            stroke={mix("#7a3f03", "#d58b1d", c.shade)}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        ))}
        <rect x="0" y="0" width="600" height="290" fill="url(#pd-wall-ao)" />
        <rect x={CX - R} y="0" width={R * 2} height="290" fill="url(#pd-wall-light)" />
      </g>

      {/* rim: a thick wax lip around the top */}
      <ellipse cx={CX} cy={TOP + 3} rx={R} ry={RY} fill="url(#pd-rim)" />

      {/* top: recessed cells filled with honey */}
      <g clipPath="url(#pd-top-clip)">
        <ellipse cx={CX} cy={TOP} rx={R} ry={RY} fill="#c9811a" />
        {topCells.map((c, i) => (
          <g key={i}>
            <polygon points={c.outer} fill={mix("#d08a1f", "#fde3a0", c.shade)} />
            <polygon points={c.inner} fill="url(#pd-cell-honey)" opacity={0.75 + c.shade * 0.25} />
            <ellipse cx={c.glint[0]} cy={c.glint[1]} rx="3.4" ry="1.4" fill="#fff" opacity={0.25 + c.shade * 0.5} />
          </g>
        ))}
        <ellipse cx={CX} cy={TOP} rx={R} ry={RY} fill="url(#pd-top-light)" />
        {/* honey pooled where the jar sits */}
        <ellipse cx={CX} cy={TOP + 6} rx={150} ry={34} fill="url(#pd-pool)" />
        <ellipse cx={CX - 40} cy={TOP - 4} rx={60} ry={7} fill="#fff" opacity="0.35" />
      </g>

      {/* inner edge highlight of the rim */}
      <ellipse cx={CX} cy={TOP} rx={R - 5} ry={RY - 3} fill="none" stroke="#fff4cf" strokeOpacity="0.8" strokeWidth="1.5" />
      <path
        d={`M${CX - R + 4},${TOP + 6} A${R - 4},${RY - 2} 0 0 0 ${CX + R - 4},${TOP + 6}`}
        fill="none"
        stroke="#8a4a05"
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      {/* drips */}
      {drips.map((d, i) => (
        <g key={i}>
          <path d={d.d} fill="url(#pd-drip)" />
          <ellipse cx={d.x - d.r * 0.35} cy={d.y + d.len * 0.55} rx={d.r * 0.22} ry={d.len * 0.22} fill="#fff" opacity="0.6" />
          <ellipse cx={d.x - d.r * 0.3} cy={d.y + d.len + d.r * 0.1} rx={d.r * 0.25} ry={d.r * 0.3} fill="#fff" opacity="0.75" />
        </g>
      ))}

      {/* specular sweep along the lit side of the rim */}
      <path
        d={`M${CX - R + 30},${TOP + 28} A${R - 10},${RY - 4} 0 0 0 ${CX - 60},${TOP + RY + 1}`}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
