"use client";

import { useState } from "react";
import styles from "../page.module.css";

type Tab = "sheet" | "pairing" | null;

type Props = {
  sheet: [string, string][];
  pairings: string[];
};

export default function ProductTabs({ sheet, pairings }: Props) {
  const [tab, setTab] = useState<Tab>(null);
  const toggle = (t: Exclude<Tab, null>) => setTab((cur) => (cur === t ? null : t));

  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${tab === "sheet" ? styles.tabActive : ""}`}
        aria-expanded={tab === "sheet"}
        onClick={() => toggle("sheet")}
      >
        Technical sheet <span>{tab === "sheet" ? "−" : "+"}</span>
      </button>
      <div className={`${styles.panel} ${tab === "sheet" ? styles.panelOpen : ""}`}>
        <div>
          <dl className={styles.sheet}>
            {sheet.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <button
        className={`${styles.tab} ${tab === "pairing" ? styles.tabActive : ""}`}
        aria-expanded={tab === "pairing"}
        onClick={() => toggle("pairing")}
      >
        Enjoy it with <span>{tab === "pairing" ? "−" : "+"}</span>
      </button>
      <div className={`${styles.panel} ${tab === "pairing" ? styles.panelOpen : ""}`}>
        <div>
          <ul className={styles.pairings}>
            {pairings.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
