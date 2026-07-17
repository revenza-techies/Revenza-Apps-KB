import React from "react";
import Link from "@docusaurus/Link";
import support from "../../../content/support";
import styles from "./styles.module.css";
import { openFreshchat } from "../../../utils/freshchat";

export default function SupportSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h2>{support.title}</h2>

        <p className={styles.subtitle}>
          Choose the best way to get help.
        </p>

        <div className={styles.grid}>
          {support.items.map((item) => (
            <div key={item.title} className={styles.card}>

              <div className={styles.icon}>
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              {item.action && (
  item.title === "Live Chat" ? (
    <button
  className="button button--primary"
  onClick={openFreshchat}
>
  Start Chat
</button>
  ) : (
    <Link
      className="button button--primary"
      to={item.action.link}
    >
      {item.action.label}
    </Link>
  )
)}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}