type RawDocItem =
  | string
  | {
      type?: 'doc' | 'category';
      id?: string;
      label?: string;
      collapsed?: boolean;
      link?: {type?: 'doc'; id?: string; label?: string};
      items?: RawDocItem[];
    };

export type DocsSection = 'home' | 'upsell';

export type DocsNode = {
  label: string;
  href: string;
  items: DocsNode[];
  collapsed?: boolean;
};

export type DocsLink = {
  label: string;
  href: string;
  parents: Array<{label: string; href: string}>;
};

function humanize(value: string) {
  return value
    .split('/')
    .pop()
    ?.replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? value;
}

export function docIdToHref(id = '', section: DocsSection = 'upsell') {
  const normalized = id.replace(/^\/+|\/+$/g, '');
  const isOverview = !normalized || normalized === 'intro' || normalized === 'overview' || normalized === 'readme';

  if (section === 'home') {
    return isOverview ? '/' : '/' + normalized;
  }

  return isOverview ? '/revenza-upsell/overview' : '/revenza-upsell/' + normalized;
}

function mapRawItem(item: RawDocItem, section: DocsSection): DocsNode {
  if (typeof item === 'string') {
    return {label: humanize(item), href: docIdToHref(item, section), items: []};
  }

  if (item.type === 'category') {
    const href = item.link?.id ? docIdToHref(item.link.id, section) : docIdToHref(item.id || '', section);
    return {
      label: item.label || humanize(item.id || 'section'),
      href,
      items: (item.items || []).map((child) => mapRawItem(child, section)),
      collapsed: item.collapsed,
    };
  }

  const id = item.id || item.link?.id || '';
  return {
    label: item.label || humanize(id),
    href: docIdToHref(id, section),
    items: [],
  };
}

export function normalizeSidebar(rawSidebar: RawDocItem[] = [], section: DocsSection = 'upsell') {
  return rawSidebar.map((item) => mapRawItem(item, section));
}

export function normalizePathname(pathname = '/') {
  if (!pathname) return '/';
  return pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
}

function findTrailInternal(nodes: DocsNode[], pathname: string, trail: DocsLink['parents'] = []): DocsLink | undefined {
  for (const node of nodes) {
    const currentTrail = [...trail, {label: node.label, href: node.href}];
    if (normalizePathname(node.href) === pathname) {
      return {label: node.label, href: node.href, parents: trail};
    }

    const childMatch = findTrailInternal(node.items, pathname, currentTrail);
    if (childMatch) return childMatch;
  }

  return undefined;
}

export function findCurrentLink(nodes: DocsNode[], pathname: string) {
  return findTrailInternal(nodes, normalizePathname(pathname));
}

function flattenInternal(nodes: DocsNode[], trail: DocsLink['parents'] = []) {
  return nodes.flatMap((node) => {
    const entry: DocsLink = {label: node.label, href: node.href, parents: trail};
    const nextTrail = [...trail, {label: node.label, href: node.href}];
    return [entry, ...flattenInternal(node.items, nextTrail)];
  });
}

export function flattenSidebar(nodes: DocsNode[]) {
  const flat = flattenInternal(nodes);
  const seen = new Set<string>();
  return flat.filter((item) => {
    const key = normalizePathname(item.href);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function findPrevNext(nodes: DocsNode[], pathname: string) {
  const flat = flattenSidebar(nodes);
  const normalized = normalizePathname(pathname);
  const index = flat.findIndex((item) => normalizePathname(item.href) === normalized);
  if (index === -1) return {previous: undefined, next: undefined};
  return {
    previous: index > 0 ? flat[index - 1] : undefined,
    next: index < flat.length - 1 ? flat[index + 1] : undefined,
  };
}

export function isNodeActive(node: DocsNode, pathname: string) {
  const normalizedPath = normalizePathname(pathname);
  const normalizedHref = normalizePathname(node.href);
  return normalizedPath === normalizedHref || normalizedPath.startsWith(normalizedHref + '/');
}
