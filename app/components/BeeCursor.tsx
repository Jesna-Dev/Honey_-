"use client";

import { useEffect, useRef } from "react";
import styles from "./BeeCursor.module.css";

/* A small illustrated bee that replaces the mouse pointer. It trails the
   pointer with a little lag, hovers continuously, faces the way it's flying
   and banks into turns. Only on devices with a precise hovering pointer, and
   not for visitors who prefer reduced motion. */

const INTERACTIVE = "a, button, [role='tab'], label, select, summary";

export default function BeeCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || !fine.matches || reduce.matches) return;

    document.documentElement.classList.add("bee-cursor");

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let facing = 1; // 1 = right, -1 = left
    let tilt = 0;
    let visible = false;
    let frame = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        el.dataset.visible = "true";
      }
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      el.dataset.hover = hit ? "true" : "false";
    };
    const onLeave = () => {
      visible = false;
      el.dataset.visible = "false";
    };
    const onDown = () => (el.dataset.press = "true");
    const onUp = () => (el.dataset.press = "false");

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const k = 1 - Math.exp(-10 * dt);
      const vx = (target.x - pos.x) * k;
      const vy = (target.y - pos.y) * k;
      pos.x += vx;
      pos.y += vy;

      // turn around only on a clear change of direction
      if (vx > 0.6) facing = 1;
      else if (vx < -0.6) facing = -1;
      // bank into the motion, settle back to level when hovering
      const bank = Math.max(-28, Math.min(28, vy * 2.2 * facing));
      tilt += (bank - tilt) * Math.min(1, 8 * dt);

      // idle hover: gentle figure-of-eight around the pointer
      const t = now / 1000;
      const hx = Math.sin(t * 1.7) * 3;
      const hy = Math.sin(t * 3.4) * 2.5;

      el.style.transform = `translate3d(${pos.x + hx}px, ${pos.y + hy}px, 0)`;
      el.style.setProperty("--facing", String(facing));
      el.style.setProperty("--tilt", `${tilt}deg`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("bee-cursor");
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} data-visible="false" aria-hidden>
      <div className={styles.bee}>
        <svg viewBox="0 0 64 56" className={styles.svg}>
          <defs>
            <radialGradient id="bee-body" cx="0.4" cy="0.3" r="0.75">
              <stop offset="0" stopColor="#fff2a8" />
              <stop offset="0.35" stopColor="#ffc93a" />
              <stop offset="0.8" stopColor="#e08a00" />
              <stop offset="1" stopColor="#9a5600" />
            </radialGradient>
            <radialGradient id="bee-head" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#6b5a4a" />
              <stop offset="0.5" stopColor="#2a1d14" />
              <stop offset="1" stopColor="#0d0805" />
            </radialGradient>
            <linearGradient id="bee-wing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#cfe6ff" stopOpacity="0.55" />
            </linearGradient>
            <clipPath id="bee-body-clip">
              <ellipse cx="28" cy="34" rx="17" ry="12" />
            </clipPath>
          </defs>

          {/* soft shadow underneath */}
          <ellipse cx="29" cy="52" rx="13" ry="2.4" fill="#000" opacity="0.15" />

          {/* far wing (behind body) */}
          <g className={styles.wingBack}>
            <ellipse cx="24" cy="16" rx="8" ry="13" fill="url(#bee-wing)" stroke="#9cc4ea" strokeWidth="0.8" transform="rotate(-24 24 16)" />
          </g>

          {/* stinger */}
          <path d="M11 35 L4 36.5 L11 38.5 Z" fill="#2a1d14" />

          {/* body with stripes */}
          <ellipse cx="28" cy="34" rx="17" ry="12" fill="url(#bee-body)" />
          <g clipPath="url(#bee-body-clip)" fill="#22160d" opacity="0.9">
            <path d="M15 20 q-3 14 0 28 h5 q-3 -14 0 -28z" />
            <path d="M24 20 q-3 14 0 28 h5 q-3 -14 0 -28z" />
            <path d="M33 20 q-3 14 0 28 h5 q-3 -14 0 -28z" />
          </g>
          {/* specular highlight for the 3D look */}
          <ellipse cx="25" cy="27" rx="9" ry="3.2" fill="#fff" opacity="0.55" />

          {/* head */}
          <circle cx="47" cy="30" r="8.5" fill="url(#bee-head)" />
          <circle cx="50" cy="28.5" r="2.6" fill="#fff" />
          <circle cx="50.7" cy="28.7" r="1.4" fill="#120b06" />
          <circle cx="51.2" cy="28" r="0.5" fill="#fff" />
          <ellipse cx="44.5" cy="25.5" rx="3" ry="1.4" fill="#fff" opacity="0.35" />
          {/* smile */}
          <path d="M49 33.5 q2 1.6 4 0" fill="none" stroke="#ffcf6a" strokeWidth="0.9" strokeLinecap="round" />
          {/* antennae */}
          <path d="M46 22 q0 -7 5 -9" fill="none" stroke="#22160d" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M49 22.5 q2 -6 8 -6.5" fill="none" stroke="#22160d" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="51" cy="13" r="1.6" fill="#22160d" />
          <circle cx="57" cy="16" r="1.6" fill="#22160d" />

          {/* near wing (in front of body) */}
          <g className={styles.wingFront}>
            <ellipse cx="31" cy="15" rx="9" ry="14" fill="url(#bee-wing)" stroke="#9cc4ea" strokeWidth="0.8" transform="rotate(14 31 15)" />
            <path d="M31 4 q-2 10 0 22" fill="none" stroke="#9cc4ea" strokeWidth="0.6" opacity="0.8" transform="rotate(14 31 15)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
