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

/* Minimal accordion: one question open at a time, answers expand in place. */
export default function FactTabs() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <ul className={styles.facts}>
      {facts.map((f, i) => {
        const open = i === active;
        return (
          <li key={f.q} className={`${styles.factItem} ${open ? styles.factItemOpen : ""}`}>
            <button
              className={styles.factTab}
              aria-expanded={open}
              onClick={() => setActive(open ? null : i)}
            >
              <span className={styles.factNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.factQ}>{f.q}</span>
              <span className={styles.factIcon} aria-hidden />
            </button>
            <div className={styles.factAnswer}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
