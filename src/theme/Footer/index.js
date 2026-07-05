import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useThemeConfig} from '@docusaurus/theme-common';
import {EnvelopeSimple, House, ShieldCheck} from '@phosphor-icons/react';
import Footer from '@theme-original/Footer';
import ColorModeToggle from '@theme/ColorModeToggle';
import styles from './styles.module.css';

const iconByLabel = {
  'All apps': House,
  Contact: EnvelopeSimple,
  'Privacy Policy': ShieldCheck,
};

function isActivePath(currentPath, item) {
  if (!item.to) {
    return false;
  }

  if (item.exact) {
    return currentPath === item.to;
  }

  return currentPath === item.to || currentPath.startsWith(`${item.to}/`);
}

function MobileNavItem({item, currentPath}) {
  const Icon = iconByLabel[item.label] || House;
  const className = `${styles.mobileBottomNavLink} ${isActivePath(currentPath, item) ? styles.mobileBottomNavLinkActive : ''}`;

  if (item.href) {
    return (
      <a className={className} href={item.href}>
        <Icon size={19} weight="duotone" aria-hidden="true" />
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <Link className={className} to={item.to || '/'}>
      <Icon size={19} weight="duotone" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

function MobileBottomNav() {
  const {navbar} = useThemeConfig();
  const location = useLocation();
  const items = navbar.items.filter((item) => item.label && (item.to || item.href));

  return (
    <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
      {items.map((item) => (
        <MobileNavItem currentPath={location.pathname} item={item} key={`${item.label}-${item.to || item.href}`} />
      ))}
    </nav>
  );
}

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <MobileBottomNav />
      <div className={styles.footerModeSwitch} aria-label="Theme controls">
        <ColorModeToggle />
      </div>
    </>
  );
}