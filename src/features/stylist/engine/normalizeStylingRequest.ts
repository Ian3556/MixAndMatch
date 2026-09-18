import { normalizeToken } from '../data/colorRules';
import type { StylingRequest } from '../types';

export function normalizeStylingRequest(request: StylingRequest): StylingRequest {
  const occasion = normalizeToken(request.occasion);
  const weather = normalizeToken(request.weather);
  const season = normalizeToken(request.season);
  const desiredStyle = unique(request.desiredStyle?.map(normalizeToken).filter(isText) ?? []);
  const selectedItems = unique(request.selectedItems?.filter(Boolean) ?? []);
  const excludedItems = unique(request.excludedItems?.filter(Boolean) ?? []);
  const temperature = finite(request.temperature);
  const formality = bounded(request.formality, 0, 10);

  return {
    ...(occasion ? { occasion } : {}),
    ...(desiredStyle.length > 0 ? { desiredStyle } : {}),
    ...(temperature === undefined ? {} : { temperature }),
    ...(weather ? { weather } : {}),
    ...(season ? { season } : {}),
    ...(formality === undefined ? {} : { formality }),
    ...(selectedItems.length > 0 ? { selectedItems } : {}),
    ...(excludedItems.length > 0 ? { excludedItems } : {}),
  };
}

function finite(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function bounded(value: number | undefined, minimum: number, maximum: number): number | undefined {
  const normalized = finite(value);
  return normalized === undefined ? undefined : Math.min(maximum, Math.max(minimum, normalized));
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function isText(value: string | undefined): value is string {
  return Boolean(value);
}
