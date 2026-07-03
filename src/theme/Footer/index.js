import React from 'react';
import Footer from '@theme-original/Footer';
import ColorModeToggle from '@theme/ColorModeToggle';
import styles from './styles.module.css';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <div className={styles.footerModeSwitch} aria-label="Theme controls">
        <ColorModeToggle />
      </div>
    </>
  );
}