import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function FeaturedApp() {
  return (
    <section className={styles.section}>
      <h2>Featured App</h2>

      <div className={styles.card}>
        <h3>🚀 Revenza Upsell Addon</h3>

        <p>
          Professional upsell and cross-sell offers for Shopify stores.
        </p>

        <Link
          className="button button--secondary"
          to="/docs/home"
        >
          Open Knowledge Base
        </Link>
      </div>
    </section>
  );
}