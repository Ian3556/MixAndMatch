import { WardrobeImportError, type ResolvedFetch } from './fetch-page.ts';
import { isIpAddress, isUnsafeIpAddress } from './validate-url.ts';

const MAX_RESPONSE_HEADER_BYTES = 64 * 1024;
const MAX_CHUNK_LINE_BYTES = 8 * 1024;
const SOCKET_READ_BYTES = 64 * 1024;

type PinnedConnection = {
  read(buffer: Uint8Array): Promise<number | null>;
  write(buffer: Uint8Array): Promise<number>;
  close(): void;
};

type PinnedFetchDependencies = {
  connect(address: string, port: number): Promise<PinnedConnection>;
  startTls(connection: PinnedConnection, hostname: string): Promise<PinnedConnection>;
};

type DenoNetworkRuntime = {
  connect?: (options: {
    hostname: string;
    port: number;
    transport: 'tcp';
  }) => Promise<PinnedConnection>;
  startTls?: (
    connection: PinnedConnection,
    options: { hostname: string; alpnProtocols: string[] },
  ) => Promise<PinnedConnection>;
};

export function createDenoPinnedFetch(): ResolvedFetch {
  const runtime = Reflect.get(globalThis, 'Deno') as DenoNetworkRuntime | undefined;
  if (typeof runtime?.connect !== 'function' || typeof runtime.startTls !== 'function') {
    return async () => {
      throw new WardrobeImportError(
        'SERVICE_UNAVAILABLE',
        'Secure retailer connections are unavailable in this runtime.',
        503,
      );
    };
  }

  return createPinnedFetch({
    connect(address, port) {
      return runtime.connect!({ hostname: address, port, transport: 'tcp' });
    },
    startTls(connection, hostname) {
      return runtime.startTls!(connection, {
        hostname,
        alpnProtocols: ['http/1.1'],
      });
    },
  });
}

export function createPinnedFetch(dependencies: PinnedFetchDependencies): ResolvedFetch {
  return async (url, init, resolvedAddresses) => {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new WardrobeImportError(
        'UNSUPPORTED_PROTOCOL',
        'Only HTTP and HTTPS URLs are supported.',
      );
    }
    if (init.method && init.method.toUpperCase() !== 'GET') {
      throw new Error('The pinned retailer fetcher only supports GET requests.');
    }

    const port = url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80;
    let lastError: unknown;

    for (const address of resolvedAddresses) {
      if (!isIpAddress(address) || isUnsafeIpAddress(address)) {
        throw new WardrobeImportError(
          'UNSAFE_URL',
          'This URL resolves to a private or local network address.',
          400,
        );
      }
      if (init.signal?.aborted) throw createAbortError();

      let connection: PinnedConnection | undefined;
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        init.signal?.removeEventListener('abort', release);
        closeConnection(connection);
      };

      try {
        const tcpConnection = await waitForConnection(
          dependencies.connect(address, port),
          init.signal,
        );
        connection = tcpConnection;
        if (url.protocol === 'https:') {
          connection = await waitForConnection(
            dependencies.startTls(tcpConnection, url.hostname),
            init.signal,
            tcpConnection,
          );
        }
        init.signal?.addEventListener('abort', release, { once: true });

        await writeRequest(connection, url, init.headers);
        const response = await readResponse(connection, release);
        return { response, release };
      } catch (error) {
        release();
        if (init.signal?.aborted) throw createAbortError();
        if (error instanceof WardrobeImportError) throw error;
        lastError = error;
      }
    }

    throw lastError ?? new Error('No public destination address was available.');
  };
}

async function waitForConnection(
  promise: Promise<PinnedConnection>,
  signal?: AbortSignal | null,
  activeConnection?: PinnedConnection,
): Promise<PinnedConnection> {
  if (!signal) return promise;
  if (signal.aborted) {
    closeConnection(activeConnection);
    void promise.then(closeConnection, () => undefined);
    throw createAbortError();
  }

  return new Promise((resolve, reject) => {
    const abort = () => {
      closeConnection(activeConnection);
      reject(createAbortError());
    };
    signal.addEventListener('abort', abort, { once: true });
    promise.then(
      (connection) => {
        signal.removeEventListener('abort', abort);
        if (signal.aborted) {
          closeConnection(connection);
          reject(createAbortError());
        } else {
          resolve(connection);
        }
      },
      (error: unknown) => {
        signal.removeEventListener('abort', abort);
        reject(signal.aborted ? createAbortError() : error);
      },
    );
  });
}

