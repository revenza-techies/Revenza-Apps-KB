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
  const match = attributes.match(new RegExp(name + '=(?:\\"([^\\"]+)\\"|\\\'([^\\\']+)\\\')'));
  return match ? (match[1] || match[2] || '').trim() : '';
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

function normalizeGitBookHref(href = '') {
  const trimmed = String(href || '').trim();
  if (!trimmed || /^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) return trimmed;

  const hashIndex = trimmed.indexOf('#');
  const queryIndex = trimmed.indexOf('?');
  const suffixIndex = [hashIndex, queryIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0];
  const pathname = suffixIndex >= 0 ? trimmed.slice(0, suffixIndex) : trimmed;
  const suffix = suffixIndex >= 0 ? trimmed.slice(suffixIndex) : '';
  let normalized = path.posix.normalize(pathname.replace(/\\/g, '/'));

  while (normalized.startsWith('../')) normalized = normalized.slice(3);
  normalized = normalized
    .replace(/^\.\//, '')
    .replace(/\.mdx?$/i, '')
    .replace(/\/(?:README|readme)$/i, '')
    .replace(/^(?:README|readme)$/i, '');

  return normalized + suffix;
}

const upsellRootDocSegments = new Set([
  'overview',
  'getting-started',
  'pre-build-upsell-sets',
  'custom-upsell-sets',
  'mapping',
  'settings',
  'integration',
  'billing',
]);

function isRelativeGitBookHref(href = '') {
  return href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href);
}

