import React from 'react';
import Link from '@docusaurus/Link';
import {ArrowRight, BookOpenText} from '@phosphor-icons/react';
import styles from './styles.module.css';

export default function AppCard({app}) {
  return (
    <Link className={styles.card} to={app.href} aria-label={`Open ${app.name} knowledge base`}>
      <div className={styles.artwork}>
        <img src={app.image} alt={app.imageAlt} width="1254" height="1254" loading="lazy" decoding="async" />
      </div>
      <div className={styles.topRow}><span className={styles.category}>{app.category}</span></div>
      <div className={styles.copy}><h2>{app.name}</h2><p>{app.intro}</p></div>
      <span className={styles.action}>
        <BookOpenText size={20} weight="duotone" aria-hidden="true" />
        Browse knowledge base
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </span>
    </Link>
  );
}
