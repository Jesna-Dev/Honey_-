"use client";

import { useEffect, useState } from "react";
import Jar from "./Jar";
import styles from "../page.module.css";

const slides = [
  { honey: "#e0a526", label: "Wildflower", bg: "#f6ecd6" },
  { honey: "#f3d27a", label: "Clover", bg: "#f3efe3" },
  { honey: "#7a3f12", label: "Buckwheat", bg: "#efe2d2" },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const go = (next: number) => {
    if (next === index) return;
    setPrev(index);
    setIndex(next);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setPrev(index);
      setIndex((index + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [index]);

  return (
    <section id="top" className={styles.hero} style={{ background: slides[index].bg }}>
      <div className={styles.heroMosaic} />
      {slides.map((s, i) => (
        <div
          key={s.label}
          className={`${styles.heroSlide} ${i === index ? styles.heroSlideActive : ""} ${
            i === prev ? styles.heroSlideLeaving : ""
          }`}
          aria-hidden={i !== index}
        >
          {/* key forces a remount so the roll replays every time the slide becomes active */}
          <div
            key={i === index ? `in-${index}` : i === prev ? `out-${prev}` : "idle"}
            className={styles.heroJarRoll}
          >
            <Jar honey={s.honey} label={s.label} className={styles.heroJar} />
          </div>
          <div className={styles.heroShadow} />
        </div>
      ))}

      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Raw · Unheated · Small batch</p>
        <h1 className={styles.heroTitle}>
          Where craft <em>meets</em> honey
        </h1>
      </div>

      <div className={styles.heroDots}>
        {slides.map((s, i) => (
          <button
            key={s.label}
            className={`${styles.heroDot} ${i === index ? styles.heroDotActive : ""}`}
            aria-label={`Show ${s.label}`}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <a href="#story" className={styles.scrollCue}>
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
