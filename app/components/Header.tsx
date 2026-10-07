"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const links = [
  { href: "#product", label: "Our Honey" },
  { href: "#origin", label: "Origin" },
  { href: "#process", label: "Process" },
  { href: "#facts", label: "Good to Know" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.headerSolid : ""}`}>
      <a href="#top" className={styles.logo} onClick={() => setOpen(false)}>
        Tilia<small>Honey</small>
      </a>

      <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className={styles.navLink} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#order" className={styles.buyBtn} onClick={() => setOpen(false)}>
          Order
        </a>
      </nav>

      <button
        className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
