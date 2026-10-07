"use client";

import { useState } from "react";
import styles from "../page.module.css";

const facts = [
  {
    q: "Why does raw honey crystallise?",
    a: "Honey is a supersaturated sugar solution, so over time some of the glucose forms crystals. It's natural, harmless and reversible: warm the jar gently in water and it turns liquid again.",
  },
  {
    q: "Who are giant honey bees?",
    a: "Giant honey bees are large wild bees that don't live in hives. They build a single open comb hanging from tall trees or cliff faces, often high above the forest floor.",
  },
  {
    q: "How long does honey keep?",
    a: "Sealed and stored away from moisture, honey keeps for a very long time thanks to its low water content and natural acidity. Always use a clean, dry spoon.",
  },
  {
    q: "Is honey suitable for babies?",
    a: "No. Honey of any kind shouldn't be given to infants under 12 months old.",
  },
];

export default function FactTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.facts}>
      <div className={styles.factList} role="tablist" aria-orientation="vertical">
        {facts.map((f, i) => (
          <button
            key={f.q}
            role="tab"
            aria-selected={i === active}
            className={`${styles.factTab} ${i === active ? styles.factTabActive : ""}`}
            onClick={() => setActive(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {f.q}
          </button>
        ))}
      </div>
      <div key={active} className={styles.factPanel} role="tabpanel">
        <h3>{facts[active].q}</h3>
        <p>{facts[active].a}</p>
      </div>
    </div>
  );
}
