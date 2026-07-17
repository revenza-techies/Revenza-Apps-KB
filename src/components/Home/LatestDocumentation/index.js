import React from "react";
import Link from "@docusaurus/Link";
import latestDocs from "../../../content/latestDocs";
import styles from "./styles.module.css";

export default function LatestDocumentation() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Latest Documentation</h2>

        <p className={styles.subtitle}>
          Stay up to date with our newest guides, tutorials and product
          documentation.
        </p>

        <div className={styles.grid}>
          {latestDocs.map((doc) => (
            <Link
              key={doc.link}
              to={doc.link}
              className={styles.card}
            >
              <h3>{doc.title}</h3>

              <p>{doc.description}</p>

              <span>Read Article →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}