const test = require("node:test");
const assert = require("node:assert/strict");
const { rewrite } = require("./sync");

test("converts GitBook columns and buttons to Docusaurus MDX", async () => {
  const input = [
    "{% columns %}",
    "{% column %}",
    '<a href="app-block-integration-product-page.md" class="button primary">Product Page Integration</a>',
    "{% endcolumn %}",
    "",
    "{% column %}",
    '<a href="app-block-integration-cart-page.md" class="button primary">Cart Page Integration</a>',
    "{% endcolumn %}",
    "{% endcolumns %}",
  ].join("\n");

  const output = await rewrite(input, "revenza-upsell", "integration/README.md");

  assert.match(output, /import Columns, \{ Column \} from '@site\/src\/components\/Docs\/Columns';/);
  assert.match(output, /<Columns>/);
  assert.match(output, /<Column>/);
  assert.match(output, /to="\/docs\/revenza-upsell\/integration\/app-block-integration-product-page"/);
  assert.match(output, /to="\/docs\/revenza-upsell\/integration\/app-block-integration-cart-page"/);
  assert.doesNotMatch(output, /\{%|%\}/);
  assert.match(output, /^---\ndescription: /);
  assert.match(
    output,
    /keywords: \["Revenza Upsell","Shopify upsell app","Integration guide"\]/
  );
});

test("preserves an authored SEO description", async () => {
  const input = [
    "---",
    "description: A carefully authored description for this guide.",
    "---",
    "# Billing",
    "",
    "Manage your subscription.",
  ].join("\n");
  const output = await rewrite(input, "revenza-upsell", "billing.md");

  assert.equal(
    output.match(/^description:.*$/m)?.[0],
    "description: A carefully authored description for this guide."
  );
  assert.match(
    output,
    /keywords: \["Revenza Upsell","Shopify upsell app","Billing guide"\]/
  );
});
test("rewrites obsolete GitBook anchors to canonical documentation routes", async () => {
  const input = [
    "# Links",
    "",
    "[Global settings](../settings/#global-settings)",
    "[Product integration](../integration/#product-page-integration)",
    "[Cart integration](../integration/#cart-page-integration)",
  ].join("\n");
  const output = await rewrite(input, "revenza-upsell", "getting-started/links.md");

  assert.match(output, /\/docs\/revenza-upsell\/settings\/global-settings/);
  assert.match(
    output,
    /\/docs\/revenza-upsell\/integration\/app-block-integration-product-page/
  );
  assert.match(
    output,
    /\/docs\/revenza-upsell\/integration\/app-block-integration-cart-page/
  );
  assert.doesNotMatch(output, /#global-settings|#product-page-integration|#cart-page-integration/);
});
test("limits overlong authored descriptions to search snippet length", async () => {
  const input = [
    "---",
    "description: >-",
    "  Configure how the Revenza Upsell widget is displayed and behaves on your cart page.",
    "  Customize content, display rules, recommendations, colors, headings, and storefront",
    "  placement while keeping the shopping experience consistent across devices.",
    "---",
    "# Cart Page",
  ].join("\n");
  const output = await rewrite(input, "revenza-upsell", "settings/cart-page.md");
  const description = output.match(/^description:\s*"([^"]+)"$/m)?.[1];

  assert.equal(
    description,
    "Configure how the Revenza Upsell widget is displayed and behaves on your cart page."
  );
  assert.ok(description.length <= 155);
});
