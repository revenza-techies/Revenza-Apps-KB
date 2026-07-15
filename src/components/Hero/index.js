import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1>Revenza Knowledge Base</h1>

      <p>
        Everything you need to get the most from Revenza apps.
      </p>

      <Link
        className="button button--primary button--lg"
        to="/docs"
      >
        Browse Documentation
      </Link>
    </section>
  );
}