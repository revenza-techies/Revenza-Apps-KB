import fs from 'node:fs';
import path from 'node:path';
import {copyDirectory, copyDirectoryContents, createSidebarModule, parseFrontMatterMarkdown} from './content-sync-utils.mjs';

const root = process.cwd();

const legacySource = resolveOptionalPath(process.env.CONTENT_REPO_PATH || process.argv[2]);
const homeSource = resolveOptionalPath(process.env.HOME_CONTENT_REPO_PATH) || legacySource || path.resolve(root, '../revenza-kb-content');
const upsellSource = resolveOptionalPath(process.env.REVENZA_UPSELL_CONTENT_REPO_PATH) || legacySource;

const upsellMappings = [
  ['overview.md', 'docs/intro.md'],
  ['Overview.md', 'docs/intro.md'],
  ['intro.md', 'docs/intro.md'],
  ['Getting Started.md', 'docs/getting-started.md'],
  ['getting-started.md', 'docs/getting-started.md'],
  ['faq.md', 'docs/faq.md'],
  ['getting-started', 'docs/getting-started'],
  ['offers', 'docs/offers'],
  ['customization', 'docs/customization'],
  ['troubleshooting', 'docs/troubleshooting'],
];

function resolveOptionalPath(value) {
  return value ? path.resolve(root, value) : undefined;
}

function existingPath(...segments) {
  const candidate = path.join(...segments);
  return fs.existsSync(candidate) ? candidate : undefined;
}

function copyFileIfExists(from, relativeDestination) {
  if (!fs.existsSync(from)) return false;
  const to = path.join(root, relativeDestination);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.copyFileSync(from, to);
  return true;
}

function writeJson(relativeDestination, data) {
  const to = path.join(root, relativeDestination);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.writeFileSync(to, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relativeDestination, content) {
  const to = path.join(root, relativeDestination);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.writeFileSync(to, content);
}

function syncHomeContent(source) {
  if (!fs.existsSync(source)) {
    console.log(`[sync-content] Home content repo not found at ${source}. Using committed fallback home content.`);
    return 0;
  }

  let copied = 0;

  const allAppsPath = path.join(source, 'all-apps.md');
  if (fs.existsSync(allAppsPath)) {
    writeJson('src/data/homeContent.json', parseFrontMatterMarkdown(fs.readFileSync(allAppsPath, 'utf8')));
    copied += 1;
  }

  const appsPath = path.join(source, 'apps.json');
  if (fs.existsSync(appsPath)) {
    writeJson('src/data/apps.json', JSON.parse(fs.readFileSync(appsPath, 'utf8')));
    copied += 1;
  }

  if (copyDirectory(path.join(source, 'images'), path.join(root, 'static/img/content'))) {
    copied += 1;
  }

  if (copyDirectoryContents(path.join(source, 'changelog'), path.join(root, 'blog'), {clearExtensions: ['.md', '.mdx']})) {
    copied += 1;
  }

  return copied;
}

function syncUpsellContent(source) {
  if (!source || !fs.existsSync(source)) {
    console.log('[sync-content] Revenza Upsell content repo not configured. Using committed fallback app content.');
    return 0;
  }

  const appRoot = existingPath(source, 'overview.md') || existingPath(source, 'Overview.md') || existingPath(source, 'intro.md')
    ? source
    : existingPath(source, 'revenza-upsell') || source;
  let copied = 0;

  const sidebarPath = path.join(appRoot, 'sidebar.json');
  if (fs.existsSync(sidebarPath)) {
    writeText('sidebars.js', createSidebarModule(JSON.parse(fs.readFileSync(sidebarPath, 'utf8'))));
    copied += 1;
  }

  if (
    fs.existsSync(path.join(appRoot, 'overview.md'))
    || fs.existsSync(path.join(appRoot, 'Overview.md'))
    || fs.existsSync(path.join(appRoot, 'intro.md'))
  ) {
    fs.rmSync(path.join(root, 'docs/intro.mdx'), {force: true});
  }

  for (const [relativeSource, relativeDestination] of upsellMappings) {
    const from = path.join(appRoot, relativeSource);
    const to = path.join(root, relativeDestination);
    if (!fs.existsSync(from)) continue;

    const stats = fs.statSync(from);
    if (stats.isDirectory()) {
      if (copyDirectory(from, to)) copied += 1;
    } else if (copyFileIfExists(from, relativeDestination)) {
      copied += 1;
    }
  }

  const appImages = path.join(source, 'images');
  const nestedImages = path.join(appImages, 'revenza-upsell');
  if (fs.existsSync(nestedImages)) {
    if (copyDirectory(nestedImages, path.join(root, 'static/img/content/revenza-upsell'))) copied += 1;
  } else if (fs.existsSync(appImages)) {
    if (copyDirectory(appImages, path.join(root, 'static/img/content/revenza-upsell'))) copied += 1;
  }

  if (copyDirectoryContents(path.join(appRoot, 'changelog'), path.join(root, 'blog'), {clearExtensions: ['.md', '.mdx']})) {
    copied += 1;
  }

  return copied;
}

const homeCopied = syncHomeContent(homeSource);
const upsellCopied = syncUpsellContent(upsellSource);
console.log(`[sync-content] Synced ${homeCopied} home content group(s) from ${homeSource}.`);
console.log(`[sync-content] Synced ${upsellCopied} Revenza Upsell content group(s)${upsellSource ? ` from ${upsellSource}` : ''}.`);