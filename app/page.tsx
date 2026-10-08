import Image from "next/image";
import BeeCursor from "./components/BeeCursor";
import { Forest } from "./components/Edges";
import FactTabs from "./components/FactTabs";
import JarAnatomy from "./components/JarAnatomy";
import Header from "./components/Header";
import OrderForm from "./components/OrderForm";
import ProductCarousel from "./components/ProductCarousel";
import ScrollJar from "./components/ScrollJar";
import styles from "./page.module.css";

// Floating honey droplets in the hero (some blurred for depth).
const drops = [
  { x: "6%", y: "70%", size: 30, blur: 2 },
  { x: "22%", y: "16%", size: 12, blur: 0 },
  { x: "46%", y: "64%", size: 16, blur: 1 },
  { x: "58%", y: "18%", size: 10, blur: 0 },
  { x: "90%", y: "62%", size: 36, blur: 3 },
];

const regionBadges = [
  { title: "Forest", text: "Wild combs high in the canopy" },
  { title: "Raw", text: "Never heated, never blended" },
  { title: "Hand-jarred", text: "Strained and sealed with care" },
];

const steps = [
  { n: "01", title: "Found in the forest", text: "Giant honey bees build open combs high in trees and on rock faces." },
  { n: "02", title: "Harvested by hand", text: "Combs are gathered carefully, taking honey while leaving the colony to recover." },
  { n: "03", title: "Strained, not heated", text: "The honey is gently strained to remove wax, keeping its natural character." },
  { n: "04", title: "Jarred and sealed", text: "Every jar is filled and sealed, ready to bring the wild to your table." },
];

const stats = [
  { value: "100%", label: "raw honey" },
  { value: "0", label: "additives" },
  { value: "500 g", label: "per jar" },
];

