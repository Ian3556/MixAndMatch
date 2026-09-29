import { describe, expect, it, vi } from 'vitest';

import { fetchHtmlPage } from './fetch-page';

const publicResolver = vi.fn(async () => ['8.8.8.8']);

function resolvedFetch(fetchImplementation: typeof fetch) {
  return async (url: URL, init: RequestInit, resolvedAddresses: readonly string[]) => ({
    response: await fetchImplementation(url, init),
    release: vi.fn(),
    resolvedAddresses,
  });
}

describe('secure wardrobe page fetch', () => {
  it('accepts a bounded HTML response without forwarding client headers', async () => {
    const fetchMock = vi.fn(
      async (_input: URL | RequestInfo, _init?: RequestInit) =>
        new Response('<html>ok</html>', { headers: { 'content-type': 'text/html' } }),
    );
    const result = await fetchHtmlPage('https://shop.example/product', {
      fetchResolved: resolvedFetch(fetchMock),
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
        fetchResolved: resolvedFetch(fetchMock),
        resolveHostname: publicResolver,
      }),
    ).rejects.toMatchObject({ code: 'UNSAFE_URL' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects hostnames that resolve to private addresses', async () => {
    await expect(
      fetchHtmlPage('https://shop.example/product', {
        fetchResolved: resolvedFetch(vi.fn()),
        resolveHostname: async () => ['10.0.0.2'],
      }),
    ).rejects.toMatchObject({ code: 'UNSAFE_URL' });

    await expect(
      fetchHtmlPage('https://shop.example/product', {
        fetchResolved: resolvedFetch(vi.fn()),
        resolveHostname: async () => ['attacker.example'],
      }),
    ).rejects.toMatchObject({ code: 'UNSAFE_URL' });
  });

  it('rejects non-HTML and oversized responses', async () => {
    await expect(
      fetchHtmlPage('https://shop.example/file', {
        fetchResolved: resolvedFetch(
          async () => new Response('{}', { headers: { 'content-type': 'application/json' } }),
        ),
        resolveHostname: publicResolver,
      }),
    ).rejects.toMatchObject({ code: 'UNSUPPORTED_CONTENT_TYPE' });

    await expect(
      fetchHtmlPage('https://shop.example/huge', {
        fetchResolved: resolvedFetch(
          async () => new Response('too large', { headers: { 'content-type': 'text/html' } }),
        ),
        resolveHostname: publicResolver,
        maxResponseBytes: 3,
      }),
    ).rejects.toMatchObject({ code: 'RESPONSE_TOO_LARGE' });
  });

  it('passes the vetted addresses to the connection-pinned fetcher', async () => {
    const fetchResolved = vi.fn(async () => ({
      response: new Response('<html>ok</html>', { headers: { 'content-type': 'text/html' } }),
      release: vi.fn(),
    }));
    await fetchHtmlPage('https://shop.example/product', {
      fetchResolved,
      resolveHostname: async () => ['8.8.8.8', '2001:4860:4860::8888'],
    });
    expect(fetchResolved).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
      ['8.8.8.8', '2001:4860:4860::8888'],
    );
  });

  it('keeps the deadline active until the response body completes', async () => {
    let bodyCancelled = false;
    const body = new ReadableStream<Uint8Array>({
      cancel() {
        bodyCancelled = true;
      },
    });
    await expect(
      fetchHtmlPage('https://shop.example/slow', {
        fetchResolved: async () => ({
          response: new Response(body, { headers: { 'content-type': 'text/html' } }),
          release: vi.fn(),
        }),
        resolveHostname: async () => ['8.8.8.8'],
        timeoutMs: 20,
      }),
    ).rejects.toMatchObject({ code: 'IMPORT_TIMEOUT' });
    expect(bodyCancelled).toBe(true);
  });
});
