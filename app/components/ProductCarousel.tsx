"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "../page.module.css";

/* Product picker: a name bar, a jar carousel (active jar centred, neighbours
   faded either side, new jar slides in from the right) and an order panel on
   the left with weight, quantity and "Order now". Picking "Order now" scrolls
   to the order form and pre-fills it via a `tilia:order` event. */

// Placeholder range: replace names, copy and images with the real products.
// Every variant uses the same render for now, with a slight tint per jar.
const products = [
  {
    name: "Giant Wild Honey",
    text: "Our signature raw honey from the open combs of wild giant honey bees.",
    tint: "none",
  },
  {
    name: "Forest Blossom",
    text: "Lighter and floral, gathered in the forest's flowering season.",
    tint: "saturate(0.8) brightness(1.12)",
  },
  {
    name: "Wild Comb Honey",
    text: "Raw honey with pieces of natural comb, just as the bees made it.",
    tint: "saturate(1.15) contrast(1.05)",
  },
  {
    name: "Dark Forest Honey",
    text: "Deep, rich and robust, from the late-season forest bloom.",
    tint: "brightness(0.82) saturate(1.2) sepia(0.15)",
  },
];

const weights = ["250 g", "500 g", "1 kg"];

export default function ProductCarousel() {
  const [active, setActive] = useState(0);
  const [weight, setWeight] = useState(weights[1]);
  const [qty, setQty] = useState(1);
  const n = products.length;
  const at = (i: number) => products[(i + n) % n];
  const product = products[active];

  const go = (i: number) => setActive((i + n) % n);

  const order = () => {
    window.dispatchEvent(
      new CustomEvent("tilia:order", { detail: { name: product.name, weight, qty } }),
    );
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className={styles.pillTabs} role="tablist">
        {products.map((p, i) => (
          <button
            key={p.name}
            role="tab"
            aria-selected={i === active}
            className={`${styles.pillTab} ${i === active ? styles.pillTabActive : ""}`}
            onClick={() => go(i)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={styles.picker}>
        {/* order panel */}
        <div key={product.name} className={`${styles.text} ${styles.pickerInfo}`}>
          <h3>{product.name}</h3>
          <p>{product.text}</p>

          <div className={styles.option}>
            <span className={styles.optionLabel}>Jar weight</span>
            <div className={styles.weights} role="radiogroup" aria-label="Jar weight">
              {weights.map((w) => (
                <button
                  key={w}
                  role="radio"
                  aria-checked={w === weight}
                  className={`${styles.weight} ${w === weight ? styles.weightActive : ""}`}
                  onClick={() => setWeight(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.option}>
            <span className={styles.optionLabel}>Quantity</span>
            <div className={styles.stepper}>
              <button aria-label="Fewer jars" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <output aria-live="polite">{qty}</output>
              <button aria-label="More jars" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                +
              </button>
            </div>
          </div>

          <button className={styles.pillBtn} onClick={order}>
            Order now
          </button>
        </div>

        {/* jar carousel */}
        <div className={styles.carousel}>
          <button className={`${styles.neighbour} ${styles.neighbourPrev}`} onClick={() => go(active - 1)} aria-label={`Show ${at(active - 1).name}`}>
            <Image src="/images/tilia-jar-render.png" alt="" width={837} height={1249} sizes="140px" style={{ filter: at(active - 1).tint }} />
          </button>

          <button className={styles.arrow} onClick={() => go(active - 1)} aria-label="Previous honey">
            ‹
          </button>

          {/* key remounts the jar so it fades in, gliding gently from the right */}
          <div key={active} className={styles.activeJar}>
            <Image
              src="/images/tilia-jar-render.png"
              alt={`${product.name}, ${weight} jar`}
              width={837}
              height={1249}
              sizes="(max-width: 768px) 50vw, 300px"
              style={{ filter: product.tint }}
            />
          </div>

          <button className={styles.arrow} onClick={() => go(active + 1)} aria-label="Next honey">
            ›
          </button>

          <button className={`${styles.neighbour} ${styles.neighbourNext}`} onClick={() => go(active + 1)} aria-label={`Show ${at(active + 1).name}`}>
            <Image src="/images/tilia-jar-render.png" alt="" width={837} height={1249} sizes="140px" style={{ filter: at(active + 1).tint }} />
          </button>
        </div>
      </div>
    </>
  );
}
