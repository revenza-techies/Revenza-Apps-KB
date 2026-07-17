import React from "react";
import styles from "./styles.module.css";

export default function Heading({
  title,
  subtitle,
  center = false,
}) {
  return (
    <div
      className={`${styles.wrapper} ${
        center ? styles.center : ""
      }`}
    >
      <h2>{title}</h2>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}