const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../../docusaurus.config');

test('customer navigation does not expose repository or edit links', () => {
  const presetOptions = config.presets[0][1];
  const navbarItems = config.themeConfig.navbar.items;
  const footerItems = config.themeConfig.footer.links.flatMap((group) => group.items);

  assert.equal(presetOptions.docs.editUrl, undefined);
  assert.equal(presetOptions.blog.editUrl, undefined);
  assert.equal(navbarItems.some((item) => item.label === 'GitHub' || item.href?.includes('github.com')), false);
  assert.equal(footerItems.some((item) => item.label === 'GitHub' || item.label === 'Suggest an update'), false);
});

test('customer header keeps app discovery on the home cards', () => {
  const navbarItems = config.themeConfig.navbar.items;
  const labels = navbarItems.map((item) => item.label);

  assert.deepEqual(labels, ['All apps', 'Contact', 'Privacy Policy']);
  assert.equal(navbarItems.some((item) => item.to === '/revenza-upsell/overview'), false);
  assert.equal(navbarItems.some((item) => item.to === '/changelog'), false);
  assert.equal(navbarItems.some((item) => item.to === '/revenza-upsell/faq'), false);
  assert.equal(navbarItems.some((item) => item.to === '/privacy-policy'), true);
});

test('theme switch is reserved for the footer control', () => {
  assert.equal(config.themeConfig.colorMode.disableSwitch, true);
  assert.equal(config.themeConfig.colorMode.respectPrefersColorScheme, false);
});
