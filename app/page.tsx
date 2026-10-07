import Image from "next/image";
import Header from "./components/Header";
import ProductTabs from "./components/ProductTabs";
import ScrollJar from "./components/ScrollJar";
import styles from "./page.module.css";

const sheet: [string, string][] = [
  ["Variety", "Giant wild honey"],
  ["Source", "Wild giant honey bee colonies"],
  ["Processing", "Raw, unheated, gently strained"],
  ["Net weight", "500 g"],
  ["Storage", "Room temperature, away from sunlight"],
];

const pairings = ["Warm water & lemon", "Ginger tea", "Banana & oats", "Fresh curd", "Toasted bread", "Fruit salads"];

// Floating honey droplets in the hero sky (some blurred for depth).
const drops = [
  { x: "8%", y: "62%", size: 38, blur: 3 },
  { x: "18%", y: "20%", size: 14, blur: 0 },
  { x: "30%", y: "48%", size: 10, blur: 1 },
  { x: "62%", y: "14%", size: 16, blur: 0 },
  { x: "70%", y: "44%", size: 26, blur: 2 },
  { x: "88%", y: "24%", size: 18, blur: 1 },
  { x: "92%", y: "70%", size: 44, blur: 4 },
  { x: "45%", y: "78%", size: 12, blur: 0 },
];

const chips = [
  { label: "Raw", icon: "M12 3c3 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.8 6-11z" },
  { label: "Unheated", icon: "M12 3v10m-4-6a6 6 0 1 0 8 0M4 4l16 16" },
  { label: "Wild-harvested", icon: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14zm0 0 7-7" },
  { label: "500 g", icon: "M8 3h8v3H8zM7 6h10l1 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z" },
];

export default function Home() {
  return (
    <>
      <Header />
      <ScrollJar />

      <main>
        {/* Hero */}
        <section id="top" className={styles.hero}>
          <div className={styles.heroSky} aria-hidden>
            <span className={`${styles.cloud} ${styles.cloud1}`} />
            <span className={`${styles.cloud} ${styles.cloud2}`} />
            <span className={`${styles.cloud} ${styles.cloud3}`} />
            {drops.map((d, i) => (
              <span
                key={i}
                className={styles.drop}
                style={{
                  left: d.x,
                  top: d.y,
                  width: d.size,
                  height: d.size,
                  filter: d.blur ? `blur(${d.blur}px)` : undefined,
                  animationDelay: `${i * -1.3}s`,
                }}
              />
            ))}
          </div>

          <h1 className={styles.heroHeadline}>
            The wild,
            <br />
            in a jar
          </h1>

          <div className={styles.heroStage}>
            <div className={`${styles.glassCard} ${styles.heroIntro}`}>
              <h2>Straight from the forest</h2>
              <p>
                Raw honey from the giant wild honey bee, jarred just as the bees made it.
              </p>
              <a href="#buy" className={styles.pillBtn}>
                Shop now
              </a>
            </div>

            <div className={styles.heroCenter}>
              <div className={styles.heroSlot} data-jar-slot data-jar-tilt="0" />
              <Image
                src="/images/honeycomb.png"
                alt=""
                width={478}
                height={553}
                preload
                className={styles.comb}
                sizes="(max-width: 768px) 80vw, 460px"
              />
            </div>

            <figure className={styles.photoCard}>
              <figcaption className={styles.photoCapTop}>Gathered in the wild</figcaption>
              <div className={styles.photoFrame}>
                <Image
                  src="/images/tilia-photo.jpg"
                  alt="A jar of Tilia Pure Giant Wild Honey on grass"
                  fill
                  sizes="(max-width: 768px) 80vw, 240px"
                />
              </div>
              <figcaption className={styles.photoCapBottom}>Raw, rich &amp; unheated</figcaption>
            </figure>
          </div>

          <ul className={styles.chips}>
            {chips.map((c) => (
              <li key={c.label} className={styles.chip}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d={c.icon} />
                </svg>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Story */}
        <section id="story" className={`${styles.section} ${styles.reverse}`}>
          <div className={`${styles.slot} ${styles.slotSmall}`} data-jar-slot data-jar-tilt="-8" />
          <div className={styles.text}>
            <p className={styles.eyebrow}>Our story</p>
            <h2 className={styles.title}>
              From the <em>forest canopy</em>
            </h2>
            <p>
              Giant honey bees don&apos;t live in boxes. They build single, open combs high in
              tall trees and on rock faces, feeding on whatever the wild forest is blooming.
            </p>
            <p>
              Tilia brings that honey to your table with as little in between as possible: no
              heating, no blending, no additives. Just the colour, aroma and depth of the wild.
            </p>
          </div>
        </section>

        {/* Product */}
        <section id="honey" className={`${styles.section} ${styles.soft}`}>
          <div className={styles.text}>
            <p className={styles.eyebrow}>The honey · 500 g</p>
            <h2 className={styles.title}>
              Pure Giant <em>Wild Honey</em>
            </h2>
            <ul className={styles.notes}>
              <li>Deep amber</li>
              <li>Floral</li>
              <li>Rich finish</li>
            </ul>
            <p>
              A full-bodied honey with a warm, layered sweetness. Because it&apos;s raw, it may
              crystallise in cooler weather; that&apos;s a natural sign it hasn&apos;t been
              processed. Warm the jar gently to bring it back.
            </p>
            <ProductTabs sheet={sheet} pairings={pairings} />
          </div>
          <div className={styles.slot} data-jar-slot data-jar-tilt="6" />
        </section>

        {/* Region */}
        <section id="region" className={`${styles.section} ${styles.reverse}`}>
          <div className={`${styles.slot} ${styles.slotSmall}`} data-jar-slot data-jar-tilt="-4" />
          <div className={styles.text}>
            <p className={styles.eyebrow}>Where it comes from</p>
            <h2 className={styles.title}>
              The <em>Western Ghats</em>
            </h2>
            <p>
              A green mountain range running along India&apos;s west coast, home to dense
              forest and a huge variety of flowering plants, and to the wild bees that feed
              on them.
            </p>
            <div className={styles.mapWrap}>
              <iframe
                title="Map of the Western Ghats in Kerala"
                className={styles.map}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=75.4%2C8.6%2C77.6%2C12.2&layer=mapnik&marker=10.4%2C76.6"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="buy" className={`${styles.section} ${styles.dark}`}>
          <div className={styles.ctaMosaic} aria-hidden />
          <div className={styles.text}>
            <p className={styles.eyebrowLight}>Bring it home</p>
            <h2 className={styles.title}>
              Taste the <em>wild</em>
            </h2>
            <p className={styles.ctaText}>
              Order a 500 g jar of Tilia Pure Giant Wild Honey directly from us.
            </p>
            <a href="mailto:hello@tiliahoney.example" className={styles.btnPrimary}>
              Buy now
            </a>
          </div>
          <div className={styles.slot} data-jar-slot data-jar-tilt="0" />
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a href="#top" className={styles.logo}>
            TILIA<small>HONEY</small>
          </a>
          <div className={styles.footerCols}>
            <div>
              <h4>Contact</h4>
              <a href="mailto:hello@tiliahoney.example">hello@tiliahoney.example</a>
              <a href="tel:+910000000000">+91 00000 00000</a>
            </div>
            <div>
              <h4>Visit</h4>
              <p>
                Address line
                <br />
                Kerala, India
              </p>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Tilia Honey. All rights reserved.</span>
          <span>Not suitable for infants under 12 months.</span>
        </div>
      </footer>
    </>
  );
}
