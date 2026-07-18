import React from "react";
import styles from "./styles.module.css";

export default function Stepper({ children }) {
  return <ol className={styles.stepper}>{children}</ol>;
}

export function Step({ children }) {
  return <li className={styles.step}>{children}</li>;
}
