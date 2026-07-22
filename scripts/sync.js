const fs = require("fs");
const path = require("path");
const config = require("./sync-config");

const ROOT = process.cwd();

const IGNORE = new Set([".git", ".github", ".gitbook", "sidebar.json", "SUMMARY.md"]);

function normalizePathForConfig(value) {
  return value.split(path.sep).join("/");
}

function shouldExcludePath(sourcePath, baseDir, repo) {
  const excluded = new Set(repo.excludeFiles || []);
  const relativePath = normalizePathForConfig(path.relative(baseDir, sourcePath));

  return excluded.has(relativePath);
}

const HINT_TYPES = {
  info: "info",
  success: "tip",
  warning: "warning",
  danger: "danger",
};

const LEGACY_DOC_URLS = {
  "/revenza-upsell/settings/#global-settings":
    "/revenza-upsell/settings/global-settings",
  "/revenza-upsell/integration/#product-page-integration":
    "/revenza-upsell/integration/app-block-integration-product-page",
  "/revenza-upsell/integration/#cart-page-integration":
    "/revenza-upsell/integration/app-block-integration-cart-page",
};

const SEO_DESCRIPTION_OVERRIDES = {
  overview:
    "Learn how Revenza Upsell helps Shopify merchants create product offers, configure settings, and launch upsells across their online store.",
  billing:
    "Understand Revenza Upsell billing, subscription charges, plan management, and common payment questions for your Shopify store.",
  faqs:
    "Find answers to common Revenza Upsell questions about setup, integrations, product recommendations, billing, and troubleshooting.",
  mapping:
    "Learn how to map Revenza Upsell custom and pre-built product sets to Shopify products and collections.",
  "upsell review":
    "Preview Revenza Upsell offers on Shopify product and cart pages before publishing them to customers.",
  "app block integration - cart page":
    "Add the Revenza Upsell app block to your Shopify cart page and verify that cart upsell offers display correctly.",
  "app block integration - product page":
    "Add the Revenza Upsell app block to your Shopify product page and verify that product upsell offers display correctly.",
  integration:
    "Connect Revenza Upsell to Shopify product and cart pages using app blocks without editing your theme code.",
  settings:
    "Configure Revenza Upsell product-page, cart-page, and global settings to match your Shopify store and merchandising strategy.",
};

const VALIDATION_PATTERNS = [
  { pattern: "{%", label: "GitBook opening tag" },
  { pattern: "%}", label: "GitBook closing tag" },
  { pattern: "content-ref", label: "GitBook content-ref" },
  { pattern: "<figure>", label: "HTML figure tag" },
  { pattern: "<figcaption>", label: "HTML figcaption tag" },
];

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function clean(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function getRepositoriesRoot() {
  const githubRepositories = path.join(ROOT, "repositories");
  return fs.existsSync(githubRepositories) ? githubRepositories : path.resolve(ROOT, "..");
}

function parseAttributes(source) {
  const attributes = {};
  const attrPattern = /([\w-]+)="([^"]*)"/g;
  let match;

  while ((match = attrPattern.exec(source))) {
    attributes[match[1]] = match[2];
  }

  return attributes;
}

function slugify(value) {
  const slug = value
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "tab";
}

function normalizeGitBookUrl(url) {
  if (!url) return url;
  if (url.startsWith("/broken/pages/")) return "#";
  if (url === "/contact") return "https://revenza.in/contact";
  if (url === "/docs/revenza-upsell" || url === "/docs/revenza-upsell/") {
    return "/revenza-upsell/";
  }
  if (url.startsWith("/docs/revenza-upsell/")) return url.slice("/docs".length);
  if (url === "/revenza-upsell") return "/revenza-upsell/";
  if (url.startsWith("/revenza-upsell/")) return url;

  return url;
}

