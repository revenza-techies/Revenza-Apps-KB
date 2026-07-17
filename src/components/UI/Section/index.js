import React from "react";
import styles from "./styles.module.css";

export default function Section({
  children,
  background = "transparent",
}) {
  return (
    <section
      className={styles.section}
      style={{ background }}
    >
      {children}
    </section>
  );
}