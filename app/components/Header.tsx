"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const links = [
  { href: "#story", label: "Our Story" },
  { href: "#honey", label: "The Honey" },
  { href: "#region", label: "The Region" },
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
        TILIA<small>HONEY</small>
      </a>

      <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className={styles.navLink} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#buy" className={styles.buyBtn} onClick={() => setOpen(false)}>
          Buy
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
