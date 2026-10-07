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
        <div className={styles.showcaseSide}>
          <span className={styles.ghostHex} aria-hidden />
          <p className={styles.showcaseKicker}>Raw · Unheated · Wild</p>
        </div>

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
