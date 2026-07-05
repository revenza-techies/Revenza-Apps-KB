import React, {useEffect, useMemo, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useThemeConfig} from '@docusaurus/theme-common';

function isActivePath(currentPath, item) {
  if (!item.to) {
    return false;
  }

  if (item.exact) {
    return currentPath === item.to;
  }

  return currentPath === item.to || currentPath.startsWith(`${item.to}/`);
}

function CurtainLink({item, currentPath, onNavigate}) {
  const className = `revenzaCurtainMenu__link${isActivePath(currentPath, item) ? ' revenzaCurtainMenu__link--active' : ''}`;

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
  const closeButtonRef = useRef(null);
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
    closeButtonRef.current?.focus();

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
        className="navbar__toggle revenzaCurtainMenu__trigger clean-btn"
        aria-controls="revenza-curtain-menu"
        aria-expanded={shown}
        aria-label="Open navigation menu"
        onClick={() => setShown(true)}>
        Menu
      </button>

      <div
        id="revenza-curtain-menu"
        className={`revenzaCurtainMenu${shown ? ' revenzaCurtainMenu--open' : ''}`}
        aria-hidden={!shown}>
        <div className="revenzaCurtainMenu__inner" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className="revenzaCurtainMenu__close"
            onClick={() => setShown(false)}
            ref={closeButtonRef}>
            &times;
          </button>
          <div className="revenzaCurtainMenu__eyebrow">Revenza Help Center</div>
          <nav className="revenzaCurtainMenu__nav" aria-label="Mobile navigation">
            {items.map((item) => (
              <CurtainLink
                currentPath={location.pathname}
                item={item}
                key={`${item.label}-${item.to || item.href}`}
                onNavigate={() => setShown(false)}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
