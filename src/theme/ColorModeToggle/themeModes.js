const THEME_MODES = {
  light: {
    label: 'Day',
    toggleLabel: 'Switch to Night mode',
  },
  dark: {
    label: 'Night',
    toggleLabel: 'Switch to Day mode',
  },
};

function getNextMode(mode) {
  if (mode === 'light') {
    return 'dark';
  }

  if (mode === 'dark') {
    return 'light';
  }

  return 'light';
}

module.exports = {THEME_MODES, getNextMode};