export default function Home() {
  return (
    <>
      <Header />
      <ScrollJar />
      <BeeCursor />

      <main>
        {/* ---------- Hero (honey orange) ---------- */}
        <section id="top" className={styles.hero}>
          <div className={styles.heroHex} aria-hidden />
          {drops.map((d, i) => (
            <span
              key={i}
              className={styles.drop}
              aria-hidden
              style={{
                left: d.x,
                top: d.y,
                width: d.size,
                height: d.size,
                filter: d.blur ? `blur(${d.blur}px)` : undefined,
                animationDelay: `${i * -1.4}s`,
              }}
            />
          ))}
          <Image
            src="/images/honeycomb.png"
            alt=""
            width={478}
            height={553}
            className={styles.heroComb}
            sizes="220px"
          />

          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.heroScript}>Tilia</p>
              <h1 className={styles.heroTitle}>Pure Giant Wild Honey</h1>
              <p className={styles.heroLead}>
                Raw honey from the giant wild honey bee, gathered from the forest and jarred
                just as the bees made it.
              </p>
              <div className={styles.heroActions}>
                <a href="#order" className={styles.pillBtnDark}>
                  Order a jar
                </a>
                <a href="#product" className={styles.pillGhost}>
                  Discover
                </a>
              </div>
            </div>
            <div className={styles.slotXl} data-jar-slot data-jar-tilt="-4" />
          </div>

          {/* honeycomb melting into drips that hang over the next section */}
          <div className={styles.heroDrips} aria-hidden />
        </section>

        {/* ---------- Product ---------- */}
        {/* the carousel shows its own jars, so the rolling jar steps aside here */}
        <section id="product" className={styles.product} data-jar-hide="view">
          <div className={styles.head}>
            <p className={styles.kicker}>Our honey</p>
            <h2 className={styles.h2}>Find your favourite</h2>
          </div>
          <ProductCarousel />
        </section>

        {/* ---------- Origin (purple) ---------- */}
        <section id="origin" className={styles.origin}>
          <div className={styles.originInner}>
            <div className={styles.slotMd} data-jar-slot data-jar-tilt="-8" />
            <div className={styles.text}>
              <p className={styles.kickerLight}>From the wild</p>
              <h2 className={styles.h2Light}>The Western Ghats</h2>
              <p className={styles.lightP}>
                A green mountain range along India&apos;s west coast, home to dense forest, a
                huge variety of flowering plants, and the wild bees that feed on them.
              </p>
              <div className={styles.mapCard}>
                <iframe
                  title="Map of the Western Ghats in Kerala"
                  className={styles.map}
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=75.4%2C8.6%2C77.6%2C12.2&layer=mapnik&marker=10.4%2C76.6"
                />
              </div>
              <ul className={styles.hexBadges}>
                {regionBadges.map((b) => (
                  <li key={b.title}>
                    <strong>{b.title}</strong>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Order ---------- */}
        <section id="order" className={styles.order}>
          <div className={styles.orderInner}>
            <div className={styles.orderPitch}>
              <p className={styles.kicker}>Order</p>
              <h2 className={styles.h2}>Bring a jar home</h2>
              <p className={styles.p}>
                Leave your details and we&apos;ll get back to you to confirm your order and
                delivery.
              </p>
              <ul className={styles.orderMeta}>
                <li>
                  <span>Size</span>
                  <strong>500 g jar</strong>
                </li>
                <li>
                  <span>Honey</span>
                  <strong>Raw · Unheated</strong>
                </li>
              </ul>
            </div>
            <div className={styles.formCard}>
              <h3>Request your jar</h3>
              <OrderForm />
            </div>
          </div>
        </section>

        {/* ---------- Wholesale ---------- */}
        <section id="wholesale" className={styles.wholesale}>
          <div className={styles.wholesaleInner}>
            <div className={styles.wholesaleCard}>
              <p className={styles.kicker}>For shops &amp; cafés</p>
              <h2 className={styles.h2}>Stock Tilia</h2>
              <p className={styles.p}>
                We work with retailers, cafés and gift shops that care about where their honey
                comes from.
              </p>
              <ul className={styles.wholesaleList}>
                <li>
                  <strong>Retail partners</strong>
                  <span>Shelf-ready 500 g jars</span>
                </li>
                <li>
                  <strong>Cafés &amp; kitchens</strong>
                  <span>Regular supply for your menu</span>
                </li>
              </ul>
              <a href="mailto:hello@tiliahoney.example?subject=Wholesale%20enquiry" className={styles.pillBtn}>
                Get in touch
              </a>
            </div>
            <div className={styles.wholesaleSide}>
              <h3 className={styles.bigClaim}>
                Honey worth <em>talking</em> about
              </h3>
              <div className={styles.slotMd} data-jar-slot data-jar-tilt="6" />
            </div>
          </div>
        </section>

        {/* ---------- Process (purple) ---------- */}
        <section id="process" className={styles.process}>
          <div className={styles.head}>
            <p className={styles.script}>About our honey</p>
            <h2 className={styles.h2Light}>From comb to jar</h2>
          </div>
          <div className={styles.steps}>
            <ol className={styles.stepCol}>
              {steps.slice(0, 2).map((s) => (
                <li key={s.n} className={styles.step}>
                  <span>{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
            <div className={styles.stepCenter}>
              <div className={styles.stageGlow} aria-hidden />
              <div className={styles.slotLg} data-jar-slot data-jar-tilt="0" />
            </div>
            <ol className={styles.stepCol} start={3}>
              {steps.slice(2).map((s) => (
                <li key={s.n} className={styles.step}>
                  <span>{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Inside the jar (exploded view) ---------- */}
        <JarAnatomy />

        {/* ---------- Facts ---------- */}
        <section id="facts" className={styles.factsSection}>
          <div className={styles.head}>
            <p className={styles.kicker}>Good to know</p>
            <h2 className={styles.h2}>Honey questions, answered</h2>
          </div>
          <div className={styles.factsInner}>
            <div className={styles.slotMd} data-jar-slot data-jar-tilt="-6" />
            <FactTabs />
          </div>
        </section>

        {/* ---------- Quality band ---------- */}
        <section id="quality" className={styles.quality}>
          <Forest className={styles.landscape} />
          <div className={styles.qualityInner}>
            <div className={styles.text}>
              <p className={styles.kickerLight}>Quality you can taste</p>
              <h2 className={styles.h2Light}>Straight from the wild</h2>
            </div>
            <div className={styles.qualityRow}>
              <ul className={styles.stats}>
                {stats.slice(0, 2).map((s) => (
                  <li key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.slotLg} data-jar-slot data-jar-tilt="0" />
              <ul className={styles.stats}>
                {stats.slice(2).map((s) => (
                  <li key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </li>
                ))}
                <li>
                  <a href="#order" className={styles.pillBtn}>
                    Order now
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a href="#top" className={styles.footerLogo}>
            Tilia<small>Honey</small>
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
            <div>
              <h4>Explore</h4>
              <a href="#product">Our honey</a>
              <a href="#origin">Origin</a>
              <a href="#order">Order</a>
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
