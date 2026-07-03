const test = require('node:test');
const assert = require('node:assert/strict');

test('parses GitBook home README front matter with safe defaults', async () => {
  const {parseFrontMatterMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const parsed = parseFrontMatterMarkdown(`---
title: Custom Help Center
heroHeading: Help every shopper find the right guide
supportUrl: /contact
---

# Revenza Help Center
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

test('normalizes GitBook markdown that Docusaurus MDX cannot parse', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`{% hint style="info" %}
Remember to save the theme.
{% endhint %}

<figure><img src="../.gitbook/assets/App Embed-1.png" alt=""><figcaption></figcaption></figure>
`);

  assert.match(sanitized, /> \*\*Note:\*\* Remember to save the theme\./);
  assert.match(sanitized, /<img src="\.\.\/\.gitbook\/assets\/App Embed-1\.png" alt="" \/>/);
  assert.doesNotMatch(sanitized, /{%/);
  assert.doesNotMatch(sanitized, /<\/figure>/);
});

test('keeps overview content editable while moving styling to Docusaurus', async () => {
  const {sanitizeUpsellOverviewMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeUpsellOverviewMarkdown(`<section className="startSection">
  <div className="journey">
    <Link to="/revenza-upsell/getting-started"><span>1</span><strong>Install</strong><small>Add the app.</small></Link>
    <Link to="/revenza-upsell/custom-upsell-sets"><span>2</span><strong>Create</strong><small>Build the offer.</small></Link>
    <Link to="/revenza-upsell/mapping"><span>3</span><strong>Map</strong><small>Connect products.</small></Link>
  </div>
</section>

<Link to="/revenza-upsell/customization/design-placement">Settings</Link>

<style>{\`
.journey{grid-template-columns:repeat(4,1fr)}
\`}</style>`);

  assert.match(sanitized, /<strong>Map<\/strong>/);
  assert.match(sanitized, /\/revenza-upsell\/settings/);
  assert.doesNotMatch(sanitized, /grid-template-columns:repeat\(4,1fr\)/);
  assert.doesNotMatch(sanitized, /<style>/);
});
