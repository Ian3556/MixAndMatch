import { displayProductName } from '@/services/wardrobeMetadata';
import type { WardrobeItem } from '@/types/wardrobe';

export function wardrobeDetailPresentation(item: WardrobeItem) {
  const details = [
    ['Material', item.material],
    ['Season', item.season],
    ['Occasion', item.occasion?.replace(/,\s*/g, ' · ')],
    ['Size', item.size],
    ['Pattern', item.pattern],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()));

  return {
    title: displayProductName(item.name, item.primaryColor, item.size),
    category: [item.category, item.subcategory].filter(Boolean).join(' · '),
    color: item.primaryColor,
    price: formatWardrobePrice(item.price, item.currency),
    details,
    description: item.description,
    notes: item.notes,
  };
}

export function formatWardrobePrice(price: number | null, currency: string | null): string | null {
  if (price === null || !currency) return null;
  try {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return null;
  }
}
