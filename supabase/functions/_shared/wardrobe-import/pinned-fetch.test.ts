import { describe, expect, it, vi } from 'vitest';

import { createPinnedFetch } from './pinned-fetch';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

class FakeConnection {
  private readonly inbound: Uint8Array;
  private offset = 0;
  readonly closeSpy = vi.fn();
  readonly writes: Uint8Array[] = [];

  constructor(
    response: string,
    private readonly readSize = 7,
  ) {
    this.inbound = encoder.encode(response);
  }

  async read(buffer: Uint8Array): Promise<number | null> {
    if (this.offset >= this.inbound.byteLength) return null;
    const count = Math.min(buffer.byteLength, this.readSize, this.inbound.byteLength - this.offset);
    buffer.set(this.inbound.subarray(this.offset, this.offset + count));
    this.offset += count;
    return count;
  }

  async write(buffer: Uint8Array) {
    this.writes.push(buffer.slice());
    return buffer.byteLength;
  }

  close() {
    this.closeSpy();
  }

  requestText() {
    return decoder.decode(concatenate(this.writes));
  }
}

class StallingConnection {
  private readonly head = encoder.encode('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n');
  private headRead = false;
  private closed = false;
  private rejectRead: ((error: Error) => void) | undefined;
  readonly closeSpy = vi.fn();

  async read(buffer: Uint8Array): Promise<number | null> {
    if (!this.headRead) {
      this.headRead = true;
      buffer.set(this.head);
      return this.head.byteLength;
    }
    if (this.closed) throw new Error('connection closed');
    return new Promise<number | null>((_resolve, reject) => {
      this.rejectRead = reject;
    });
  }

  async write(buffer: Uint8Array) {
    return buffer.byteLength;
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.closeSpy();
    this.rejectRead?.(new Error('connection closed'));
  }
}

describe('connection-pinned wardrobe fetch', () => {
  it('connects to a vetted IP while retaining the original Host and TLS name', async () => {
    const tcpConnection = new FakeConnection('');
    const tlsConnection = new FakeConnection(
      'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 2\r\n\r\nok',
    );
    const connect = vi.fn(async () => tcpConnection);
    const startTls = vi.fn(async () => tlsConnection);
    const fetchPinned = createPinnedFetch({ connect, startTls });
    const url = new URL('https://shop.example:8443/products/shirt?color=blue');

    const result = await fetchPinned(url, { method: 'GET' }, ['8.8.8.8']);

    expect(connect).toHaveBeenCalledWith('8.8.8.8', 8443);
    expect(startTls).toHaveBeenCalledWith(tcpConnection, 'shop.example');
    expect(tlsConnection.requestText()).toContain('GET /products/shirt?color=blue HTTP/1.1\r\n');
    expect(tlsConnection.requestText()).toContain('Host: shop.example:8443\r\n');
    expect(tlsConnection.requestText()).toContain('accept-encoding: identity\r\n');
    await expect(result.response.text()).resolves.toBe('ok');
    result.release();
    expect(tlsConnection.closeSpy).toHaveBeenCalledTimes(1);
  });

  it('tries the next vetted address after a connection failure', async () => {
    const secondConnection = new FakeConnection(
      'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 2\r\n\r\nok',
    );
    const connect = vi
      .fn()
      .mockRejectedValueOnce(new Error('unreachable'))
      .mockResolvedValueOnce(secondConnection);
    const fetchPinned = createPinnedFetch({ connect, startTls: vi.fn() });

    const result = await fetchPinned(new URL('http://shop.example/product'), {}, [
      '8.8.8.8',
      '1.1.1.1',
    ]);

    expect(connect).toHaveBeenNthCalledWith(1, '8.8.8.8', 80);
    expect(connect).toHaveBeenNthCalledWith(2, '1.1.1.1', 80);
    await expect(result.response.text()).resolves.toBe('ok');
  });

  it('decodes a chunked HTTP response without buffering the full body', async () => {
    const connection = new FakeConnection(
      'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nTransfer-Encoding: chunked\r\n\r\n' +
        '4\r\nWiki\r\n5\r\npedia\r\n0\r\nX-Trace: complete\r\n\r\n',
      3,
    );
    const fetchPinned = createPinnedFetch({
      connect: vi.fn(async () => connection),
      startTls: vi.fn(),
    });

    const result = await fetchPinned(new URL('http://shop.example/product'), {}, ['8.8.8.8']);

    await expect(result.response.text()).resolves.toBe('Wikipedia');
    expect(connection.closeSpy).toHaveBeenCalledTimes(1);
  });

  it('closes a stalled socket when the shared deadline aborts', async () => {
    const connection = new StallingConnection();
    const controller = new AbortController();
    const fetchPinned = createPinnedFetch({
      connect: vi.fn(async () => connection),
      startTls: vi.fn(),
    });
    const result = await fetchPinned(
      new URL('http://shop.example/product'),
      { signal: controller.signal },
      ['8.8.8.8'],
    );

    const body = result.response.text();
    controller.abort();

    await expect(body).rejects.toThrow('connection closed');
    expect(connection.closeSpy).toHaveBeenCalledTimes(1);
  });

  it('refuses unsafe or non-IP addresses even if a caller bypasses DNS validation', async () => {
    const fetchPinned = createPinnedFetch({ connect: vi.fn(), startTls: vi.fn() });
    await expect(
      fetchPinned(new URL('https://shop.example/product'), {}, ['::ffff:7f00:1']),
    ).rejects.toMatchObject({ code: 'UNSAFE_URL' });
    await expect(
      fetchPinned(new URL('https://shop.example/product'), {}, ['attacker.example']),
    ).rejects.toMatchObject({ code: 'UNSAFE_URL' });
  });
});

function concatenate(chunks: Uint8Array[]) {
  const output = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.byteLength, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}
