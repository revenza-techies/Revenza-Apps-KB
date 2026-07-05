import React, {useRef} from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import IconMenu from '@theme/Icon/Menu';

export default function MobileSidebarToggle() {
  const {toggle, shown} = useNavbarMobileSidebar();
  const skipNextClick = useRef(false);

  function activate(event) {
    if (event.type === 'pointerup' && event.pointerType === 'mouse') {
      return;
    }

    if (event.type === 'click' && skipNextClick.current) {
      skipNextClick.current = false;
      return;
    }

    if (event.type === 'pointerup') {
      skipNextClick.current = true;
      event.preventDefault();
    }

    toggle();
  }

  return (
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
      onClick={activate}
      onPointerUp={activate}>
      <IconMenu />
    </button>
  );
}