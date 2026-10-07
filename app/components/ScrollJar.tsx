"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "../page.module.css";

/* The jar is fixed to the viewport and travels between "slots" — empty
   placeholders in each section marked with `data-jar-slot`. While a slot is
   near the middle of the screen the jar rides along with it; between slots
   it rolls across to the next one. Layout (and therefore responsiveness) is
   decided entirely by where the slots sit in CSS. */

const JAR_W = 837;
const JAR_H = 1249;

type Pose = { x: number; y: number; scale: number; rot: number };

// How quickly the drawn jar catches up with its scroll position (per second).
// Lower = floatier; higher = tighter to the scrollbar.
const FOLLOW = 3;

type Stop = {
  anchor: number; // scrollY at which the slot is centred in the viewport
  x: number; // slot centre, viewport coords at `anchor`
  y: number;
  scale: number;
  tilt: number;
};

// Ken Perlin's smootherstep: zero velocity *and* acceleration at both ends,
// so the jar eases out of one slot and into the next without a jolt.
const smootherstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ScrollJar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stops: Stop[] = [];
    let frame = 0;

    const measure = () => {
      const vh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - vh;
      stops = Array.from(document.querySelectorAll<HTMLElement>("[data-jar-slot]"))
        .map((slot) => {
          const r = slot.getBoundingClientRect();
          const docY = r.top + window.scrollY + r.height / 2;
          const anchor = Math.min(maxScroll, Math.max(0, docY - vh / 2));
          return {
            anchor,
            x: r.left + r.width / 2,
            y: docY - anchor,
            scale: r.height / JAR_H,
            tilt: Number(slot.dataset.jarTilt ?? 0),
          };
        })
        .sort((a, b) => a.anchor - b.anchor);
    };

    // Where the scroll position says the jar should be.
    const target = (): Pose | null => {
      if (!stops.length) return null;
      const s = window.scrollY;

      // Pose of the jar if it were glued to stop `i`.
      const docked = (i: number) => ({ ...stops[i], y: stops[i].y - (s - stops[i].anchor) });

      let i = stops.findIndex((st, k) => k === stops.length - 1 || s < stops[k + 1].anchor);
      if (s < stops[0].anchor) i = 0;
      const a = docked(i);
      const next = stops[i + 1];

      if (!next || s < a.anchor) return { x: a.x, y: a.y, scale: a.scale, rot: a.tilt };

      const b = docked(i + 1);
      const t = smootherstep(0, 1, (s - a.anchor) / (next.anchor - a.anchor));

      // Roll: one unhurried full turn per trip (none for short hops), so the
      // label is upright again at every slot.
      const dx = b.x - a.x;
      const width = JAR_W * Math.max(a.scale, b.scale);
      const turns = reduceMotion.matches || Math.abs(dx) < width * 0.5
        ? 0
        : Math.sign(dx);

      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        scale: lerp(a.scale, b.scale, t),
        rot: lerp(a.tilt, b.tilt, t) + turns * 360 * t,
      };
    };

    // The drawn pose eases toward the target every frame (frame-rate
    // independent), which smooths out stepped mouse-wheel scrolling.
    let current: Pose | null = null;
    let last = 0;

    const render = (now: number) => {
      frame = 0;
      const goal = target();
      if (!goal) return;

      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1;
      last = now;
      const k = !current || reduceMotion.matches ? 1 : 1 - Math.exp(-FOLLOW * dt);
      const c: Pose = current
        ? {
            x: lerp(current.x, goal.x, k),
            y: lerp(current.y, goal.y, k),
            scale: lerp(current.scale, goal.scale, k),
            rot: lerp(current.rot, goal.rot, k),
          }
        : goal;
      current = c;

      el.style.transform =
        `translate3d(${c.x - JAR_W / 2}px, ${c.y - JAR_H / 2}px, 0) scale(${c.scale}) rotate(${c.rot}deg)`;
      el.style.opacity = "1";

      const settled =
        Math.abs(c.x - goal.x) < 0.1 &&
        Math.abs(c.y - goal.y) < 0.1 &&
        Math.abs(c.scale - goal.scale) < 0.0005 &&
        Math.abs(c.rot - goal.rot) < 0.05;
      if (settled) last = 0;
      else frame = requestAnimationFrame(render);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    remeasure();
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={styles.scrollJar} aria-hidden>
      <div className={styles.scrollJarFloat}>
        <Image
          src="/images/tilia-jar-render.png"
          alt=""
          width={JAR_W}
          height={JAR_H}
          preload
          sizes="(max-width: 768px) 60vw, 34vw"
        />
      </div>
    </div>
  );
}