async function writeRequest(connection: PinnedConnection, url: URL, requestHeaders?: HeadersInit) {
  const headers = new Headers(requestHeaders);
  headers.delete('host');
  headers.delete('connection');
  headers.delete('content-length');
  headers.delete('transfer-encoding');
  headers.set('accept-encoding', 'identity');

  const requestTarget = `${url.pathname || '/'}${url.search}`;
  const lines = [`GET ${requestTarget} HTTP/1.1`, `Host: ${url.host}`, 'Connection: close'];
  headers.forEach((value, name) => lines.push(`${name}: ${value}`));
  const payload = new TextEncoder().encode(`${lines.join('\r\n')}\r\n\r\n`);

  let offset = 0;
  while (offset < payload.byteLength) {
    const written = await connection.write(payload.subarray(offset));
    if (written <= 0) throw new Error('The retailer connection closed while sending the request.');
    offset += written;
  }
}

async function readResponse(connection: PinnedConnection, release: () => void): Promise<Response> {
  const reader = new BufferedConnectionReader(connection);
  let responseHead: { status: number; statusText: string; headers: Headers } | undefined;

  for (let interimCount = 0; interimCount <= 5; interimCount += 1) {
    responseHead = await readResponseHead(reader);
    if (responseHead.status < 100 || responseHead.status >= 200) break;
    if (responseHead.status === 101 || interimCount === 5) {
      throw new Error('The retailer returned an unsupported protocol response.');
    }
  }

  if (!responseHead || responseHead.status < 200 || responseHead.status > 599) {
    throw new Error('The retailer returned an invalid HTTP status.');
  }

  const { status, statusText, headers } = responseHead;
  const contentEncoding = headers.get('content-encoding')?.trim().toLowerCase();
  if (contentEncoding && contentEncoding !== 'identity') {
    throw new WardrobeImportError(
      'IMPORT_FAILED',
      'This retailer returned an unsupported compressed response.',
      422,
    );
  }

  const noBody = status === 204 || status === 205 || status === 304;
  if (noBody) {
    release();
    return new Response(null, { status, statusText, headers });
  }

  const transferEncoding = headers.get('transfer-encoding')?.trim().toLowerCase();
  let body: ReadableStream<Uint8Array>;
  if (transferEncoding) {
    if (transferEncoding !== 'chunked') {
      throw new Error('The retailer returned an unsupported transfer encoding.');
    }
    body = createChunkedBody(reader, release);
  } else {
    const contentLength = readContentLength(headers.get('content-length'));
    if (contentLength === 0) {
      release();
      return new Response(null, { status, statusText, headers });
    }
    body =
      contentLength === undefined
        ? createUntilEofBody(reader, release)
        : createFixedLengthBody(reader, contentLength, release);
  }

  return new Response(body, { status, statusText, headers });
}

async function readResponseHead(reader: BufferedConnectionReader) {
  let totalBytes = 0;
  const statusLine = await reader.readLine(MAX_RESPONSE_HEADER_BYTES);
  totalBytes += statusLine.byteLength + 2;
  const decodedStatus = new TextDecoder().decode(statusLine);
  const statusMatch = decodedStatus.match(/^HTTP\/1\.[01]\s+(\d{3})(?:\s+(.*))?$/);
  if (!statusMatch) throw new Error('The retailer returned an invalid HTTP response.');

  const status = Number(statusMatch[1]);
  const statusText = statusMatch[2] ?? '';
  const headers = new Headers();
  while (true) {
    const remaining = MAX_RESPONSE_HEADER_BYTES - totalBytes;
    if (remaining <= 0) throw new Error('The retailer response headers are too large.');
    const line = await reader.readLine(remaining);
    totalBytes += line.byteLength + 2;
    if (line.byteLength === 0) break;
    const decoded = new TextDecoder().decode(line);
    if (/^[\t ]/.test(decoded)) throw new Error('Folded HTTP headers are not supported.');
    const separator = decoded.indexOf(':');
    if (separator <= 0) throw new Error('The retailer returned an invalid HTTP header.');
    headers.append(decoded.slice(0, separator).trim(), decoded.slice(separator + 1).trim());
  }

  return { status, statusText, headers };
}

function readContentLength(value: string | null): number | undefined {
  if (value === null) return undefined;
  if (!/^\d+$/.test(value)) throw new Error('The retailer returned an invalid content length.');
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed))
    throw new Error('The retailer returned an invalid content length.');
  return parsed;
}

function createUntilEofBody(reader: BufferedConnectionReader, release: () => void) {
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const chunk = await reader.readAtMost(SOCKET_READ_BYTES);
        if (chunk === null) {
          release();
          controller.close();
        } else {
          controller.enqueue(chunk);
        }
      } catch (error) {
        release();
        controller.error(error);
      }
    },
    cancel: release,
  });
}

