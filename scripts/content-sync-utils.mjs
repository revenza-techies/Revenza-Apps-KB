import fs from 'node:fs';
import path from 'node:path';

export const homeDefaults = {
  title: 'Shopify App Help Center',
  description: 'Browse guides, tutorials, FAQs, and troubleshooting for every Revenza Shopify app.',
  eyebrow: 'Revenza Help Center',
  heroHeading: 'How can we help your store grow?',
  heroSubheading: 'Choose your Revenza app to find practical setup guides, tutorials, answers, and troubleshooting steps.',
  primaryAction: 'Browse all app knowledge bases',
  appsKicker: 'Our apps',
  appsHeading: 'Find the right knowledge base',
  appsIntro: 'Each app has its own focused guides, so you can move from question to answer without digging.',
  supportHeading: 'Still not sure where to look?',
  supportText: 'Tell us what you are trying to do and our merchant support team will point you in the right direction.',
  supportCta: 'Contact support',
  supportUrl: '/contact',
};

export function parseFrontMatterMarkdown(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {...homeDefaults};
  }

  const parsed = {};
  for (const line of match[1].split(/\r?\n/)) {
    const keyValue = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!keyValue) continue;
    const [, key, rawValue] = keyValue;
    parsed[key] = rawValue.replace(/^['"]|['"]$/g, '').trim();
  }

  return {...homeDefaults, ...parsed};
}

export function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) return false;
  fs.rmSync(destination, {recursive: true, force: true});
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.cpSync(source, destination, {recursive: true});
  return true;
}

function getGitBookAttribute(attributes, name) {
  const match = attributes.match(new RegExp(name + '=\"([^\"]+)\"'));
  return match ? match[1].trim() : '';
}

function slugifyTabValue(label, index) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'tab-' + (index + 1);
}

