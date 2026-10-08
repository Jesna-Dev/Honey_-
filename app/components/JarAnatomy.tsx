"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import styles from "../page.module.css";

/* Exploded view of the jar, driven by scroll. The section is tall and its
   stage is sticky. The rolling jar docks on the first slot (stage pinned),
   hides while the section is pinned (`data-jar-hide`), and picks up again
   from the second slot when the pin releases. In between, this component
   pulls the jar apart into its parts and draws a callout for each. */

// Slices of tilia-jar-render.png (837 × 1249): top and height in % of the jar.
const parts = [
  { key: "lid", src: "/images/anatomy/lid.png", w: 837, h: 168, top: 0, height: 13.45, dy: -21, rot: -7 },
  { key: "neck", src: "/images/anatomy/neck.png", w: 837, h: 110, top: 13.45, height: 8.81, dy: -6, rot: 0 },
  { key: "body", src: "/images/anatomy/body.png", w: 837, h: 872, top: 22.26, height: 69.82, dy: 0, rot: 0 },
  { key: "base", src: "/images/anatomy/base.png", w: 837, h: 99, top: 92.07, height: 7.93, dy: 12, rot: 5 },
];

// Callouts: y = where on the jar (in % of its height, before exploding),
// dy = how far that point moves when exploded, x = where the leader starts.
const callouts = [
  { title: "Lid", text: "Twists shut to lock in the aroma.", y: 6.7, dy: -21, x: 88 },
  { title: "Freshness seal", text: "Keeps the honey sealed until opened.", y: 13.4, dy: -13, x: 80 },
  { title: "Glass neck", text: "Wide enough to spoon from.", y: 17.9, dy: -6, x: 84 },
  { title: "Label", text: "Our giant honey bee emblem.", y: 46, dy: 0, x: 97 },
  { title: "Wild honey", text: "Raw, unheated and never blended.", y: 76, dy: 0, x: 99 },
  { title: "Glass base", text: "Heavy and stable on the shelf.", y: 96, dy: 12, x: 90 },
];

// Honey droplets that drift outward as the jar opens (cqh offsets).
const drops = [
  { x: 10, y: 20, dx: -18, dy: -10, s: 10 },
  { x: 86, y: 10, dx: 16, dy: -14, s: 8 },
  { x: 4, y: 62, dx: -22, dy: 4, s: 12 },
  { x: 94, y: 70, dx: 20, dy: 8, s: 9 },
  { x: 30, y: 98, dx: -10, dy: 16, s: 7 },
  { x: 70, y: 4, dx: 8, dy: -22, s: 6 },
];

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export default function JarAnatomy() {
  const section = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const el = box.current;
    if (!sec || !el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const r = sec.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / range));
      // open between 8–42% of the pin, close again at the end for the hand-off
      const e = smoothstep(0.08, 0.42, p) * (1 - smoothstep(0.86, 0.98, p));
      el.style.setProperty("--e", e.toFixed(4));
      callouts.forEach((_, i) => {
        const c = smoothstep(0.3 + i * 0.06, 0.4 + i * 0.06, p) * (1 - smoothstep(0.78, 0.88, p));
        el.style.setProperty(`--c${i}`, c.toFixed(4));
      });
      el.style.opacity = p > 0.001 && p < 0.999 ? "1" : "0";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section id="inside" ref={section} className={styles.anatomy} data-jar-hide="pin">
      {/* where the rolling jar hands over (pin start) and takes back (pin end) */}
      <div className={`${styles.anatomySlot} ${styles.anatomySlotStart}`} data-jar-slot data-jar-tilt="0" />
      <div className={`${styles.anatomySlot} ${styles.anatomySlotEnd}`} data-jar-slot data-jar-tilt="0" />

      <div className={styles.anatomyStage}>
        <div className={styles.anatomyIntro}>
          <p className={styles.kickerLight}>Inside the jar</p>
          <h2 className={styles.h2Light}>Made to keep it wild</h2>
          <p className={styles.lightP}>Keep scrolling to take a Tilia jar apart.</p>
        </div>

        <div ref={box} className={styles.anatomyBox} style={{ opacity: 0 }} aria-hidden>
          <div className={styles.anatomyGlow} />

          {drops.map((d, i) => (
            <span
              key={i}
              className={styles.anatomyDrop}
              style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, "--dx": d.dx, "--dy": d.dy } as Vars}
            />
          ))}

          {/* freshness seal, revealed between lid and neck */}
          <svg className={styles.anatomySeal} viewBox="0 0 200 40" style={{ "--dy": -13 } as Vars}>
            <defs>
              <pattern id="seal-hex" width="12" height="10.4" patternUnits="userSpaceOnUse">
                <path d="M6 0 L12 3.5 V7 L6 10.4 L0 7 V3.5 Z" fill="none" stroke="#d9cdb8" strokeWidth="0.8" />
              </pattern>
              <radialGradient id="seal-fill" cx="0.4" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#e9e0d0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="22" rx="96" ry="15" fill="#b9ab94" opacity="0.5" />
            <ellipse cx="100" cy="18" rx="96" ry="15" fill="url(#seal-fill)" />
            <ellipse cx="100" cy="18" rx="96" ry="15" fill="url(#seal-hex)" />
            <path d="M60 31 q3 8 6 0 M128 32 q2.5 9 5 0" fill="#f2a92a" />
          </svg>

          {parts.map((part) => (
            <div
              key={part.key}
              className={styles.anatomyPart}
              style={{ top: `${part.top}%`, height: `${part.height}%`, "--dy": part.dy, "--rot": part.rot } as Vars}
            >
              <Image src={part.src} alt="" fill sizes="360px" />
            </div>
          ))}

          <ul className={styles.callouts}>
            {callouts.map((c, i) => (
              <li
                key={c.title}
                style={{ "--y": c.y, "--cdy": c.dy, "--x": c.x, "--c": `var(--c${i}, 0)` } as Vars}
              >
                <span className={styles.calloutDot} />
                <span className={styles.calloutLine} />
                <span className={styles.calloutText}>
                  <strong>{c.title}</strong>
                  <span>{c.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
