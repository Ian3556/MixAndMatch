import { WardrobeImportError } from './fetch-page.ts';
import { isUnsafeIpAddress } from './validate-url.ts';

export async function resolvePublicDns(hostname: string): Promise<string[]> {
  const unwrapped = hostname.replace(/^\[|\]$/g, '');
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(unwrapped) || unwrapped.includes(':')) return [unwrapped];

  const responses = await Promise.all(
    ['A', 'AAAA'].map(async (type) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      try {
        const response = await fetch(
          `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=${type}`,
          {
            headers: { Accept: 'application/dns-json' },
            signal: controller.signal,
          },
        );
        if (!response.ok) return [];
        const body = (await response.json()) as { Answer?: { type?: number; data?: string }[] };
        return (body.Answer ?? [])
          .filter((answer) => answer.type === 1 || answer.type === 28)
          .map((answer) => answer.data)
          .filter((address): address is string => Boolean(address));
      } finally {
        clearTimeout(timeout);
      }
    }),
  );
  const addresses = responses.flat();
  if (addresses.some(isUnsafeIpAddress)) {
    throw new WardrobeImportError(
      'UNSAFE_URL',
      'This URL resolves to a private or local network address.',
      400,
    );
  }
  return addresses;
}
