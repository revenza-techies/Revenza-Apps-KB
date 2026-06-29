const test = require('node:test');
const assert = require('node:assert/strict');

test('parses GitBook all-apps front matter with safe defaults', async () => {
  const {parseFrontMatterMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const parsed = parseFrontMatterMarkdown(`---
title: Custom Help Center
heroHeading: Help every shopper find the right guide
supportUrl: /contact
---

# All Apps
`);

  assert.equal(parsed.title, 'Custom Help Center');
  assert.equal(parsed.heroHeading, 'Help every shopper find the right guide');
  assert.equal(parsed.supportUrl, '/contact');
  assert.equal(parsed.appsKicker, 'Our apps');
});


test('creates a Docusaurus sidebar module from GitBook sidebar JSON', async () => {
  const {createSidebarModule} = await import('../../scripts/content-sync-utils.mjs');
  const moduleText = createSidebarModule([
    {type: 'doc', id: 'intro', label: 'Overview'},
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: true,
      link: {type: 'doc', id: 'getting-started'},
      items: ['getting-started/install'],
    },
  ]);

  assert.match(moduleText, /upsellSidebar/);
  assert.match(moduleText, /"label": "Overview"/);
  assert.match(moduleText, /"id": "getting-started"/);
  assert.match(moduleText, /"getting-started\/install"/);
});