function normalizeGitBookUrls(markdown) {
  return markdown.replace(/\b(to|href)="([^"]+)"/g, (_, attr, url) => {
    return `${attr}="${normalizeGitBookUrl(url)}"`;
  });
}

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function normalizeDocusaurusDocUrl(url, app, sourceRelativePath = "") {
  if (!url || /^(?:https?:|mailto:|tel:|#)/i.test(url)) return url;

  const normalizedUrl = normalizeGitBookUrl(url);
  const canonicalUrl = LEGACY_DOC_URLS[normalizedUrl] || normalizedUrl;
  const appBasePath = `/${app}`;
  if (
    canonicalUrl === appBasePath ||
    canonicalUrl.startsWith(`${appBasePath}/`) ||
    /^(?:https?:|mailto:|tel:|#)/i.test(canonicalUrl)
  ) {
    return canonicalUrl;
  }

  if (canonicalUrl.startsWith("/")) return canonicalUrl;

  const [rawPath, hash = ""] = normalizedUrl.split("#");
  const sourceDir = path.posix.dirname(toPosixPath(sourceRelativePath));
  const relativeBase = sourceDir === "." ? "" : sourceDir;
  const docsPath = path.posix
    .normalize(path.posix.join("/", app, relativeBase, rawPath))
    .replace(/\/README\.md$/i, "/")
    .replace(/\.md$/i, "");

  const safeHash = hash === "creating-custom-upsell-sets" ? "" : hash;
  const resolvedUrl = safeHash ? `${docsPath}#${safeHash}` : docsPath;
  return LEGACY_DOC_URLS[resolvedUrl] || resolvedUrl;
}

function convertGitBookButtons(markdown, app, sourceRelativePath = "") {
  const imports = new Set();
  const toButtonLink = (href, label) => {
    imports.add("Link");
    const target = normalizeDocusaurusDocUrl(href, app, sourceRelativePath);
    return `<Link className="button button--primary" to="${target}">${label.trim()}</Link>`;
  };

  const withoutDetailsWrappers = markdown.replace(
    /<details>\s*<summary>\s*(?:<i[^>]*>.*?<\/i>\s*)?<a\s+href="([^"]+)"\s+class="button primary">([\s\S]*?)<\/a>\s*<\/summary>\s*([\s\S]*?)\s*<\/details>/gi,
    (_, href, label, body = "") => {
      const description = body.trim();
      return description ? `${toButtonLink(href, label)}\n\n${description}` : toButtonLink(href, label);
    }
  );

  const markdownWithLinks = withoutDetailsWrappers.replace(
    /<a\s+href="([^"]+)"\s+class="button primary">([\s\S]*?)<\/a>/gi,
    (_, href, label) => toButtonLink(href, label)
  );

  return { markdown: markdownWithLinks, imports };
}
function humanizeContentRefLabel(value) {
  const withoutHash = value.split("#")[0];
  const basename = path.posix.basename(withoutHash).replace(/\.md$/i, "");
  const label = basename.toLowerCase() === "readme" ? path.posix.basename(path.posix.dirname(withoutHash)) : basename;

  return label
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function convertGitBookContentRefs(markdown, app, sourceRelativePath = "") {
  const imports = new Set();

  const converted = markdown.replace(
    /\{%\s*content-ref\s+url="([^"]+)"\s*%\}\s*(?:\[[^\]]+\]\([^)]+\)\s*)?\{%\s*endcontent-ref\s*%\}/gi,
    (_, href) => {
      imports.add("Link");
      const target = normalizeDocusaurusDocUrl(href, app, sourceRelativePath);
      const label = humanizeContentRefLabel(href);
      return `<Link className="button button--secondary" to="${target}">${label}</Link>`;
    }
  );

  return { markdown: converted, imports };
}
function rewriteAssetUrl(url, app) {
  if (!url) return url;

  const rewritten = url
    .replace(/^\.gitbook\/assets\//, `/gitbook/${app}/`)
    .replace(/^\.\.\/\.gitbook\/assets\//, `/gitbook/${app}/`);

  return rewritten.startsWith(`/gitbook/${app}/`) ? encodeURI(rewritten) : rewritten;
}

function convertFigures(markdown, app) {
  return markdown.replace(
    /<figure>\s*<img\b([^>]*)>\s*(?:<figcaption>(.*?)<\/figcaption>)?\s*<\/figure>/gis,
    (_, imgAttributes, caption = "") => {
      const src = imgAttributes.match(/\bsrc="([^"]+)"/i)?.[1] || "";
      const alt = imgAttributes.match(/\balt="([^"]*)"/i)?.[1] || "";
      const title = caption.replace(/<[^>]+>/g, "").trim();
      const imageUrl = rewriteAssetUrl(src, app);

      return title ? `![${alt}](${imageUrl} "${title}")` : `![${alt}](${imageUrl})`;
    }
  );
}

