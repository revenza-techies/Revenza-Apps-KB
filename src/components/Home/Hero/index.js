import React from "react";
import Link from "@docusaurus/Link";
import homepage from "../../../content/homepage";
import styles from "./styles.module.css";
import { openFreshchat } from "../../../utils/freshchat";

export default function Hero() {
  const { hero } = homepage;

  return (
    <section className={styles.hero}>
      <h1>{hero.title}</h1>

      <p>{hero.subtitle}</p>

      <div className={styles.actions}>
        <Link
          className="button button--primary button--lg"
          to={hero.primaryButton.link}
        >
          {hero.primaryButton.label}
        </Link>

        <button
  type="button"
  className="button button--secondary button--lg"
  onClick={openFreshchat}
>
  {hero.secondaryButton.label}
</button>
      </div>
    </section>
  );
}