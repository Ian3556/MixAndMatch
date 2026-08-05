import type { WardrobeImportErrorCode } from './types';

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

  if (normalized === '::' || normalized === '::1') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;

  const firstGroup = Number.parseInt(normalized.split(':')[0] || '0', 16);
  if (Number.isFinite(firstGroup) && firstGroup >= 0xfe80 && firstGroup <= 0xfebf) return true;

  const mappedIpv4 = normalized.match(/(?:^|:)(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1];
  return mappedIpv4 ? isUnsafeIpAddress(mappedIpv4) : false;
}

function parseIpv4(value: string): number[] | null {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) return null;
  const parts = value.split('.').map(Number);
  return parts.length === 4 && parts.every((part) => part >= 0 && part <= 255) ? parts : null;
}

function isUnsafeIpv4(parts: number[]): boolean {
  const [first = 0, second = 0] = parts;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    first >= 224
  );
}

function stripIpv6Brackets(value: string): string {
  return value.startsWith('[') && value.endsWith(']') ? value.slice(1, -1) : value;
}

function failure(code: WardrobeImportErrorCode, message: string): UrlValidationResult {
  return { ok: false, code, message };
}
