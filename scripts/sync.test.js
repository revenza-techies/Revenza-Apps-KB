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
});
