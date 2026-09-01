export class CatalogRestError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body: unknown,
  ) {
    super(message);
    this.name = 'CatalogRestError';
  }
}

export class CatalogRestClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  select<T>(resource: string, query: string): Promise<T[]> {
    return this.request<T[]>(`${resource}?${query}`, { method: 'GET' });
  }

  insert<T>(resource: string, payload: unknown, prefer = 'return=representation'): Promise<T[]> {
    return this.request<T[]>(resource, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { Prefer: prefer },
    });
  }

  upsert<T>(resource: string, onConflict: string, payload: unknown): Promise<T[]> {
    return this.request<T[]>(`${resource}?on_conflict=${encodeURIComponent(onConflict)}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
    });
  }

  update<T>(resource: string, query: string, payload: unknown): Promise<T[]> {
    return this.request<T[]>(`${resource}?${query}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: { Prefer: 'return=representation' },
    });
  }

  delete(resource: string, query: string): Promise<void> {
    return this.request<void>(`${resource}?${query}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: this.apiKey,
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
    const text = await response.text();
    const body = text ? safeJson(text) : null;
    if (!response.ok) {
      throw new CatalogRestError(
        response.status,
        readMessage(body) || `Catalogue database request failed (${response.status}).`,
        body,
      );
    }
    return body as T;
  }
}

function safeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function readMessage(value: unknown): string {
  if (typeof value !== 'object' || value === null) return '';
  const message = Reflect.get(value, 'message');
  return typeof message === 'string' ? message : '';
}
