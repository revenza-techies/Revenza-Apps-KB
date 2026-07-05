import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useThemeConfig} from '@docusaurus/theme-common';
import Navbar from '@theme-original/Navbar';
import styles from './styles.module.css';

function isActivePath(currentPath, item) {
  if (!item.to) {
    return false;
  }

  if (item.exact) {
    return currentPath === item.to;
  }

  return currentPath === item.to || currentPath.startsWith(`${item.to}/`);
}

function MobileHeaderNavItem({item, currentPath}) {
  const className = `${styles.mobileHeaderNavLink} ${isActivePath(currentPath, item) ? styles.mobileHeaderNavLinkActive : ''}`;

  if (item.href) {
    return (
      <a className={className} href={item.href}>
        {item.label}
      </a>
    );
  }

  return (
    <Link className={className} to={item.to || '/'}>
      {item.label}
    </Link>
  );
}

function MobileHeaderNav() {
  const {navbar} = useThemeConfig();
  const location = useLocation();
  const items = navbar.items.filter((item) => item.label && (item.to || item.href));

  return (
    <nav className={styles.mobileHeaderNav} aria-label="Mobile primary navigation">
      <div className={styles.mobileHeaderNavScroller}>
        {items.map((item) => (
          <MobileHeaderNavItem currentPath={location.pathname} item={item} key={`${item.label}-${item.to || item.href}`} />
        ))}
      </div>
    </nav>
  );
}

export default function NavbarWrapper(props) {
  return (
    <>
      <Navbar {...props} />
      <MobileHeaderNav />
    </>
  );
}
