const test = require('node:test');
const assert = require('node:assert/strict');
const {THEME_MODES, getNextMode} = require('./themeModes');

test('exposes only Day and Night modes', () => {
  assert.deepEqual(Object.keys(THEME_MODES), ['light', 'dark']);
  assert.equal(THEME_MODES.light.label, 'Day');
  assert.equal(THEME_MODES.dark.label, 'Night');
});

test('toggles directly between Day and Night', () => {
  assert.equal(getNextMode('light'), 'dark');
  assert.equal(getNextMode('dark'), 'light');
});

test('falls back to Day for unknown modes', () => {
  assert.equal(getNextMode('system'), 'light');
  assert.equal(getNextMode(undefined), 'light');
});