function getCurrentDocFolder(currentDocPath = '') {
  const normalized = currentDocPath.replace(/\\/g, '/').replace(/^\.\//, '');
  return normalized.includes('/') ? normalized.split('/')[0] : '';
}

function shouldUseAbsoluteUpsellRoute(normalizedHref, currentDocPath = '') {
  const currentFolder = getCurrentDocFolder(currentDocPath);
  if (!currentFolder) return false;
  const firstSegment = normalizedHref.split(/[?#]/)[0].split('/')[0];
  return upsellRootDocSegments.has(firstSegment) && firstSegment !== currentFolder;
}

function normalizeGitBookRouteHref(href, options = {}) {
  const normalizedHref = normalizeGitBookHref(path.posix.normalize(href));
  if (shouldUseAbsoluteUpsellRoute(normalizedHref, options.currentDocPath)) {
    return `/revenza-upsell/${normalizedHref}`;
  }
  return normalizedHref;
}

function neutralizeBrokenGitBookLinks(markdown) {
  return markdown
    .replace(/\]\(\/broken\/pages\/[^)]+\)/g, '](#)')
    .replace(/href=(["'])\/broken\/pages\/[^"']+\1/g, 'href="#"');
}

function normalizeGitBookMarkdownLinks(markdown, options = {}) {
  return markdown.replace(/\]\((?!https?:|mailto:|tel:|\/|#)([^)\s]+)\)/gi, (match, href) => {
    if (!/\.mdx?(?:$|[?#])/i.test(href) && !href.includes('../')) return match;
    return `](${normalizeGitBookRouteHref(href, options)})`;
  });
}
function escapeHtmlAttribute(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

function stripInlineHtml(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, '')
    .replace(/:[a-z0-9_-]+:/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderGitBookButtonLink(attributes, body, options = {}) {
  const rawHref = getGitBookAttribute(attributes, 'href');
  const href = isRelativeGitBookHref(rawHref)
    ? normalizeGitBookRouteHref(rawHref, options)
    : rawHref;
  const classValue = getGitBookAttribute(attributes, 'class');
  const label = stripInlineHtml(body) || 'Open link';
  const modifier = /\bprimary\b/i.test(classValue) ? ' gitbookButton--primary' : '';
  const hrefAttribute = href ? ' href="' + escapeHtmlAttribute(href) + '"' : '';
  return '<a className="gitbookButton' + modifier + '"' + hrefAttribute + '>' + label + '</a>';
}

function convertGitBookButtonLinks(markdown, options = {}) {
  return markdown.replace(/<a\s+([^>]*\bclass=(?:"[^"]*\bbutton\b[^"]*"|'[^']*\bbutton\b[^']*')[^>]*)>([\s\S]*?)<\/a>/gi, (_, attributes, body) => {
    return renderGitBookButtonLink(attributes, body, options);
  });
}

function convertGitBookButtonDetails(markdown, options = {}) {
  return markdown.replace(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>/gi, (match, summary, body) => {
    const button = summary.match(/<a\s+([^>]*\bclass=(?:"[^"]*\bbutton\b[^"]*"|'[^']*\bbutton\b[^']*')[^>]*)>([\s\S]*?)<\/a>/i);
    if (!button) return match;
    const convertedSummary = renderGitBookButtonLink(button[1], button[2], options);
    const cleanedBody = body.trim();
    const bodyMarkup = cleanedBody ? '\n\n<div className="gitbookButtonCardBody">\n\n' + cleanedBody + '\n\n</div>' : '';
    return '<div className="gitbookButtonCard">\n\n<span className="gitbookButtonCardIcon" aria-hidden="true"></span>' + convertedSummary + bodyMarkup + '\n\n</div>';
  });
}

function gitBookClassName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, letter) => letter.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function gitBookLabel(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

function convertGitBookCards(markdown) {
  return markdown.replace(/\{%\s*cards\s*%\}([\s\S]*?)\{%\s*endcards\s*%\}/g, (_, block) => {
    const cards = [];
    block.replace(/\{%\s*card\s*([^%]*?)%\}([\s\S]*?)\{%\s*endcard\s*%\}/g, (match, attributes, content) => {
      const title = getGitBookAttribute(attributes, 'title') || 'Open guide';
      const href = getGitBookAttribute(attributes, 'href') || getGitBookAttribute(attributes, 'url');
      const icon = getGitBookAttribute(attributes, 'icon');
      cards.push({title, href: normalizeGitBookHref(href), icon, content: convertContentRefs(content).trim()});
      return match;
    });

    if (!cards.length) return convertUnknownGitBookBlock('cards', block);

    return '<div className="gitbookCards">\n\n' + cards.map((card) => {
      const tag = card.href ? 'a' : 'div';
      const href = card.href ? ' href="' + card.href + '"' : '';
      const icon = card.icon ? '<span className="gitbookCardIcon" aria-hidden="true">' + card.icon + '</span>' : '';
      return '<' + tag + ' className="gitbookCard"' + href + '>\n\n' + icon + '<strong>' + card.title + '</strong>\n\n' + card.content + '\n\n</' + tag + '>';
    }).join('\n\n') + '\n\n</div>';
  });
}

function convertLegacyDocusaurusTabs(markdown) {
  return markdown.replace(/(?:<div className="gitbookTabsShell">\s*)?<Tabs[^>]*className="gitbookTabs"[^>]*>([\s\S]*?)<\/Tabs>(?:\s*<\/div>)?/g, (_, block) => {
    const tabs = [];
    block.replace(/<TabItem[^>]*label="([^"]+)"[^>]*>([\s\S]*?)<\/TabItem>/g, (match, label, tabContent) => {
      tabs.push({label, content: convertContentRefs(tabContent).trim()});
      return match;
    });

    if (!tabs.length) return '';

    const tabList = tabs
      .map((tab, index) => '<span className="gitbookTab' + (index === 0 ? ' is-active' : '') + '" role="tab">' + escapeHtmlAttribute(tab.label) + '</span>')
      .join('\n');

    const panels = tabs
      .map((tab) => '<section className="gitbookTabPanel">\n\n<strong className="gitbookTabPanelTitle">' + escapeHtmlAttribute(tab.label) + '</strong>\n\n' + tab.content + '\n\n</section>')
      .join('\n\n');

    return '<div className="gitbookTabsShell">\n\n<div className="gitbookTabs" role="tablist">\n' + tabList + '\n</div>\n\n<div className="gitbookTabPanels">\n\n' + panels + '\n\n</div>\n\n</div>';
  });
}

function convertGitBookTabs(markdown) {
  return markdown.replace(/\{%\s*tabs\s*%\}([\s\S]*?)\{%\s*endtabs\s*%\}/g, (_, block) => {
    const tabs = [];
    block.replace(/\{%\s*tab\s*([^%]*?)%\}([\s\S]*?)\{%\s*endtab\s*%\}/g, (match, attributes, content) => {
      const label = getGitBookAttribute(attributes, 'title') || 'Tab ' + (tabs.length + 1);
      tabs.push({label, content: convertContentRefs(content).trim()});
      return match;
    });

    if (!tabs.length) return '';

    const tabList = tabs
      .map((tab, index) => '<span className="gitbookTab' + (index === 0 ? ' is-active' : '') + '" role="tab">' + escapeHtmlAttribute(tab.label) + '</span>')
      .join('\n');

    const panels = tabs
      .map((tab) => '<section className="gitbookTabPanel">\n\n<strong className="gitbookTabPanelTitle">' + escapeHtmlAttribute(tab.label) + '</strong>\n\n' + tab.content + '\n\n</section>')
      .join('\n\n');

    return '<div className="gitbookTabsShell">\n\n<div className="gitbookTabs" role="tablist">\n' + tabList + '\n</div>\n\n<div className="gitbookTabPanels">\n\n' + panels + '\n\n</div>\n\n</div>';
  });
}

function convertGitBookSteppers(markdown) {
  return markdown.replace(/\{%\s*stepper\s*%\}([\s\S]*?)\{%\s*endstepper\s*%\}/g, (_, block) => {
    const steps = [];
    block.replace(/\{%\s*step\s*%\}([\s\S]*?)\{%\s*endstep\s*%\}/g, (match, stepContent) => {
      const trimmed = stepContent.trim();
      if (trimmed) steps.push(trimmed);
      return match;
    });

    if (!steps.length) return '';

    return '<div className="gitbookStepper">\n\n' + steps
      .map((step, index) => '<div className="gitbookStep">\n\n<div className="gitbookStepMarker" aria-hidden="true">' + (index + 1) + '</div>\n\n<div className="gitbookStepContent">\n\n' + step + '\n\n</div>\n\n</div>')
      .join('\n\n') + '\n\n</div>';
  });
}

function convertGitBookExpandable(markdown) {
  return markdown.replace(/\{%\s*expandable\s*([^%]*?)%\}([\s\S]*?)\{%\s*endexpandable\s*%\}/g, (_, attributes, content) => {
    const title = getGitBookAttribute(attributes, 'title') || 'More details';
    return '<details className="gitbookExpandable">\n\n<summary>' + title + '</summary>\n\n' + content.trim() + '\n\n</details>';
  });
}

function convertGitBookColumns(markdown) {
  return markdown.replace(/\{%\s*columns\s*%\}([\s\S]*?)\{%\s*endcolumns\s*%\}/g, (_, block) => {
    const columns = [];
    block.replace(/\{%\s*column\s*%\}([\s\S]*?)\{%\s*endcolumn\s*%\}/g, (match, content) => {
      const trimmed = content.trim();
      if (trimmed) columns.push(trimmed);
      return match;
    });

    if (!columns.length) return convertUnknownGitBookBlock('columns', block);

    return '<div className="gitbookColumns">\n\n' + columns
      .map((column) => '<div className="gitbookColumn">\n\n' + column + '\n\n</div>')
      .join('\n\n') + '\n\n</div>';
  });
}

function convertGitBookEmbeds(markdown) {
  return markdown.replace(/\{%\s*embed\s+([^%]*?)%\}/g, (_, attributes) => {
    const url = getGitBookAttribute(attributes, 'url') || getGitBookAttribute(attributes, 'src') || '#';
    return '<a className="gitbookEmbed" href="' + url + '"><span className="gitbookEmbedIcon" aria-hidden="true"></span><span>' + url + '</span></a>';
  });
}

function convertGitBookFiles(markdown) {
  return markdown.replace(/\{%\s*file\s+([^%]*?)%\}/g, (_, attributes) => {
    const src = getGitBookAttribute(attributes, 'src') || getGitBookAttribute(attributes, 'url') || '#';
    const name = getGitBookAttribute(attributes, 'name') || path.basename(src);
    return '<a className="gitbookFile" href="' + normalizeGitBookHref(src) + '"><span className="gitbookFileIcon" aria-hidden="true"></span><span>' + name + '</span></a>';
  });
}

function convertGitBookOpenApi(markdown) {
  return markdown.replace(/\{%\s*(?:openapi|swagger)\s+([^%]*?)%\}/g, (_, attributes) => {
    const src = getGitBookAttribute(attributes, 'src') || getGitBookAttribute(attributes, 'url') || 'OpenAPI definition';
    const method = getGitBookAttribute(attributes, 'method');
    const apiPath = getGitBookAttribute(attributes, 'path');
    const details = [method, apiPath, src].filter(Boolean).join(' ');
    return '<div className="gitbookBlock gitbookBlock--openapi"><strong>OpenAPI</strong><span>' + details + '</span></div>';
  });
}

function convertUnknownGitBookBlock(name, content = '') {
  const className = 'gitbookBlock gitbookBlock--' + gitBookClassName(name);
  return '<div className="' + className + '"><strong>' + gitBookLabel(name) + '</strong>\n\n' + content.trim() + '\n\n</div>';
}

function convertRemainingGitBookBlocks(markdown) {
  return markdown
    .replace(/\{%\s*([a-z][a-z0-9-]*)(?:\s+[^%]*?)?%\}([\s\S]*?)\{%\s*end\1\s*%\}/gi, (_, name, content) => {
      return convertUnknownGitBookBlock(name, content);
    })
    .replace(/\{%\s*([a-z][a-z0-9-]*)(?:\s+([^%]*?))?%\}/gi, (_, name, attributes = '') => {
      const detail = attributes.trim() ? '`' + attributes.trim() + '`' : '';
      return convertUnknownGitBookBlock(name, detail);
    });
}

function collapseDuplicateHintLabels(markdown) {
  return markdown
    .replace(
      /(> \*\*(Note|Warning):\*\*\s*)_\*\*(?:Note|Warning|Hint|Info):\*\*\s*([^_\n]+)_/gi,
      '$1_$3_',
    )
    .replace(
      /(> \*\*(Note|Warning):\*\*\s*)(?:\*\*)?(?:Note|Warning|Hint|Info):(?:\*\*)?\s*/gi,
      '$1',
    );
}
export function sanitizeGitBookMarkdown(markdown, options = {}) {
  const converted = convertGitBookOpenApi(
    convertGitBookFiles(
      convertGitBookEmbeds(
        convertGitBookColumns(
          convertGitBookExpandable(
            convertGitBookSteppers(
              convertGitBookTabs(
                convertGitBookCards(convertGitBookButtonDetails(markdown, options)),
              ),
            ),
          ),
        ),
      ),
    ),
  )
    .replace(/<figure>\s*<img([^>]*?)>\s*<figcaption>\s*<\/figcaption>\s*<\/figure>/g, '<img$1 />')
    .replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />')
    .replace(/<br\s*>/gi, '<br />')
    .replace(/(["(])(?:\.\.\/)?\.gitbook\/assets\//g, '$1/img/content/revenza-upsell/assets/')
    .replace(/\{%\s*hint(?:\s+style=["']([^"']+)["'])?\s*%\}\s*/g, (_, style) => {
      const label = style === 'danger' || style === 'warning' ? 'Warning' : 'Note';
      return `> **${label}:** `;
    })
    .replace(/\s*\{%\s*endhint\s*%\}/g, '');

  return collapseDuplicateHintLabels(neutralizeBrokenGitBookLinks(convertRemainingGitBookBlocks(convertLegacyDocusaurusTabs(normalizeGitBookMarkdownLinks(convertGitBookButtonLinks(converted, options), options)))));
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
  if (!markdown.startsWith('---')) {
    return [
      '---',
      'id: intro',
      'slug: /overview',
      'title: Overview',
      'sidebar_label: Overview',
      '---',
      '',
      markdown.trimStart(),
    ].join('\n');
  }

  let normalized = markdown
    .replace(/^title:\s*.*$/m, 'title: Overview')
    .replace(/^sidebar_label:\s*.*$/m, 'sidebar_label: Overview');

  if (!/^slug:\s*/m.test(normalized)) {
    normalized = normalized.replace(/^(---\r?\n)/, '$1slug: /overview\n');
  } else {
    normalized = normalized.replace(/^slug:\s*.*$/m, 'slug: /overview');
  }

  return normalized;
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
  return normalizeUpsellOverviewLinks(stripMdxStyleBlocks(sanitizeGitBookMarkdown(normalized, options)));
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

  return JSON.stringify({upsellSidebar: sidebarItems.map(normalizeSidebarItem)}, null, 2) + '\n';
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

