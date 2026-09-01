import { deduplicateCatalogProducts } from './deduplicate';
import { enrichCatalogProduct } from './enrich';
import { normalizeCatalogProduct } from './normalize';
import type {
  CatalogPipelineBatch,
  CatalogPipelineContext,
  RawCatalogProductCandidate,
} from './types';
import { validateCatalogProduct } from './validate';

export function processCatalogCandidates(
  candidates: RawCatalogProductCandidate[],
  context: CatalogPipelineContext,
): CatalogPipelineBatch {
  const processed = candidates.map((candidate, sourceCandidateIndex) => {
    const enriched = enrichCatalogProduct(normalizeCatalogProduct(candidate, context));
    return {
      ...enriched,
      sourceCandidateIndex,
      validation: validateCatalogProduct(enriched, context),
    };
  });
  return deduplicateCatalogProducts(processed);
}
