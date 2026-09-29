import type { WardrobeImportErrorCode } from './types.ts';

export const MAX_IMPORT_URL_LENGTH = 2048;

export type UrlValidationResult =
  { ok: true; url: URL } | { ok: false; code: WardrobeImportErrorCode; message: string };

const HOSTNAME_WITHOUT_PROTOCOL =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?::\d{1,5})?(?:[/?#].*)?$/i;
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata.google',
  'instance-data',
]);

export function validateImportUrl(input: string): UrlValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return failure('INVALID_URL', 'Enter a public product or collection URL.');
  }

  if (trimmed.length > MAX_IMPORT_URL_LENGTH) {
    return failure('INVALID_URL', 'The URL is too long.');
  }

  const candidate = HOSTNAME_WITHOUT_PROTOCOL.test(trimmed) ? `https://${trimmed}` : trimmed;
  let url: URL;

  try {
    url = new URL(candidate);
  } catch {
    return failure('INVALID_URL', 'Enter a valid public website URL.');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return failure('UNSUPPORTED_PROTOCOL', 'Only HTTP and HTTPS website URLs are supported.');
  }

  if (url.username || url.password) {
    return failure('UNSAFE_URL', 'URLs containing usernames or passwords are not allowed.');
  }

  if (!url.hostname || isUnsafeHostname(url.hostname)) {
    return failure('UNSAFE_URL', 'This URL points to a private or local network address.');
  }

  return { ok: true, url };
}

export function isUnsafeHostname(value: string): boolean {
  const hostname = stripIpv6Brackets(value).replace(/\.$/, '').toLowerCase();

  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localhost') ||
    !hostname.includes('.')
  ) {
    return true;
  }

  return isUnsafeIpAddress(hostname);
}

export function isUnsafeIpAddress(value: string): boolean {
  const normalized = stripIpv6Brackets(value).toLowerCase();
  const ipv4 = parseIpv4(normalized);
  if (ipv4) return isUnsafeIpv4(ipv4);

  if (!normalized.includes(':')) return false;
  const ipv6 = parseIpv6(normalized);
  if (!ipv6) return true;

  const mappedIpv4 = readMappedIpv4(ipv6);
  if (mappedIpv4) return isUnsafeIpv4(mappedIpv4);

  // Import targets must use globally routable unicast addresses. This rejects unspecified,
  // loopback, IPv4-compatible, NAT64, ULA, link-local, multicast and other special ranges.
  const globallyRoutableUnicast = (ipv6[0]! & 0xe000) === 0x2000;
  if (!globallyRoutableUnicast) return true;

  // Documentation and ORCHID ranges are not valid public service destinations.
  if (ipv6[0] === 0x2001 && ipv6[1] === 0x0db8) return true;
  if (ipv6[0] === 0x2001 && ((ipv6[1]! & 0xfff0) === 0x0010 || (ipv6[1]! & 0xfff0) === 0x0020)) {
    return true;
  }

  return false;
}

export function isIpAddress(value: string): boolean {
  const normalized = stripIpv6Brackets(value).toLowerCase();
  return parseIpv4(normalized) !== null || parseIpv6(normalized) !== null;
}

function parseIpv4(value: string): number[] | null {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) return null;
  const parts = value.split('.').map(Number);
  return parts.length === 4 && parts.every((part) => part >= 0 && part <= 255) ? parts : null;
}

function isUnsafeIpv4(parts: number[]): boolean {
  const [first = 0, second = 0, third = 0] = parts;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0) ||
    (first === 192 && second === 0 && third === 2) ||
    (first === 192 && second === 88 && third === 99) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && third === 100) ||
    (first === 203 && second === 0 && third === 113) ||
    first >= 224
  );
}

function parseIpv6(value: string): number[] | null {
  if (!/^[0-9a-f:.]+$/.test(value) || (value.match(/::/g)?.length ?? 0) > 1) return null;

  let source = value;
  const dottedSuffix = source.match(/(?:^|:)(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1];
  if (dottedSuffix) {
    const dotted = parseIpv4(dottedSuffix);
    if (!dotted) return null;
    const replacement = `${((dotted[0]! << 8) | dotted[1]!).toString(16)}:${((dotted[2]! << 8) | dotted[3]!).toString(16)}`;
    source = source.slice(0, -dottedSuffix.length) + replacement;
  }

  const [leftSource, rightSource] = source.split('::');
  const left = leftSource ? leftSource.split(':') : [];
  const right = rightSource ? rightSource.split(':') : [];
  if (source.includes('::')) {
    const omitted = 8 - left.length - right.length;
    if (omitted < 1) return null;
    return parseIpv6Groups([...left, ...Array<string>(omitted).fill('0'), ...right]);
  }
  return parseIpv6Groups(left);
}

function parseIpv6Groups(groups: string[]): number[] | null {
  if (groups.length !== 8) return null;
  const parsed = groups.map((group) =>
    /^[0-9a-f]{1,4}$/.test(group) ? Number.parseInt(group, 16) : NaN,
  );
  return parsed.every(Number.isFinite) ? parsed : null;
}

function readMappedIpv4(groups: number[]): number[] | null {
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) {
    return [groups[6]! >> 8, groups[6]! & 0xff, groups[7]! >> 8, groups[7]! & 0xff];
  }
  return null;
}

function stripIpv6Brackets(value: string): string {
  return value.startsWith('[') && value.endsWith(']') ? value.slice(1, -1) : value;
}

function failure(code: WardrobeImportErrorCode, message: string): UrlValidationResult {
  return { ok: false, code, message };
}
