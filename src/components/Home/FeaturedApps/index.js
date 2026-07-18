import React from "react";
import Link from "@docusaurus/Link";
import apps from "../../../content/apps";
import styles from "./styles.module.css";

export default function FeaturedApps() {
  return (
    <section className={styles.section}>
      <h2>Revenza Apps</h2>

      <p>
        Browse documentation for Revenza Apps.
      </p>

      <div className={styles.grid}>
        {apps.map((app) => (
          <div className={styles.card} key={app.id}>
            <img
              src={app.icon}
              alt={app.name}
              className={styles.logo}
            />

            <h3>{app.name}</h3>
            <p>{app.description}</p>

            <Link
              className="button button--primary"
              to={app.docs}
            >
              View Documentation
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
