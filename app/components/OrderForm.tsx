"use client";

import { useState, type FormEvent } from "react";
import styles from "../page.module.css";

// Placeholder address — replace with the real order inbox.
const ORDER_EMAIL = "hello@tiliahoney.example";

/* No backend yet: the form composes an email to the order inbox. */
export default function OrderForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Jars (500 g): ${data.get("jars")}`,
      "",
      String(data.get("note") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
      "Tilia honey order",
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        <span>Your name</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" type="tel" required autoComplete="tel" />
      </label>
      <label>
        <span>Jars</span>
        <input name="jars" type="number" min={1} defaultValue={1} required />
      </label>
      <label className={styles.formWide}>
        <span>Anything else?</span>
        <textarea name="note" rows={3} />
      </label>
      <button type="submit" className={styles.pillBtn}>
        Send request
      </button>
      {sent && <p className={styles.formNote}>Your email app should open with the order filled in.</p>}
    </form>
  );
}
