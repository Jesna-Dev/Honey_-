type JarProps = {
  honey: string;
  label: string;
  className?: string;
};

/* Illustrated honey jar used in place of product photography. */
export default function Jar({ honey, label, className }: JarProps) {
  const id = label.replace(/\W+/g, "");
  return (
    <svg
      className={className}
      viewBox="0 0 200 280"
      role="img"
      aria-label={`${label} honey jar`}
    >
      <defs>
        <linearGradient id={`glass-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={honey} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={honey} stopOpacity="0.75" />
          <stop offset="1" stopColor={honey} stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* lid */}
      <rect x="44" y="18" width="112" height="34" rx="6" fill="#2a231c" />
      <rect x="44" y="44" width="112" height="8" fill="#b8892f" />
      {/* body */}
      <path
        d="M40 62 Q40 54 50 54 H150 Q160 54 160 62 V250 Q160 266 144 266 H56 Q40 266 40 250 Z"
        fill={`url(#glass-${id})`}
      />
      <path d="M54 72 V244" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" />
      {/* label */}
      <rect x="52" y="118" width="96" height="92" rx="2" fill="#fbf7ef" />
      <rect x="58" y="124" width="84" height="80" fill="none" stroke="#b8892f" strokeWidth="1" />
      <path d="M100 138 l8 5 v9 l-8 5 l-8 -5 v-9 z" fill="none" stroke="#b8892f" strokeWidth="1.5" />
      <text x="100" y="178" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" letterSpacing="2" fill="#1a1612">
        HONEYBEE
      </text>
      <text x="100" y="194" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="10" fill="#5c544a">
        {label}
      </text>
    </svg>
  );
}