function humanizeGitBookLink(label) {
  return label
    .replace(/\.mdx?$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeGitBookHref(href) {
  return href
    .replace(/\\/g, '/')
    .replace(/\.mdx?(#[^)]+)?$/i, (_, hash = '') => hash);
}

function convertContentRefs(markdown) {
  return markdown.replace(
    /\{%\s*content-ref\s+url=\"([^\"]+)\"\s*%\}([\s\S]*?)\{%\s*endcontent-ref\s*%\}/g,
    (_, url, body) => {
      const link = body.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const label = humanizeGitBookLink((link?.[1] || url).trim());
      const href = normalizeGitBookHref((link?.[2] || url).trim());
      return '<a className=\"gitbookContentRef\" href=\"' + href + '\"><span className=\"gitbookContentRefIcon\" aria-hidden=\"true\"></span><span>' + label + '</span></a>';
    },
  );
}

function addMdxImport(markdown, importLine) {
  if (markdown.includes(importLine)) return markdown;
  const frontMatter = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (frontMatter) {
    return frontMatter[0] + importLine + '\n' + markdown.slice(frontMatter[0].length);
  }
  return importLine + '\n' + markdown;
}

function ensureMdxImportSpacing(markdown) {
  return markdown
    .replace(/(---\r?\n[\s\S]*?\r?\n---\r?\n)((?:import[^\n]+;\r?\n)+)(?=\S)/, '$1$2\n')
    .replace(/^((?:import[^\n]+;\r?\n)+)(?=\S)/, '$1\n');
}

function convertGitBookTabs(markdown) {
  let convertedTabs = false;
  const converted = markdown.replace(/\{%\s*tabs\s*%\}([\s\S]*?)\{%\s*endtabs\s*%\}/g, (_, block) => {
    const tabs = [];
    block.replace(/\{%\s*tab\s*([^%]*?)%\}([\s\S]*?)\{%\s*endtab\s*%\}/g, (match, attributes, content) => {
      const label = getGitBookAttribute(attributes, 'title') || 'Tab ' + (tabs.length + 1);
      tabs.push({label, content: convertContentRefs(content).trim()});
      return match;
    });

    if (!tabs.length) return '';
    convertedTabs = true;

    const tabItems = tabs
      .map((tab, index) => {
        const value = slugifyTabValue(tab.label, index);
        return '<TabItem value=\"' + value + '\" label=\"' + tab.label + '\">\n\n' + tab.content + '\n\n</TabItem>';
      })
      .join('\n\n');

    return '<div className=\"gitbookTabsShell\">\n\n<Tabs className=\"gitbookTabs\">\n\n' + tabItems + '\n\n</Tabs>\n\n</div>';
  });

  if (!convertedTabs) return converted;
  return ensureMdxImportSpacing(addMdxImport(
    addMdxImport(converted, "import Tabs from '@theme/Tabs';"),
    "import TabItem from '@theme/TabItem';",
  ));
}

function collapseDuplicateHintLabels(markdown) {
  return markdown.replace(
    /(> \*\*(Note|Warning):\*\*\s*)(?:\*\*)?(?:Note|Warning|Hint|Info):(?:\*\*)?\s*/gi,
    '$1',
  );
}
export function sanitizeGitBookMarkdown(markdown) {
  return collapseDuplicateHintLabels(convertGitBookTabs(markdown)
    .replace(/<figure>\s*<img([^>]*?)>\s*<figcaption>\s*<\/figcaption>\s*<\/figure>/g, '<img$1 />')
    .replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />')
    .replace(/\{%\s*hint(?:\s+style="([^"]+)")?\s*%\}\s*/g, (_, style) => {
      const label = style === 'danger' || style === 'warning' ? 'Warning' : 'Note';
      return `> **${label}:** `;
    })
    .replace(/\s*\{%\s*endhint\s*%\}/g, '')
    .replace(/\{%\s*[^%]*%\}\s*/g, ''));
}


const upsellOverviewLinkMap = new Map([
  ['/revenza-upsell/customization/design-placement', '/revenza-upsell/settings'],
  ['/revenza-upsell/offers/offer-rules', '/revenza-upsell/mapping'],
  ['/revenza-upsell/troubleshooting/common-issues', '/contact'],
]);


const overviewGuideIcons = [
  'ShoppingCartSimple',
  'SlidersHorizontal',
  'Storefront',
  'CheckCircle',
];

function escapeMdxText(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
}

function normalizeOverviewGuideHref(href) {
  const trimmed = href.trim();
  if (/^(https?:|mailto:|\/|#)/i.test(trimmed)) return trimmed;

  const normalized = trimmed
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/[?#].*$/, '')
    .replace(/\.mdx?$/i, '')
    .replace(/\/readme$/i, '');

  if (!normalized || normalized.toLowerCase() === 'readme') {
    return '/revenza-upsell/overview';
  }

  if (normalized.toLowerCase() === 'overview') {
    return '/revenza-upsell/overview';
  }

  return `/revenza-upsell/${normalized}`;
}

function extractPopularGuides(markdown) {
  const section = markdown.match(/(?:^|\n)###\s+Popular guides\s*\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/i);
  if (!section) return [];

  return section[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^[*-]\s+\[(?:\*\*)?([^\]\*]+)(?:\*\*)?\]\(([^)]+)\)\s*(?:[—-]\s*)?(.*)$/);
      if (!match) return undefined;
      const [, title, href, description] = match;
      return {
        title: title.trim(),
        href: normalizeOverviewGuideHref(href),
        description: description.trim(),
      };
    })
    .filter(Boolean);
}

function renderOverviewGuideList(guides) {
  return guides
    .map((guide, index) => {
      const icon = overviewGuideIcons[index % overviewGuideIcons.length];
      const description = guide.description || 'Open this guide for the next setup step.';
      return `      <Link to="${guide.href}">
        <${icon} size={22}/>
        <span><strong>${escapeMdxText(guide.title)}</strong><small>${escapeMdxText(description)}</small></span>
        <ArrowRight size={18}/>
      </Link>`;
    })
    .join('\n');
}

function mergeOverviewPopularGuides(markdown, readmeMarkdown) {
  if (!readmeMarkdown) return markdown;
  const guides = extractPopularGuides(readmeMarkdown);
  if (!guides.length) return markdown;

  return markdown.replace(
    /(<div className="guideList">\s*\n)([\s\S]*?)(\n\s*<\/div>)/,
    (_, open, _items, close) => `${open}${renderOverviewGuideList(guides)}${close}`,
  );
}

function normalizeOverviewFrontMatter(markdown) {
  if (!markdown.startsWith('---')) return markdown;
  return markdown
    .replace(/^title:\s*.*$/m, 'title: Overview')
    .replace(/^sidebar_label:\s*.*$/m, 'sidebar_label: Overview');
}

function stripMdxStyleBlocks(markdown) {
  return markdown
    .replace(/\n?<style>\{`[\s\S]*?`\}<\/style>\s*/g, '\n')
    .replace(/\n?<style>[\s\S]*?<\/style>\s*/g, '\n');
}

function normalizeUpsellOverviewLinks(markdown) {
  let normalized = markdown;
  for (const [from, to] of upsellOverviewLinkMap) {
    normalized = normalized.replaceAll(from, to);
  }
  return normalized;
}

export function sanitizeUpsellOverviewMarkdown(markdown, options = {}) {
  const merged = mergeOverviewPopularGuides(markdown, options.popularGuidesSource);
  const normalized = normalizeOverviewFrontMatter(merged);
  return normalizeUpsellOverviewLinks(stripMdxStyleBlocks(sanitizeGitBookMarkdown(normalized)));
}
export function copyDirectoryContents(source, destination, options = {}) {
  if (!fs.existsSync(source)) return false;
  fs.mkdirSync(destination, {recursive: true});

  if (options.clearExtensions?.length) {
    for (const entry of fs.readdirSync(destination)) {
      const target = path.join(destination, entry);
      if (fs.statSync(target).isFile() && options.clearExtensions.includes(path.extname(entry))) {
        fs.rmSync(target, {force: true});
      }
    }
  }

  for (const entry of fs.readdirSync(source)) {
    fs.cpSync(path.join(source, entry), path.join(destination, entry), {recursive: true});
  }
  return true;
}

function normalizeSidebarItem(item) {
  if (typeof item === 'string') return item;
  if (!item || typeof item !== 'object') {
    throw new Error('Sidebar items must be strings or objects.');
  }

  if (item.type === 'category') {
    if (!item.label || !Array.isArray(item.items)) {
      throw new Error('Sidebar category items require label and items.');
    }
    const category = {
      type: 'category',
      label: item.label,
      items: item.items.map(normalizeSidebarItem),
    };
    if (item.link && typeof item.link === 'object') category.link = item.link;
    if (typeof item.collapsed === 'boolean') category.collapsed = item.collapsed;
    return category;
  }

  if (item.type === 'doc') {
    if (!item.id) throw new Error('Sidebar doc items require id.');
    if (!item.label) return item.id;
    return {type: 'doc', id: item.id, label: item.label};
  }

  throw new Error(`Unsupported sidebar item type: ${item.type || 'missing'}.`);
}

export function createSidebarModule(sidebarItems) {
  if (!Array.isArray(sidebarItems)) {
    throw new Error('sidebar.json must contain an array.');
  }

  const normalized = sidebarItems.map(normalizeSidebarItem);
  return `/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */\nmodule.exports = {\n  upsellSidebar: ${JSON.stringify(normalized, null, 2)}\n};\n`;
}

function gitBookLinkToDocId(link) {
  const normalized = link
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/[?#].*$/, '')
    .replace(/\.mdx?$/i, '');

  if (!normalized || normalized.toLowerCase() === 'readme') return 'intro';
  if (normalized.toLowerCase() === 'overview') return 'intro';
  if (normalized.toLowerCase().endsWith('/readme')) return normalized.slice(0, -'/readme'.length);
  return normalized;
}

function summaryNodeToSidebarItem(node) {
  if (node.children.length) {
    return {
      type: 'category',
      label: node.label,
      link: {
        type: 'doc',
        id: node.id,
      },
      collapsed: true,
      items: node.children.map(summaryNodeToSidebarItem),
    };
  }

  return {
    type: 'doc',
    id: node.id,
    label: node.label,
  };
}

export function createSidebarFromSummaryMarkdown(markdown) {
  const root = [];
  const stack = [{indent: -1, children: root}];

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^(\s*)[*-]\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) continue;

    const [, whitespace, label, link] = match;
    const node = {
      indent: whitespace.length,
      label: label.trim(),
      id: gitBookLinkToDocId(link.trim()),
      children: [],
    };

    while (stack.length > 1 && node.indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return createSidebarModule(root.map(summaryNodeToSidebarItem));
}

