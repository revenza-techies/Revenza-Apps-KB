import fs from 'node:fs';
import path from 'node:path';
import {
  copyDirectory,
  copyDirectoryContents,
  createSidebarFromSummaryMarkdown,
  createSidebarModule,
  parseFrontMatterMarkdown,
  sanitizeGitBookMarkdown,
} from './content-sync-utils.mjs';

const root = process.cwd();

const legacySource = resolveOptionalPath(process.env.CONTENT_REPO_PATH || process.argv[2]);
const homeSource = resolveOptionalPath(process.env.HOME_CONTENT_REPO_PATH) || legacySource || path.resolve(root, '../revenza-kb-content');
const upsellSource = resolveOptionalPath(process.env.REVENZA_UPSELL_CONTENT_REPO_PATH) || legacySource;

const ignoredUpsellEntries = new Set([
  '.git',
  '.github',
  '.gitbook',
  'changelog',
  'images',
  'sidebar.json',
  'SUMMARY.md',
]);

function resolveOptionalPath(value) {
  return value ? path.resolve(root, value) : undefined;
}

function existingPath(...segments) {
  const candidate = path.join(...segments);
  return fs.existsSync(candidate) ? candidate : undefined;
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

function sanitizeMarkdownFile(filePath) {
  if (!/\.mdx?$/.test(filePath)) return;
  fs.writeFileSync(filePath, sanitizeGitBookMarkdown(fs.readFileSync(filePath, 'utf8')));
}

function sanitizeMarkdownTree(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      sanitizeMarkdownTree(target);
      continue;
    }
    if (entry.name.toLowerCase() === 'readme.md') {
      fs.rmSync(target, {force: true});
      continue;
    }
    sanitizeMarkdownFile(target);
  }
}

function copyMarkdownFile(from, relativeDestination) {
  if (!fs.existsSync(from)) return false;
  const to = path.join(root, relativeDestination);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.copyFileSync(from, to);
  sanitizeMarkdownFile(to);
  return true;
}

function rewriteFolderReadmeLinks(markdown, docsFolder) {
  return markdown.replace(/\]\((?!https?:|mailto:|\/|#)([^)#?]+\.md)([#?][^)]*)?\)/gi, (_, target, suffix = '') => {
    return `](${docsFolder}/${target}${suffix})`;
  });
}

function copyGitBookDirectory(from, relativeDestination) {
  const to = path.join(root, relativeDestination);
  if (!copyDirectory(from, to)) return false;
  sanitizeMarkdownTree(to);

  const readmePath = existingPath(from, 'README.md') || existingPath(from, 'readme.md');
  if (readmePath) {
    const landingPath = path.join(root, `${relativeDestination}.md`);
    const docsFolder = path.basename(relativeDestination);
    fs.mkdirSync(path.dirname(landingPath), {recursive: true});
    const landingMarkdown = rewriteFolderReadmeLinks(fs.readFileSync(readmePath, 'utf8'), docsFolder);
    fs.writeFileSync(landingPath, sanitizeGitBookMarkdown(landingMarkdown));
  }

  return true;
}

function destinationForTopLevelMarkdown(fileName) {
  const lowerName = fileName.toLowerCase();
  if (lowerName === 'readme.md') return undefined;
  if (lowerName === 'overview.md' || lowerName === 'intro.md') return 'docs/intro.md';
  if (lowerName === 'getting started.md') return 'docs/getting-started.md';
  return `docs/${fileName.replace(/\.mdx?$/i, '.md')}`;
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

function syncUpsellSidebar(appRoot) {
  const summaryPath = path.join(appRoot, 'SUMMARY.md');
  if (fs.existsSync(summaryPath)) {
    writeText('sidebars.js', createSidebarFromSummaryMarkdown(fs.readFileSync(summaryPath, 'utf8')));
    return true;
  }

  const sidebarPath = path.join(appRoot, 'sidebar.json');
  if (fs.existsSync(sidebarPath)) {
    writeText('sidebars.js', createSidebarModule(JSON.parse(fs.readFileSync(sidebarPath, 'utf8'))));
    return true;
  }

  return false;
}

function syncUpsellContent(source) {
  if (!source || !fs.existsSync(source)) {
    console.log('[sync-content] Revenza Upsell content repo not configured. Using committed fallback app content.');
    return 0;
  }

  const appRoot = existingPath(source, 'overview.md') || existingPath(source, 'Overview.md') || existingPath(source, 'intro.md') || existingPath(source, 'README.md')
    ? source
    : existingPath(source, 'revenza-upsell') || source;
  let copied = 0;

  if (syncUpsellSidebar(appRoot)) copied += 1;

  if (
    fs.existsSync(path.join(appRoot, 'overview.md'))
    || fs.existsSync(path.join(appRoot, 'Overview.md'))
    || fs.existsSync(path.join(appRoot, 'intro.md'))
    || fs.existsSync(path.join(appRoot, 'README.md'))
  ) {
    fs.rmSync(path.join(root, 'docs/intro.mdx'), {force: true});
  }

  for (const entry of fs.readdirSync(appRoot, {withFileTypes: true})) {
    if (ignoredUpsellEntries.has(entry.name)) continue;

    const from = path.join(appRoot, entry.name);
    if (entry.isDirectory()) {
      if (copyGitBookDirectory(from, `docs/${entry.name}`)) copied += 1;
      continue;
    }

    if (!entry.isFile() || !/\.mdx?$/i.test(entry.name)) continue;
    const destination = destinationForTopLevelMarkdown(entry.name);
    if (!destination) continue;
    if (copyMarkdownFile(from, destination)) copied += 1;
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

