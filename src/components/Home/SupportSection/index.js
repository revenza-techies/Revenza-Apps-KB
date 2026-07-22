import React from "react";
import Link from "@docusaurus/Link";
import { BookOpenText, ChatCircleDots, VideoCamera } from "@phosphor-icons/react";
import support from "../../../content/support";
import { openFreshchat } from "../../../utils/freshchat";
import styles from "./styles.module.css";

const SUPPORT_ICONS = {
  chat: ChatCircleDots,
  documentation: BookOpenText,
  video: VideoCamera,
};

export default function SupportSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>{support.title}</h2>
        <p className={styles.subtitle}>Choose the best way to get help.</p>

        <div className={styles.grid}>
          {support.items.map((item) => {
            const Icon = SUPPORT_ICONS[item.icon];

            return (
              <div key={item.title} className={styles.card}>
                <div className={styles.icon} aria-hidden="true">
                  <Icon size={48} weight="duotone" />
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                {item.action &&
                  (item.title === "Live Chat" ? (
                    <button className="button button--primary" onClick={openFreshchat}>
                      {item.action.label}
                    </button>
                  ) : (
                    <Link className="button button--primary" to={item.action.link}>
                      {item.action.label}
                    </Link>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}