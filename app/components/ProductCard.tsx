"use client";

import { useState } from "react";
import Jar from "./Jar";
import styles from "../page.module.css";

export type Product = {
  name: string;
  type: string;
  harvest: string;
  honey: string;
  notes: string[];
  description: string;
  sheet: [string, string][];
  pairings: string[];
};

type Tab = "sheet" | "pairing" | null;

export default function ProductCard({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>(null);
  const toggle = (t: Exclude<Tab, null>) => setTab((cur) => (cur === t ? null : t));

  return (
    <article className={styles.card}>
      <div className={styles.cardImage}>
        <Jar honey={product.honey} label={product.name} className={styles.cardJar} />
      </div>

      <p className={styles.cardMeta}>
        {product.type} · {product.harvest}
      </p>
      <h3 className={styles.cardTitle}>{product.name}</h3>

      <ul className={styles.cardNotes}>
        {product.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <p className={styles.cardDesc}>{product.description}</p>

      <div className={styles.cardTabs}>
        <button
          className={`${styles.cardTab} ${tab === "sheet" ? styles.cardTabActive : ""}`}
          aria-expanded={tab === "sheet"}
          onClick={() => toggle("sheet")}
        >
          Technical sheet <span>{tab === "sheet" ? "−" : "+"}</span>
        </button>
        <button
          className={`${styles.cardTab} ${tab === "pairing" ? styles.cardTabActive : ""}`}
          aria-expanded={tab === "pairing"}
          onClick={() => toggle("pairing")}
        >
          Food pairing <span>{tab === "pairing" ? "−" : "+"}</span>
        </button>
      </div>

      <div className={`${styles.cardPanel} ${tab ? styles.cardPanelOpen : ""}`}>
        <div>
          {tab === "sheet" && (
            <dl className={styles.sheet}>
              {product.sheet.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === "pairing" && (
            <ul className={styles.pairings}>
              {product.pairings.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
