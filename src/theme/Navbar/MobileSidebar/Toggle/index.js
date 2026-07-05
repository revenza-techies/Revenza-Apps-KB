import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useThemeConfig} from '@docusaurus/theme-common';
import {translate} from '@docusaurus/Translate';
import IconMenu from '@theme/Icon/Menu';

function isActivePath(currentPath, item) {
  if (!item.to) {
    return false;
  }

  if (item.exact) {
    return currentPath === item.to;
  }

  return currentPath === item.to || currentPath.startsWith(`${item.to}/`);
}

function MobileDrawerLink({item, currentPath, onNavigate}) {
  const className = `revenzaMobileDrawer__link${isActivePath(currentPath, item) ? ' revenzaMobileDrawer__link--active' : ''}`;

  if (item.href) {
    return (
      <a className={className} href={item.href} onClick={onNavigate}>
        {item.label}
      </a>
    );
  }

  return (
    <Link className={className} to={item.to || '/'} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export default function MobileSidebarToggle() {
  const [shown, setShown] = useState(false);
  const {navbar} = useThemeConfig();
  const location = useLocation();
  const items = useMemo(
    () => navbar.items.filter((item) => item.label && (item.to || item.href)),
    [navbar.items],
  );

  useEffect(() => {
    if (!shown) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setShown(false);
      }
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [shown]);

  useEffect(() => {
    setShown(false);
  }, [location.pathname]);

  return (
    <>
      <button
        type="button"
        className="navbar__toggle clean-btn"
        aria-controls="revenza-mobile-navigation"
        aria-expanded={shown}
        aria-label={translate({
          id: 'theme.docs.sidebar.toggleSidebarButtonAriaLabel',
          message: 'Toggle navigation bar',
          description: 'The ARIA label for hamburger menu button of mobile navigation',
        })}
        onClick={() => setShown((open) => !open)}>
        <IconMenu />
      </button>

      <div className={`revenzaMobileDrawer${shown ? ' revenzaMobileDrawer--open' : ''}`} aria-hidden={!shown}>
        <button
          type="button"
          className="revenzaMobileDrawer__backdrop"
          aria-label="Close mobile navigation"
          onClick={() => setShown(false)}
        />
        <aside id="revenza-mobile-navigation" className="revenzaMobileDrawer__panel" aria-label="Mobile navigation">
          <div className="revenzaMobileDrawer__header">
            <span>Navigation</span>
            <button type="button" className="revenzaMobileDrawer__close" onClick={() => setShown(false)}>
              Close
            </button>
          </div>
          <nav className="revenzaMobileDrawer__nav">
            {items.map((item) => (
              <MobileDrawerLink
                currentPath={location.pathname}
                item={item}
                key={`${item.label}-${item.to || item.href}`}
                onNavigate={() => setShown(false)}
              />
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}