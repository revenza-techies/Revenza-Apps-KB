import React from 'react';
import styles from './styles.module.css';

export default function BrandScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <img
        className={styles.background}
        src="/img/brand/revenza-hero-3d.webp"
        alt=""
        width="1672"
        height="941"
        decoding="async"
        fetchPriority="high"
      />
      <img
        className={styles.brand}
        src="/img/brand/revenza-brand-3d.webp"
        alt=""
        width="1254"
        height="1254"
        decoding="async"
      />
    </div>
  );
}