function transformGitBookDirectives(markdown) {
  const imports = new Set();
  const lines = markdown.split(/\r?\n/);
  const output = [];
  const tabCounts = new Map();
  const state = {
    stepperDepth: 0,
    stepIndex: 0,
  };

  for (const line of lines) {
    const directive = line.trim().match(/^\{%\s*(.*?)\s*%\}$/);

    if (!directive) {
      output.push(line);
      continue;
    }

    const body = directive[1];
    const [name] = body.split(/\s+/, 1);
    const attributes = parseAttributes(body);

    switch (name) {
      case "hint": {
        output.push(`:::${HINT_TYPES[attributes.style] || "note"}`);
        break;
      }
      case "endhint": {
        output.push(":::");
        break;
      }
      case "stepper": {
        imports.add("Stepper");
        imports.add("Step");
        state.stepperDepth += 1;
        state.stepIndex = 0;
        output.push("", "<Stepper>", "");
        break;
      }
      case "endstepper": {
        state.stepperDepth = Math.max(0, state.stepperDepth - 1);
        output.push("", "</Stepper>", "");
        break;
      }
      case "step": {
        imports.add("Stepper");
        imports.add("Step");
        state.stepIndex += 1;
        output.push("", "<Step>", "");
        break;
      }
      case "endstep": {
        output.push("", "</Step>", "");
        break;
      }
      case "columns": {
        imports.add("Columns");
        imports.add("Column");
        output.push("", "<Columns>", "");
        break;
      }
      case "endcolumns": {
        output.push("", "</Columns>", "");
        break;
      }
      case "column": {
        imports.add("Columns");
        imports.add("Column");
        output.push("", "<Column>", "");
        break;
      }
      case "endcolumn": {
        output.push("", "</Column>", "");
        break;
      }
      case "tabs": {
        imports.add("Tabs");
        imports.add("TabItem");
        output.push("<Tabs>");
        break;
      }
      case "endtabs": {
        output.push("</Tabs>");
        break;
      }
      case "tab": {
        imports.add("Tabs");
        imports.add("TabItem");
        const label = attributes.title || "Tab";
        const baseValue = slugify(label);
        const count = (tabCounts.get(baseValue) || 0) + 1;
        tabCounts.set(baseValue, count);
        const value = count === 1 ? baseValue : `${baseValue}-${count}`;
        output.push(`<TabItem value="${value}" label="${label}">`);
        break;
      }
      case "endtab": {
        output.push("</TabItem>");
        break;
      }
      case "content-ref":
      case "endcontent-ref": {
        break;
      }
      case "expand": {
        output.push("<details>", `<summary>${attributes.title || "Details"}</summary>`, "");
        break;
      }
      case "endexpand": {
        output.push("", "</details>");
        break;
      }
      case "embed": {
        if (attributes.url) {
          output.push(`[${attributes.url}](${attributes.url})`);
        }
        break;
      }
      default: {
        throw new Error(`Unsupported GitBook directive: {% ${body} %}`);
      }
    }
  }

  return {
    markdown: output.join("\n"),
    imports,
  };
}

function insertMdxImports(markdown, imports) {
  if (!imports.size) return markdown;

  const importLines = [];

  if (imports.has("Link")) {
    importLines.push("import Link from '@docusaurus/Link';");
  }

  if (imports.has("Stepper") || imports.has("Step")) {
    importLines.push("import Stepper, { Step } from '@site/src/components/Docs/Stepper';");
  }

  if (imports.has("Columns") || imports.has("Column")) {
    importLines.push("import Columns, { Column } from '@site/src/components/Docs/Columns';");
  }

  if (imports.has("Tabs")) {
    importLines.push("import Tabs from '@theme/Tabs';");
  }

  if (imports.has("TabItem")) {
    importLines.push("import TabItem from '@theme/TabItem';");
  }

  const importBlock = `${importLines.join("\n")}\n\n`;
  const frontmatterMatch = markdown.match(/^---\n[\s\S]*?\n---\n?/);

  if (!frontmatterMatch) {
    return `${importBlock}${markdown}`;
  }

  const frontmatter = frontmatterMatch[0];
  return `${frontmatter}${importBlock}${markdown.slice(frontmatter.length)}`;
}

