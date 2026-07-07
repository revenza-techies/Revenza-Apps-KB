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
  assert.match(sanitized, /<img src="\/img\/content\/revenza-upsell\/assets\/App Embed-1\.png" alt="" \/>/);
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


test('converts GitBook exported button details into stable button cards', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`<details>

<summary><a href="../custom-upsell-sets.md#creating-custom-upsell-sets" class="button primary">Create Custom Upsell Sets</a></summary>



</details>

<details>

<summary><i class="fa-link">:link:</i> <a href="mapping.md" class="button primary">Map Prebuilt sets</a></summary>

Map your Pre-built sets to Specific **Products**.

</details>`);

  assert.match(sanitized, /className="gitbookButtonCard"/);
  assert.match(sanitized, /className="gitbookButton gitbookButton--primary" href="custom-upsell-sets#creating-custom-upsell-sets">Create Custom Upsell Sets<\/a>/);
  assert.match(sanitized, /href="mapping">Map Prebuilt sets<\/a>/);
  assert.match(sanitized, /className="gitbookButtonCardBody"/);
  assert.doesNotMatch(sanitized, /class="button primary"/);
  assert.doesNotMatch(sanitized, /<summary>/);
  assert.doesNotMatch(sanitized, /fa-link/);
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


test('converts common GitBook blocks into stable Docusaurus markup', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`{% cards %}
{% card title="Install the app" href="getting-started/install.md" icon="download" %}
Add Revenza Upsell to Shopify.
{% endcard %}
{% endcards %}

{% expandable title="Advanced details" %}
Extra setup details.
{% endexpandable %}

{% columns %}
{% column %}
Left column.
{% endcolumn %}
{% column %}
Right column.
{% endcolumn %}
{% endcolumns %}

{% embed url="https://example.com/video" %}
{% file src="../.gitbook/assets/setup.pdf" name="Setup PDF" %}
{% openapi src="openapi.yaml" method="GET" path="/products" %}
`);

  assert.match(sanitized, /className="gitbookCards"/);
  assert.match(sanitized, /className="gitbookCard" href="getting-started\/install"/);
  assert.match(sanitized, /className="gitbookExpandable"/);
  assert.match(sanitized, /<summary>Advanced details<\/summary>/);
  assert.match(sanitized, /className="gitbookColumns"/);
  assert.match(sanitized, /className="gitbookColumn"/);
  assert.match(sanitized, /className="gitbookEmbed"/);
  assert.match(sanitized, /className="gitbookFile" href="\/img\/content\/revenza-upsell\/assets\/setup\.pdf"/);
  assert.match(sanitized, /className="gitbookBlock gitbookBlock--openapi"/);
  assert.doesNotMatch(sanitized, /{%/);
});

test('keeps unknown future GitBook blocks visible instead of dropping content', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(`{% drawing %}
Sketch placeholder.
{% enddrawing %}

{% page-ref page="billing.md" %}`);

  assert.match(sanitized, /className="gitbookBlock gitbookBlock--drawing"/);
  assert.match(sanitized, /Sketch placeholder/);
  assert.match(sanitized, /className="gitbookBlock gitbookBlock--pageRef"/);
  assert.doesNotMatch(sanitized, /{%/);
});

test('rewrites GitBook asset references to public Docusaurus content URLs', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown('<img src="../.gitbook/assets/App Embed-1.png" alt="">');

  assert.match(sanitized, /src="\/img\/content\/revenza-upsell\/assets\/App Embed-1\.png"/);
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

test('normalizes nested GitBook links to app-root Docusaurus routes', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(
    '[Product Page](../settings/product-page.md) [Integration](../integration.md#product-page-integration)',
    {currentDocPath: 'getting-started/enable-widget-on.md'},
  );

  assert.match(sanitized, /\]\(\/revenza-upsell\/settings\/product-page\)/);
  assert.match(sanitized, /\]\(\/revenza-upsell\/integration#product-page-integration\)/);
});

test('keeps GitBook button cards available from folder landing pages', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(
    '<details><summary><a href="../custom-upsell-sets.md#creating-custom-upsell-sets" class="button primary">Create Custom Upsell Sets</a></summary></details>',
    {currentDocPath: 'getting-started.md'},
  );

  assert.match(sanitized, /href="custom-upsell-sets#creating-custom-upsell-sets"/);
  assert.match(sanitized, /Create Custom Upsell Sets/);
});


test('adds Overview front matter when GitBook README has no Docusaurus metadata', async () => {
  const {sanitizeUpsellOverviewMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeUpsellOverviewMarkdown('# Overview\n\nWelcome from GitBook.');

  assert.match(sanitized, /id: intro/);
  assert.match(sanitized, /slug: \/overview/);
  assert.match(sanitized, /title: Overview/);
  assert.match(sanitized, /sidebar_label: Overview/);
  assert.match(sanitized, /# Overview/);
});


test('normalizes hashes in nested GitBook links without duplicating anchors', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown(
    '[Integration](../integration.md#product-page-integration)',
    {currentDocPath: 'getting-started/upsell-product-preview.md'},
  );

  assert.match(sanitized, /\]\(\/revenza-upsell\/integration#product-page-integration\)/);
  assert.doesNotMatch(sanitized, /integration#product-page-integration#product-page-integration/);
});


test('neutralizes GitBook unresolved placeholder links', async () => {
  const {sanitizeGitBookMarkdown} = await import('../../scripts/content-sync-utils.mjs');
  const sanitized = sanitizeGitBookMarkdown('[Create your first upsell](/broken/pages/abc123)');

  assert.match(sanitized, /\[Create your first upsell\]\(#\)/);
  assert.doesNotMatch(sanitized, /\/broken\/pages/);
});
