import React from 'react';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';

function isActivePath(currentPath, item) {
  if (!item.to) {
    return false;
  }

  if (item.exact) {
    return currentPath === item.to;
  }

  return currentPath === item.to || currentPath.startsWith(`${item.to}/`);
}

function MobileNavItem({item, onClick}) {
  const location = useLocation();
  const isActive = isActivePath(location.pathname, item);
  const className = `menu__link${isActive ? ' menu__link--active' : ''}`;

  if (item.href) {
    return (
      <li className="menu__list-item">
        <a className={className} href={item.href} onClick={onClick}>
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li className="menu__list-item">
      <Link className={className} to={item.to || '/'} onClick={onClick}>
        {item.label}
      </Link>
    </li>
  );
}

export default function NavbarMobilePrimaryMenu() {
  const {navbar} = useThemeConfig();
  const mobileSidebar = useNavbarMobileSidebar();
  const items = navbar.items.filter((item) => item.label && (item.to || item.href));

  return (
    <nav aria-label="Mobile navigation">
      <ul className="menu__list">
        {items.map((item) => (
          <MobileNavItem item={item} key={`${item.label}-${item.to || item.href}`} onClick={mobileSidebar.toggle} />
        ))}
      </ul>
    </nav>
  );
}