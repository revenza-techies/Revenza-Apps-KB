import React from "react";
import styles from "./styles.module.css";

export default function Columns({ children }) {
  return <div className={styles.columns}>{children}</div>;
}

export function Column({ children }) {
  return <div className={styles.column}>{children}</div>;
}
