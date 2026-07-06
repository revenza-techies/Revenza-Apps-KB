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

test('removes duplicate labels from GitBook hint bodies', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`{% hint style="info" %}
Note: This setting acts as a global switch for the upsell widget.
{% endhint %}

{% hint style="warning" %}
Warning: Review these settings before going live.
{% endhint %}
`);

  assert.match(sanitized, /> \*\*Note:\*\* This setting acts as a global switch/);
  assert.match(sanitized, /> \*\*Warning:\*\* Review these settings before going live\./);
  assert.doesNotMatch(sanitized, /Note:\*\* Note:/);
  assert.doesNotMatch(sanitized, /Warning:\*\* Warning:/);
});

test('removes duplicate GitBook hint labels wrapped in emphasis', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`{% hint style="info" %}
_**Note:** You can add upto 20 products in a set._
{% endhint %}`);

  assert.match(sanitized, /> \*\*Note:\*\* _You can add upto 20 products in a set\._/);
  assert.doesNotMatch(sanitized, /Note:\*\* _\*\*Note:/);
});

test('converts GitBook steppers into reusable Docusaurus markup', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`{% stepper %}
{% step %}
### Go to Custom Upsell Sets

Navigate to Upsell sets.
{% endstep %}

{% step %}
### Add Set Details

{% hint style="info" %}
This name will help you identify the set.
{% endhint %}
{% endstep %}
{% endstepper %}`);

  assert.match(sanitized, /className="gitbookStepper"/);
  assert.match(sanitized, /className="gitbookStep"/);
  assert.match(sanitized, /className="gitbookStepMarker" aria-hidden="true">1/);
  assert.match(sanitized, /### Go to Custom Upsell Sets/);
  assert.match(sanitized, /> \*\*Note:\*\* This name will help you identify the set\./);
  assert.doesNotMatch(sanitized, /{%\s*step/);
});

test('converts GitBook tabs and content refs into Docusaurus tabs', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`{% tabs %}
{% tab title="Product Page" icon="product-hunt" %}
{% content-ref url="product-page.md" %}
[product-page.md](settings/product-page.md)
{% endcontent-ref %}

Configure product page recommendations.
{% endtab %}
{% tab title="Cart Page" icon="cart-shopping" %}
{% content-ref url="cart-page.md" %}
[cart-page.md](settings/cart-page.md)
{% endcontent-ref %}

Customize cart recommendations.
{% endtab %}
{% endtabs %}`);

  assert.match(sanitized, /import Tabs from '@theme\/Tabs';/);
  assert.match(sanitized, /import Tabs from '@theme\/Tabs';\r?\n\r?\n<div className="gitbookTabsShell">/);
  assert.match(sanitized, /<Tabs className="gitbookTabs">/);
  assert.match(sanitized, /<TabItem value="product-page" label="Product Page">/);
  assert.match(sanitized, /className="gitbookContentRef" href="settings\/product-page"/);
  assert.match(sanitized, /className="gitbookContentRefIcon"/);
  assert.doesNotMatch(sanitized, /{%/);
});



test('updates overview popular guides from GitBook README without changing the design shell', async () => {
  const {sanitizeUpsellOverviewMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const overview = `<div className="docsHomeGrid">
  <section aria-labelledby="popular-guides">
    <h2 id="popular-guides">Popular guides</h2>
    <div className="guideList">
      <Link to="/revenza-upsell/custom-upsell-sets">
        <ShoppingCartSimple size={22}/>
        <span><strong>Create your first upsell</strong><small>Build an offer in a few clear steps.</small></span>
        <ArrowRight size={18}/>
      </Link>
    </div>
  </section>
</div>`;
  const readme = `### Popular guides

* [**Pre-build options**](pre-build-upsell-sets.md) — Display pre-build upsell options on products.
* [**Create Upsell Set**](custom-upsell-sets.md) — Build an offer in a few clear steps.
* [**Customize the experience**](settings/global-settings.md) — Match colors, text, and placement to your store.
`;

  const sanitized = sanitizeUpsellOverviewMarkdown(overview, {popularGuidesSource: readme});

  assert.match(sanitized, /className="docsHomeGrid"/);
  assert.match(sanitized, /className="guideList"/);
  assert.match(sanitized, /<strong>Pre-build options<\/strong>/);
  assert.match(sanitized, /<strong>Create Upsell Set<\/strong>/);
  assert.match(sanitized, /\/revenza-upsell\/settings\/global-settings/);
  assert.doesNotMatch(sanitized, /Create your first upsell/);
});


test('renames the generated overview doc label from Welcome to Overview', async () => {
  const {sanitizeUpsellOverviewMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeUpsellOverviewMarkdown(`---
id: intro
slug: /overview
title: Welcome to Revenza Upsell
sidebar_label: Welcome
---

# Grow every order
`);

  assert.match(sanitized, /title: Overview/);
  assert.match(sanitized, /sidebar_label: Overview/);
  assert.doesNotMatch(sanitized, /sidebar_label: Welcome/);
});