function splitFrontmatter(markdown) {
  const match = markdown.match(/^---\n[\s\S]*?\n---\n?/);

  if (!match) {
    return { frontmatter: "", body: markdown };
  }

  return {
    frontmatter: match[0],
    body: markdown.slice(match[0].length),
  };
}
function stripMarkdownForDescription(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_>#\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function trimSeoDescription(value, maxLength = 155) {
  if (value.length <= maxLength) return value;

  const completeSentence = value.slice(0, maxLength + 1).match(/^(.{50,}?[.!?])(?:\s|$)/);
  if (completeSentence) return completeSentence[1];

  const contentLimit = maxLength - 3;
  const shortened = value.slice(0, contentLimit + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return shortened
    .slice(0, lastSpace > 110 ? lastSpace : contentLimit)
    .trim()
    .concat("...");
}

function normalizeDescriptionFrontmatter(markdown) {
  const { frontmatter, body } = splitFrontmatter(markdown);
  if (!frontmatter) return markdown;

  const blockPattern = /^description:\s*[>|]-?\s*\n((?:[ \t]+[^\n]*(?:\n|$))*)/m;
  let updatedFrontmatter = frontmatter.replace(blockPattern, (_, lines) => {
    const description = lines
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ");
    return "description: " + JSON.stringify(trimSeoDescription(description)) + "\n";
  });

  const inlinePattern = /^description:\s*(?![>|]\s*$)(.+)$/m;
  updatedFrontmatter = updatedFrontmatter.replace(inlinePattern, (line, rawValue) => {
    let description = rawValue.trim();
    if (
      (description.startsWith('"') && description.endsWith('"')) ||
      (description.startsWith("'") && description.endsWith("'"))
    ) {
      description = description.slice(1, -1);
    }

    if (description.length <= 155) return line;
    return "description: " + JSON.stringify(trimSeoDescription(description));
  });

  return updatedFrontmatter + body;
}

function inferSeoMetadata(markdown, app, sourceRelativePath = "") {
  const { body } = splitFrontmatter(markdown);
  const titleMatch = body.match(/^#\s+(.+)$/m);
  const title = stripMarkdownForDescription(
    titleMatch?.[1] || humanizeContentRefLabel(sourceRelativePath)
  );
  const paragraphs = body
    .replace(/^import\s+.*;\s*$/gm, "")
    .replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g, "")
    .split(/\n\s*\n/)
    .map(stripMarkdownForDescription)
    .filter((paragraph) => paragraph && !/^(?:import|export)\s/.test(paragraph));
  const candidate =
    paragraphs.find((paragraph) => paragraph.length >= 70) ||
    paragraphs.find((paragraph) => paragraph.length >= 35);
  const productName = app === "revenza-upsell" ? "Revenza Upsell" : "Revenza Apps";
  const fallback =
    "Learn how to use " +
    productName +
    " with this " +
    (title || "documentation") +
    " guide for Shopify merchants.";
  const authoredOverride = SEO_DESCRIPTION_OVERRIDES[title.toLowerCase()];
  const contextual = authoredOverride || candidate || fallback;
  const description = /revenza/i.test(contextual)
    ? contextual
    : productName + ": " + contextual;

  return {
    description: trimSeoDescription(description),
    keywords: [productName, "Shopify upsell app", (title || "Shopify app") + " guide"],
  };
}

function ensureSeoFrontmatter(markdown, app, sourceRelativePath = "") {
  const { frontmatter } = splitFrontmatter(markdown);
  const hasDescription = /^description:\s*(?:[>|].*|["'].*|\S.*)$/m.test(frontmatter);
  const hasKeywords = /^keywords:\s*(?:\[.*|\S.*)$/m.test(frontmatter);

  if (hasDescription && hasKeywords) return normalizeDescriptionFrontmatter(markdown);

  const metadata = inferSeoMetadata(markdown, app, sourceRelativePath);
  const additions = [];
  if (!hasDescription) {
    additions.push("description: " + JSON.stringify(metadata.description));
  }
  if (!hasKeywords) {
    additions.push("keywords: " + JSON.stringify(metadata.keywords));
  }

  if (!frontmatter) {
    return normalizeDescriptionFrontmatter(
      "---\n" + additions.join("\n") + "\n---\n" + markdown
    );
  }

  const closingIndex = frontmatter.lastIndexOf("\n---");
  const updatedFrontmatter =
    frontmatter.slice(0, closingIndex) +
    "\n" +
    additions.join("\n") +
    frontmatter.slice(closingIndex);
  return normalizeDescriptionFrontmatter(
    updatedFrontmatter + markdown.slice(frontmatter.length)
  );
}
async function normalizeMarkdown(markdown, app, sourceRelativePath = "") {
  const [{ unified }, remarkParse, remarkMdx, remarkGfm, remarkStringify, { visit }] =
    await Promise.all([
      import("unified"),
      import("remark-parse"),
      import("remark-mdx"),
      import("remark-gfm"),
      import("remark-stringify"),
      import("unist-util-visit"),
    ]);

  const { frontmatter, body } = splitFrontmatter(markdown);

  const processor = unified()
    .use(remarkParse.default)
    .use(remarkMdx.default)
    .use(remarkGfm.default)
    .use(() => (tree) => {
      visit(tree, ["image", "definition", "link"], (node) => {
        if (!node.url) return;

        if (node.type === "image") {
          node.url = rewriteAssetUrl(normalizeGitBookUrl(node.url), app);
          return;
        }

        node.url = normalizeDocusaurusDocUrl(node.url, app, sourceRelativePath);
      });
    })
    .use(remarkStringify.default, {
      bullet: "*",
      fences: true,
      rule: "-",
      ruleRepetition: 3,
      emphasis: "_",
    });

  const tree = processor.parse(body);
  await processor.run(tree);

  const normalized = `${String(processor.stringify(tree)).trimEnd().replace(/%25([0-9A-Fa-f]{2})/g, "%$1")}\n`;
  return frontmatter ? `${frontmatter}${normalized}` : normalized;
}

async function rewrite(markdown, app, sourceRelativePath = "") {
  const withoutHtmlEntities = normalizeGitBookUrls(markdown)
    .replace(/&#x20;/g, " ")
    .replace(/\u00e2\u2020\u2019/g, " to ")
    .replace(/\u00e2\u20ac\u201d/g, " - ")
    .replace(/<br\s*\/?\>/gi, "\n");
  const figuresConverted = convertFigures(withoutHtmlEntities, app);
  const buttonConverted = convertGitBookButtons(figuresConverted, app, sourceRelativePath);
  const contentRefConverted = convertGitBookContentRefs(buttonConverted.markdown, app, sourceRelativePath);
  const transformed = transformGitBookDirectives(contentRefConverted.markdown);
  for (const importedComponent of buttonConverted.imports) {
    transformed.imports.add(importedComponent);
  }
  for (const importedComponent of contentRefConverted.imports) {
    transformed.imports.add(importedComponent);
  }  const withImports = insertMdxImports(transformed.markdown, transformed.imports);

  const normalized = await normalizeMarkdown(withImports, app, sourceRelativePath);
  return ensureSeoFrontmatter(normalized, app, sourceRelativePath);
}

function validateOutput(markdown, outputFile) {
  const failures = VALIDATION_PATTERNS.filter(({ pattern }) => markdown.includes(pattern));

  if (failures.length) {
    const labels = failures.map(({ label }) => label).join(", ");
    throw new Error(`${outputFile} contains unsupported GitBook syntax: ${labels}`);
  }
}

async function copyDocs(src, dst, app, repo, baseDir = src) {
  ensure(dst);

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (IGNORE.has(entry.name)) continue;

    const sourcePath = path.join(src, entry.name);
    const destinationPath = path.join(dst, entry.name);

    if (shouldExcludePath(sourcePath, baseDir, repo)) continue;

    if (entry.isDirectory()) {
      await copyDocs(sourcePath, destinationPath, app, repo, baseDir);
      continue;
    }

    if (!entry.name.toLowerCase().endsWith(".md")) continue;

    const markdown = await rewrite(fs.readFileSync(sourcePath, "utf8"), app, path.relative(baseDir, sourcePath));
    validateOutput(markdown, destinationPath);
    fs.writeFileSync(destinationPath, markdown);
  }
}

function summaryLinkToDocId(app, link) {
  const rawPath = link.split("#")[0].replace(/\\/g, "/");
  const normalized = path.posix.normalize(rawPath);

  if (normalized === "." || /^README\.md$/i.test(normalized)) {
    return `${app}/README`;
  }

  if (/\/README\.md$/i.test(normalized)) {
    return `${app}/${normalized.replace(/\/README\.md$/i, "/README")}`;
  }

  return `${app}/${normalized.replace(/\.md$/i, "")}`;
}

function isSummaryLinkExcluded(link, repo) {
  const excluded = new Set(repo.excludeFiles || []);
  const rawPath = link.split("#")[0].replace(/\\/g, "/");
  const normalized = path.posix.normalize(rawPath);

  return excluded.has(normalized);
}

function parseGitBookSummary(summaryPath, repo) {
  const source = fs.readFileSync(summaryPath, "utf8");
  const root = { children: [] };
  const stack = [{ depth: -1, node: root }];

  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^(\s*)\*\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) continue;

    const depth = Math.floor(match[1].length / 2);
    const node = {
      label: match[2],
      link: match[3],
      children: [],
    };

    while (stack.length && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    stack[stack.length - 1].node.children.push(node);
    stack.push({ depth, node });
  }

  return root.children;
}

function toSidebarItem(node, repo) {
  const childItems = node.children.map((child) => toSidebarItem(child, repo)).filter(Boolean);
  const linkExcluded = isSummaryLinkExcluded(node.link, repo);

  if (childItems.length) {
    const category = {
      type: "category",
      label: node.label,
      collapsed: true,
      items: childItems,
    };

    if (!linkExcluded) {
      category.link = {
        type: "doc",
        id: summaryLinkToDocId(repo.docsDestination, node.link),
      };
    }

    return category;
  }

  if (linkExcluded) return null;

  return {
    type: "doc",
    id: summaryLinkToDocId(repo.docsDestination, node.link),
    label: node.label,
  };
}

function writeSidebars(syncedRepositories) {
  const tutorialSidebar = [];

  for (const { repo, sourceDir } of syncedRepositories) {
    const summaryPath = path.join(sourceDir, "SUMMARY.md");
    if (!fs.existsSync(summaryPath)) continue;

    const items = parseGitBookSummary(summaryPath, repo)
      .map((node) => toSidebarItem(node, repo))
      .filter(Boolean);

    tutorialSidebar.push(...items);
  }

  const sidebarConfig = {
    tutorialSidebar: tutorialSidebar.length
      ? tutorialSidebar
      : [{ type: "autogenerated", dirName: "." }],
  };

  const file = `const sidebars = ${JSON.stringify(sidebarConfig, null, 2)};\n\nexport default sidebars;\n`;
  fs.writeFileSync(path.join(ROOT, "sidebars.js"), file);
}
function copyAssets(src, dst) {
  if (!fs.existsSync(src)) return;

  ensure(dst);

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const sourcePath = path.join(src, entry.name);
    const destinationPath = path.join(dst, entry.name);

    if (entry.isDirectory()) {
      copyAssets(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

async function main() {
  const reposDir = getRepositoriesRoot();
  const syncedRepositories = [];

  for (const repo of config.repositories) {
    const src = path.join(reposDir, repo.name);

    if (!fs.existsSync(src)) {
      throw new Error(`Repository '${repo.name}' not found.\nExpected location:\n${src}`);
    }

    const docs = path.join(ROOT, "docs", repo.docsDestination);
    const assets = path.join(ROOT, "static", "gitbook", repo.docsDestination);

    clean(docs);
    clean(assets);

    await copyDocs(src, docs, repo.docsDestination, repo);
    copyAssets(path.join(src, ".gitbook", "assets"), assets);
    syncedRepositories.push({ repo, sourceDir: src });
    console.log(`[ok] ${repo.name}`);
  }

  writeSidebars(syncedRepositories);

  console.log("Synchronization complete.");
}
if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  ensureSeoFrontmatter,
  rewrite,
  transformGitBookDirectives,
};
