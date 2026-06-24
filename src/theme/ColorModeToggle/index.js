import React from 'react';
import {Moon, Sun} from '@phosphor-icons/react';
import {useColorMode} from '@docusaurus/theme-common';
import themeModes from './themeModes';
import styles from './styles.module.css';

const {THEME_MODES, getNextMode} = themeModes;

export default function ColorModeToggle({className}) {
  const {colorMode, setColorMode} = useColorMode();
  const currentMode = colorMode === 'dark' ? 'dark' : 'light';
  const nextMode = getNextMode(currentMode);
  const label = THEME_MODES[currentMode].toggleLabel;

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className || ''}`}
      aria-label={label}
      title={label}
      onClick={() => setColorMode(nextMode)}>
      {currentMode === 'light' ? (
        <Moon size={19} weight="fill" aria-hidden="true" />
      ) : (
        <Sun size={19} weight="fill" aria-hidden="true" />
      )}
      <span>{THEME_MODES[currentMode].label}</span>
    </button>
  );
}
