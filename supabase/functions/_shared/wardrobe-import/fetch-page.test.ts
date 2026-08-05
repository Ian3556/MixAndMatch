import { describe, expect, it, vi } from 'vitest';

import { fetchHtmlPage } from './fetch-page';

const publicResolver = vi.fn(async () => ['203.0.113.10']);

describe('secure wardrobe page fetch', () => {
  it('accepts a bounded HTML response without forwarding client headers', async () => {
    const fetchMock = vi.fn(
      async (_input: URL | RequestInfo, _init?: RequestInit) =>
        new Response('<html>ok</html>', { headers: { 'content-type': 'text/html' } }),
    );
    const result = await fetchHtmlPage('https://shop.example/product', {
      fetch: fetchMock,
      resolveHostname: publicResolver,
    });
    expect(result.html).toContain('ok');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ method: 'GET', redirect: 'manual' }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(headers).not.toHaveProperty('cookie');
    expect(headers).not.toHaveProperty('authorization');
  });

  it('rejects an unsafe redirect before fetching it', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/admin' } }),
    );
    await expect(
      fetchHtmlPage('https://shop.example/product', {
        fetch: fetchMock,
        resolveHostname: publicResolver,
      }),
    ).rejects.toMatchObject({ code: 'UNSAFE_URL' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects hostnames that resolve to private addresses', async () => {
    await expect(
      fetchHtmlPage('https://shop.example/product', {
        fetch: vi.fn(),
        resolveHostname: async () => ['10.0.0.2'],
      }),
    ).rejects.toMatchObject({ code: 'UNSAFE_URL' });
  });

  it('rejects non-HTML and oversized responses', async () => {
    await expect(
      fetchHtmlPage('https://shop.example/file', {
        fetch: async () => new Response('{}', { headers: { 'content-type': 'application/json' } }),
        resolveHostname: publicResolver,
      }),
    ).rejects.toMatchObject({ code: 'UNSUPPORTED_CONTENT_TYPE' });

    await expect(
      fetchHtmlPage('https://shop.example/huge', {
        fetch: async () => new Response('too large', { headers: { 'content-type': 'text/html' } }),
        resolveHostname: publicResolver,
        maxResponseBytes: 3,
      }),
    ).rejects.toMatchObject({ code: 'RESPONSE_TOO_LARGE' });
  });
});
