import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function SearchSection() {
  return (
    <section className={styles.searchSection}>
      <h2>Search Documentation</h2>

      <p>
        Quickly find installation guides, feature documentation,
        troubleshooting articles and FAQs.
      </p>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search the knowledge base..."
          disabled
        />

        <Link
          className="button button--primary"
          to="/revenza-upsell/"
        >
          Browse Docs
        </Link>
      </div>
    </section>
  );
}
