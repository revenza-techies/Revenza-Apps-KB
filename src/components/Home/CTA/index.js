import React from "react";
import Link from "@docusaurus/Link";
import homepage from "../../../content/homepage";
import styles from "./styles.module.css";
import { openFreshchat } from "../../utils/freshchat";

export default function CTA() {
  const { hero } = homepage;

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h2>Ready to get started?</h2>

        <p>
          Browse the documentation or contact our team if you
          need assistance.
        </p>

        <div className={styles.actions}>

          <Link
            className="button button--primary button--lg"
            to={hero.primaryButton.link}
          >
            {hero.primaryButton.label}
          </Link>

          <button
            className="button button--secondary button--lg"
            onClick={() => {
              if (
                window.fcWidget &&
                typeof window.fcWidget.open === "function"
              ) {
                window.fcWidget.open();
              }
            }}
          >
            {hero.secondaryButton.label}
          </button>

        </div>

      </div>
    </section>
  );
}