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

export function sanitizeGitBookMarkdown(markdown) {
  return markdown
    .replace(/<figure>\s*<img([^>]*?)>\s*<figcaption>\s*<\/figcaption>\s*<\/figure>/g, '<img$1 />')
    .replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />')
    .replace(/\{%\s*hint(?:\s+style="([^"]+)")?\s*%\}\s*/g, (_, style) => {
      const label = style === 'danger' || style === 'warning' ? 'Warning' : 'Note';
      return `> **${label}:** `;
    })
    .replace(/\s*\{%\s*endhint\s*%\}/g, '');
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