function createFixedLengthBody(
  reader: BufferedConnectionReader,
  contentLength: number,
  release: () => void,
) {
  let remaining = contentLength;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const chunk = await reader.readAtMost(Math.min(SOCKET_READ_BYTES, remaining));
        if (chunk === null)
          throw new Error('The retailer response ended before its declared length.');
        remaining -= chunk.byteLength;
        controller.enqueue(chunk);
        if (remaining === 0) {
          release();
          controller.close();
        }
      } catch (error) {
        release();
        controller.error(error);
      }
    },
    cancel: release,
  });
}

function createChunkedBody(reader: BufferedConnectionReader, release: () => void) {
  let remainingInChunk = 0;
  let complete = false;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (complete) return;
        if (remainingInChunk === 0) {
          const sizeLine = new TextDecoder().decode(await reader.readLine(MAX_CHUNK_LINE_BYTES));
          const sizeToken = sizeLine.split(';', 1)[0]?.trim() ?? '';
          if (!/^[0-9a-f]+$/i.test(sizeToken)) throw new Error('Invalid chunk size.');
          remainingInChunk = Number.parseInt(sizeToken, 16);
          if (!Number.isSafeInteger(remainingInChunk)) throw new Error('Invalid chunk size.');
          if (remainingInChunk === 0) {
            await readTrailers(reader);
            complete = true;
            release();
            controller.close();
            return;
          }
        }

        const chunk = await reader.readAtMost(Math.min(SOCKET_READ_BYTES, remainingInChunk));
        if (chunk === null) throw new Error('The retailer response ended inside a chunk.');
        remainingInChunk -= chunk.byteLength;
        if (remainingInChunk === 0) {
          const delimiter = await reader.readExactly(2);
          if (delimiter[0] !== 13 || delimiter[1] !== 10)
            throw new Error('Invalid chunk delimiter.');
        }
        controller.enqueue(chunk);
      } catch (error) {
        release();
        controller.error(error);
      }
    },
    cancel: release,
  });
}

async function readTrailers(reader: BufferedConnectionReader) {
  let totalBytes = 0;
  while (true) {
    const remaining = MAX_RESPONSE_HEADER_BYTES - totalBytes;
    if (remaining <= 0) throw new Error('The retailer response trailers are too large.');
    const line = await reader.readLine(remaining);
    totalBytes += line.byteLength + 2;
    if (line.byteLength === 0) return;
  }
}

class BufferedConnectionReader {
  private buffered = new Uint8Array(0);

  constructor(private readonly connection: PinnedConnection) {}

  async readAtMost(maximum: number): Promise<Uint8Array | null> {
    if (maximum <= 0) return new Uint8Array(0);
    if (this.buffered.byteLength > 0) {
      const length = Math.min(maximum, this.buffered.byteLength);
      const output = this.buffered.slice(0, length);
      this.buffered = this.buffered.slice(length);
      return output;
    }

    const buffer = new Uint8Array(Math.min(maximum, SOCKET_READ_BYTES));
    let count: number | null;
    do {
      count = await this.connection.read(buffer);
    } while (count === 0);
    return count === null ? null : buffer.slice(0, count);
  }

  async readExactly(length: number): Promise<Uint8Array> {
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < length) {
      const chunk = await this.readAtMost(length - total);
      if (chunk === null) throw new Error('The retailer response ended unexpectedly.');
      chunks.push(chunk);
      total += chunk.byteLength;
    }
    return concatenate(chunks, total);
  }

  async readLine(maximum: number): Promise<Uint8Array> {
    while (true) {
      const delimiter = findCrlf(this.buffered);
      if (delimiter >= 0) {
        const line = this.buffered.slice(0, delimiter);
        this.buffered = this.buffered.slice(delimiter + 2);
        return line;
      }
      if (this.buffered.byteLength >= maximum)
        throw new Error('The retailer response line is too large.');

      const readBuffer = new Uint8Array(
        Math.min(SOCKET_READ_BYTES, maximum - this.buffered.byteLength),
      );
      const count = await this.connection.read(readBuffer);
      if (count === null) throw new Error('The retailer response ended unexpectedly.');
      this.buffered = concatenate([this.buffered, readBuffer.slice(0, count)]);
    }
  }
}

function findCrlf(value: Uint8Array) {
  for (let index = 0; index < value.byteLength - 1; index += 1) {
    if (value[index] === 13 && value[index + 1] === 10) return index;
  }
  return -1;
}

function concatenate(chunks: Uint8Array[], knownLength?: number) {
  const length = knownLength ?? chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function closeConnection(connection: PinnedConnection | undefined) {
  try {
    connection?.close();
  } catch {
    // Closing an already-consumed or already-closed Deno connection is harmless here.
  }
}

function createAbortError(): DOMException {
  return new DOMException('The operation was aborted.', 'AbortError');
}
