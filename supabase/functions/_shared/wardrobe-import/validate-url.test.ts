import { describe, expect, it } from 'vitest';

import { MAX_IMPORT_URL_LENGTH, isUnsafeIpAddress, validateImportUrl } from './validate-url';

describe('wardrobe import URL validation', () => {
  it.each([
    ['https://shop.example/products/shirt', 'https:'],
    ['http://shop.example/products/shirt', 'http:'],
    ['shop.example/collections/new', 'https:'],
  ])('accepts %s', (input, protocol) => {
    const result = validateImportUrl(input);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.url.protocol).toBe(protocol);
  });

  it.each([
    ['not a url', 'INVALID_URL'],
    ['ftp://shop.example/file', 'UNSUPPORTED_PROTOCOL'],
    ['http://localhost/product', 'UNSAFE_URL'],
    ['http://127.0.0.1/product', 'UNSAFE_URL'],
    ['http://10.1.2.3/product', 'UNSAFE_URL'],
    ['http://[::1]/product', 'UNSAFE_URL'],
    ['http://169.254.169.254/latest/meta-data', 'UNSAFE_URL'],
    ['https://user:pass@shop.example/product', 'UNSAFE_URL'],
    [`https://shop.example/${'a'.repeat(MAX_IMPORT_URL_LENGTH)}`, 'INVALID_URL'],
  ])('rejects unsafe input %s', (input, code) => {
    const result = validateImportUrl(input);
    expect(result).toMatchObject({ ok: false, code });
  });

  it('recognizes private and link-local IP address families used by redirect checks', () => {
    expect(isUnsafeIpAddress('192.168.1.4')).toBe(true);
    expect(isUnsafeIpAddress('172.20.1.4')).toBe(true);
    expect(isUnsafeIpAddress('fe80::1')).toBe(true);
    expect(isUnsafeIpAddress('fd00::1')).toBe(true);
    expect(isUnsafeIpAddress('8.8.8.8')).toBe(false);
    expect(validateImportUrl('http://127.0.0.1/redirect')).toMatchObject({
      ok: false,
      code: 'UNSAFE_URL',
    });
  });
});
