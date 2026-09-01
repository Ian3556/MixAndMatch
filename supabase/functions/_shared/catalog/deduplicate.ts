import type { CatalogDuplicate, CatalogPipelineProduct } from './types';

export function deduplicateCatalogProducts(products: CatalogPipelineProduct[]): {
  products: CatalogPipelineProduct[];
  duplicates: CatalogDuplicate[];
} {
  const accepted: { originalIndex: number; product: CatalogPipelineProduct }[] = [];
  const duplicates: CatalogDuplicate[] = [];

  products.forEach((product, candidateIndex) => {
    const duplicate = accepted.find((candidate) => productsMatch(candidate.product, product));
    if (duplicate) {
      duplicates.push({
        candidateIndex,
        duplicateOfIndex: duplicate.originalIndex,
        deduplicationKey: product.deduplicationKey,
      });
      return;
    }
    accepted.push({ originalIndex: candidateIndex, product });
  });

  return { products: accepted.map((candidate) => candidate.product), duplicates };
}

export function productsMatch(
  left: CatalogPipelineProduct,
  right: CatalogPipelineProduct,
): boolean {
  if (left.brandSlug !== right.brandSlug) return false;
  if (left.deduplicationKey === right.deduplicationKey) return true;

  const colorsMatch = (left.colorFamily ?? 'unknown') === (right.colorFamily ?? 'unknown');
  if (!colorsMatch) return false;

  if (left.externalSku && right.externalSku) {
    return normalizeIdentity(left.externalSku) === normalizeIdentity(right.externalSku);
  }
  if (left.externalProductId && right.externalProductId) {
    return normalizeIdentity(left.externalProductId) === normalizeIdentity(right.externalProductId);
  }
  if (left.canonicalUrl && right.canonicalUrl) {
    return left.canonicalUrl.toLowerCase() === right.canonicalUrl.toLowerCase();
  }
  return normalizeIdentity(left.name) === normalizeIdentity(right.name);
}

function normalizeIdentity(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
