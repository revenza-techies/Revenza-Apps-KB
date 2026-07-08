import fs from 'node:fs';
import path from 'node:path';
import {
  copyDirectory,
  createSidebarFromSummaryMarkdown,
  createSidebarModule,
  sanitizeHomeMarkdown,
  sanitizeGitBookMarkdown,
  sanitizeUpsellOverviewMarkdown,
} from './content-sync-utils.mjs';

const root = process.cwd();
const legacySource = resolveOptionalPath(process.env.CONTENT_REPO_PATH || process.argv[2]);
const homeSource = resolveOptionalPath(process.env.HOME_CONTENT_REPO_PATH) || legacySource || path.resolve(root, '../revenza-home');
const upsellSource = resolveOptionalPath(process.env.REVENZA_UPSELL_CONTENT_REPO_PATH) || legacySource || path.resolve(root, '../revenza-upsell');

function resolveOptionalPath(value) {
  return value ? path.resolve(root, value) : undefined;
}

function writeText(relativeDestination, content) {
  const target = path.join(root, relativeDestination);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, content);
}

function writeJson(relativeDestination, value) {
  writeText(relativeDestination, JSON.stringify(value, null, 2) + '\n');
}

function emptyDirectory(relativeDestination) {
  const target = path.join(root, relativeDestination);
  fs.rmSync(target, {recursive: true, force: true});
  fs.mkdirSync(target, {recursive: true});
}

function existingPath(...segments) {
  const candidate = path.join(...segments);
  return fs.existsSync(candidate) ? candidate : undefined;
}

function copyMarkdownFile(sourceFile, destinationFile, sanitize, options = {}) {
  if (!fs.existsSync(sourceFile)) return false;
  const target = path.join(root, destinationFile);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  const raw = fs.readFileSync(sourceFile, 'utf8');
  fs.writeFileSync(target, sanitize(raw, options));
  return true;
}

function copyMarkdownTree(sourceDir, relativeDestination, options = {}) {
  if (!fs.existsSync(sourceDir)) return 0;
  let copied = 0;

  const walk = (currentSource, currentRelative = '') => {
    for (const entry of fs.readdirSync(currentSource, {withFileTypes: true})) {
      if (options.ignoredEntries?.has(entry.name)) continue;

      const sourcePath = path.join(currentSource, entry.name);
      const relativePath = currentRelative ? `${currentRelative}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        walk(sourcePath, relativePath);
        continue;
      }

      if (!entry.isFile() || !/\.mdx?$/i.test(entry.name)) continue;

      if (options.skip?.(relativePath)) continue;

      const outputName = entry.name.replace(/\.mdx?$/i, '.mdx');
      const destinationPath = path.posix.join(relativeDestination, currentRelative, outputName);
      const currentDocPath = relativePath.replace(/\\/g, '/');
      const sanitizer = options.pickSanitizer?.(relativePath) || options.defaultSanitizer || sanitizeGitBookMarkdown;
      const extraOptions = options.buildOptions?.(relativePath) || {};

      copyMarkdownFile(sourcePath, destinationPath, sanitizer, {
        ...extraOptions,
        currentDocPath,
      });
      copied += 1;
    }
  };

  walk(sourceDir);
  return copied;
}

function syncHomeContent(source) {
  if (!source || !fs.existsSync(source)) {
    console.log('[sync-content] Home content repo not found. Keeping committed fallback home docs.');
    return 0;
  }

  emptyDirectory('docs/revenza-home');
  let copied = 0;

  const homeSummary = existingPath(source, 'SUMMARY.md');
  if (homeSummary) {
    writeText('src/data/homeSidebar.json', createSidebarFromSummaryMarkdown(fs.readFileSync(homeSummary, 'utf8'), 'homeSidebar'));
    copied += 1;
  } else {
    writeText(
      'src/data/homeSidebar.json',
      createSidebarModule([{type: 'doc', id: 'intro', label: 'Revenza Apps'}], 'homeSidebar'),
    );
    copied += 1;
  }

  const appsPath = existingPath(source, 'apps.json');
  if (appsPath) {
    writeJson('src/data/apps.json', JSON.parse(fs.readFileSync(appsPath, 'utf8')));
    copied += 1;
  }

  copied += copyMarkdownTree(source, 'docs/revenza-home', {
    ignoredEntries: new Set(['.git', '.github', '.gitbook', 'apps.json', 'SUMMARY.md', 'changelog', 'images']),
    defaultSanitizer: sanitizeHomeMarkdown,
  });

  if (copyDirectory(path.join(source, '.gitbook', 'assets'), path.join(root, 'static/img/content/revenza-home/assets'))) {
    copied += 1;
  }
  if (copyDirectory(path.join(source, 'images'), path.join(root, 'static/img/content/revenza-home'))) {
    copied += 1;
  }

  return copied;
}

function findUpsellOverviewSource(source) {
  return existingPath(source, 'README.md')
    || existingPath(source, 'readme.md')
    || existingPath(source, 'overview.md')
    || existingPath(source, 'Overview.md')
    || existingPath(source, 'intro.md');
}

function syncUpsellContent(source) {
  if (!source || !fs.existsSync(source)) {
    console.log('[sync-content] Revenza Upsell content repo not found. Keeping committed fallback upsell docs.');
    return 0;
  }

  emptyDirectory('docs/revenza-upsell');
  let copied = 0;

  const summaryPath = existingPath(source, 'SUMMARY.md');
  if (summaryPath) {
    writeText('src/data/upsellSidebar.json', createSidebarFromSummaryMarkdown(fs.readFileSync(summaryPath, 'utf8'), 'upsellSidebar'));
    copied += 1;
  } else {
    const sidebarPath = existingPath(source, 'sidebar.json');
    if (sidebarPath) {
      writeText('src/data/upsellSidebar.json', fs.readFileSync(sidebarPath, 'utf8'));
      copied += 1;
    }
  }

  const overviewSource = findUpsellOverviewSource(source);
  const popularGuidesSource = overviewSource ? fs.readFileSync(overviewSource, 'utf8') : undefined;
  if (overviewSource) {
    copyMarkdownFile(overviewSource, 'docs/revenza-upsell/overview.mdx', sanitizeUpsellOverviewMarkdown, {
      currentDocPath: 'README.md',
      popularGuidesSource,
    });
    copied += 1;
  }

  copied += copyMarkdownTree(source, 'docs/revenza-upsell', {
    ignoredEntries: new Set(['.git', '.github', '.gitbook', 'SUMMARY.md', 'sidebar.json', 'images']),
    skip(relativePath) {
      const lower = relativePath.toLowerCase();
      return lower === 'readme.md' || lower === 'overview.md' || lower === 'intro.md';
    },
    defaultSanitizer(markdown, options) {
      return sanitizeGitBookMarkdown(markdown, {
        ...options,
        routeBase: '/revenza-upsell',
        assetBase: '/img/content/revenza-upsell/assets',
      });
    },
  });

  if (copyDirectory(path.join(source, '.gitbook', 'assets'), path.join(root, 'static/img/content/revenza-upsell/assets'))) {
    copied += 1;
  }
  if (copyDirectory(path.join(source, 'images'), path.join(root, 'static/img/content/revenza-upsell'))) {
    copied += 1;
  }

  return copied;
}

const homeCopied = syncHomeContent(homeSource);
const upsellCopied = syncUpsellContent(upsellSource);

console.log('[sync-content] Synced ' + homeCopied + ' home content group(s) from ' + homeSource + '.');
console.log('[sync-content] Synced ' + upsellCopied + ' Revenza Upsell content group(s) from ' + upsellSource + '.');
