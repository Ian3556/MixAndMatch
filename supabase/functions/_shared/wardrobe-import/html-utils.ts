const ENTITY_MAP: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

export function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, key: string) => {
    if (key.startsWith('#')) {
      const hexadecimal = key[1]?.toLowerCase() === 'x';
      const codePoint = Number.parseInt(key.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }

    return ENTITY_MAP[key.toLowerCase()] ?? entity;
  });
}

export function cleanText(value: unknown, maxLength = 500): string | undefined {
  if (typeof value !== 'string') return undefined;
  const clean = decodeHtmlEntities(stripTags(value)).replace(/\s+/g, ' ').trim();
  return clean ? clean.slice(0, maxLength) : undefined;
}

export function stripTags(value: string): string {
  return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ');
}

export function readAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const expression = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match: RegExpExecArray | null;
  while ((match = expression.exec(tag))) {
    const key = match[1]?.toLowerCase();
    const value = match[2] ?? match[3] ?? match[4];
    if (key && value !== undefined) attributes[key] = decodeHtmlEntities(value);
  }
  return attributes;
}

export function getMetaContent(html: string, ...keys: string[]): string | undefined {
  const normalizedKeys = new Set(keys.map((key) => key.toLowerCase()));
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = readAttributes(match[0]);
    const key = (attributes.property ?? attributes.name ?? attributes.itemprop)?.toLowerCase();
    if (key && normalizedKeys.has(key) && attributes.content) return attributes.content;
  }
  return undefined;
}

export function getCanonicalUrl(html: string): string | undefined {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = readAttributes(match[0]);
    if (attributes.rel?.toLowerCase().split(/\s+/).includes('canonical')) return attributes.href;
  }
  return undefined;
}
