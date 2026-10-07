"use client";

import { useState } from "react";
import styles from "../page.module.css";

const tabs = [
  {
    id: "honey",
    label: "The honey",
    title: "Pure Giant Wild Honey",
    body: (
      <>
        <p>
          Deep amber, floral and full-bodied, with a long, warm finish. Raw honey may
          crystallise in cool weather; that&apos;s a natural sign it hasn&apos;t been
          processed.
        </p>
        <ul className={styles.notes}>
          <li>Deep amber</li>
          <li>Floral</li>
          <li>Rich finish</li>
        </ul>
      </>
    ),
  },
  {
    id: "sheet",
    label: "Technical sheet",
    title: "At a glance",
    body: (
      <dl className={styles.sheet}>
        {[
          ["Variety", "Giant wild honey"],
          ["Source", "Wild giant honey bee colonies"],
          ["Processing", "Raw, unheated, gently strained"],
          ["Net weight", "500 g"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "pairing",
    label: "Enjoy it with",
    title: "Good company",
    body: (
      <ul className={styles.pairings}>
        {["Warm water & lemon", "Ginger tea", "Banana & oats", "Fresh curd", "Toasted bread", "Fruit salads"].map(
          (p) => (
            <li key={p}>{p}</li>
          ),
        )}
      </ul>
    ),
  },
  {
    id: "storage",
    label: "Storage",
    title: "Keep it golden",
    body: (
      <p>
        Store at room temperature with the lid closed, away from direct sunlight. If it
        crystallises, stand the jar in warm (not hot) water and stir gently.
      </p>
    ),
  },
];

const features = [
  {
    title: "Raw",
    text: "Straight from the comb, nothing added.",
    icon: "M12 3c3 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.8 6-11z",
  },
  {
    title: "Unheated",
    text: "Gently strained to keep its character.",
    icon: "M12 3v10m-4-6a6 6 0 1 0 8 0M4 4l16 16",
  },
  {
    title: "Wild-harvested",
    text: "From giant honey bees in the forest.",
    icon: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14zm0 0 7-7",
  },
];

export default function ProductShowcase() {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active)!;

  return (
    <>
      <div className={styles.pillTabs} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            className={`${styles.pillTab} ${t.id === active ? styles.pillTabActive : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.showcase}>
        <ul className={styles.features}>
          {features.map((f, i) => (
            <li key={f.title}>
              <span className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d={f.icon} />
                </svg>
              </span>
              <div>
                <small>{String(i + 1).padStart(2, "0")}</small>
                <strong>{f.title}</strong>
                <p>{f.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.showcaseStage}>
          <div className={styles.stageGlow} aria-hidden />
          <div className={styles.slotLg} data-jar-slot data-jar-tilt="0" />
        </div>

        <div key={tab.id} className={`${styles.text} ${styles.showcaseInfo}`} role="tabpanel">
          <h3>{tab.title}</h3>
          <p className={styles.weight}>500 g</p>
          {tab.body}
          <a href="#order" className={styles.pillBtn}>
            Order now
          </a>
        </div>
      </div>
    </>
  );
}
