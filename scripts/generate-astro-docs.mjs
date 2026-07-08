import fs from 'node:fs';
import path from 'node:path';
import {sanitizeGitBookMarkdown, sanitizeUpsellOverviewMarkdown} from './content-sync-utils.mjs';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');
const astroRoot = path.join(root, 'src', 'pages', 'revenza-upsell');

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'superpowers') continue;
      files.push(...walk(target));
      continue;
    }
    if (/\.mdx?$/i.test(entry.name)) files.push(target);
  }
  return files;
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function injectLayout(markdown, layoutPath) {
  if (markdown.startsWith('---')) {
    if (/^layout:\s/m.test(markdown)) return markdown;
    return markdown.replace(/^---\r?\n/, '---\nlayout: ' + layoutPath + '\n');
  }

  return ['---', 'layout: ' + layoutPath, '---', '', markdown].join('\n');
}

function createAstroPage(relativeSource, markdown) {
  const normalizedSource = toPosix(relativeSource);
  let relativeDestination = normalizedSource.replace(/\.md$/i, '.mdx');

  if (normalizedSource === 'intro.md') {
    relativeDestination = 'overview.mdx';
  }

  const destination = path.join(astroRoot, relativeDestination);
  const destinationDir = path.dirname(destination);
  const layoutPath = toPosix(path.relative(destinationDir, path.join(root, 'src', 'layouts', 'DocsLayout.astro')));
  const currentDocPath = normalizedSource;
  const sanitized = normalizedSource === 'intro.md'
    ? sanitizeUpsellOverviewMarkdown(markdown, {currentDocPath})
    : sanitizeGitBookMarkdown(markdown, {currentDocPath});
  const withLayout = injectLayout(sanitized, layoutPath);

  fs.mkdirSync(destinationDir, {recursive: true});
  fs.writeFileSync(destination, withLayout);
}

export function generateAstroDocsPages() {
  if (!fs.existsSync(docsRoot)) return 0;

  fs.rmSync(astroRoot, {recursive: true, force: true});
  fs.mkdirSync(astroRoot, {recursive: true});

  const files = walk(docsRoot);
  for (const filePath of files) {
    const relativeSource = toPosix(path.relative(docsRoot, filePath));
    createAstroPage(relativeSource, fs.readFileSync(filePath, 'utf8'));
  }

  fs.writeFileSync(
    path.join(astroRoot, 'index.astro'),
    '---\nreturn Astro.redirect(\'/revenza-upsell/overview\');\n---\n',
  );

  return files.length;
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  const generated = generateAstroDocsPages();
  console.log('[generate-astro-docs] Generated ' + generated + ' Astro docs page(s).');
}
