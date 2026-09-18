import { DEFAULT_MAX_CANDIDATES } from '../data/stylingWeights';
import type {
  ClothingCategory,
  ClothingItem,
  Outfit,
  StyleProfile,
  StylingRequest,
} from '../types';
import { getOutfitItems, getOutfitSignature } from '../types';

export type CandidateGeneratorOptions = {
  wardrobe: readonly ClothingItem[];
  request: StylingRequest;
  styleProfile: StyleProfile;
  maxCandidates?: number;
  maxItemsPerCategory?: number;
};

const EMPTY_BREAKDOWN = {
  style: 0,
  color: 0,
  occasion: 0,
  silhouette: 0,
  weather: 0,
  preference: 0,
  rotation: 0,
  novelty: 0,
} as const;

export function generateOutfitCandidates({
  wardrobe,
  request,
  styleProfile,
  maxCandidates = DEFAULT_MAX_CANDIDATES,
  maxItemsPerCategory = 14,
}: CandidateGeneratorOptions): Outfit[] {
  if (maxCandidates <= 0) return [];
  const excluded = new Set([
    ...(request.excludedItems ?? []),
    ...(styleProfile.dislikedItems ?? []),
  ]);
  const dislikedCategories = new Set(styleProfile.dislikedCategories ?? []);
  const selected = new Set(request.selectedItems ?? []);
  const relevant = wardrobe.filter(
    (item) =>
      !excluded.has(item.id) &&
      !dislikedCategories.has(item.category) &&
      (item.category !== 'other' || selected.has(item.id)),
  );

  if ([...selected].some((itemId) => !relevant.some((item) => item.id === itemId))) return [];

  const grouped = groupItems(relevant, selected, request, maxItemsPerCategory);
  const selectedByCategory = groupSelected(grouped, selected);
  if (
    selectedByCategory.top.length > 1 ||
    selectedByCategory.bottom.length > 1 ||
    selectedByCategory.dress.length > 1 ||
    selectedByCategory.shoes.length > 1 ||
    selectedByCategory.outerwear.length > 1 ||
    selectedByCategory.other.length > 0 ||
    (selectedByCategory.dress.length > 0 &&
      (selectedByCategory.top.length > 0 || selectedByCategory.bottom.length > 0))
  ) {
    return [];
  }

  const tops = selectedByCategory.top.length > 0 ? selectedByCategory.top : grouped.top;
  const bottoms = selectedByCategory.bottom.length > 0 ? selectedByCategory.bottom : grouped.bottom;
  const dresses = selectedByCategory.dress.length > 0 ? selectedByCategory.dress : grouped.dress;
  const shoes = selectedByCategory.shoes.length > 0 ? selectedByCategory.shoes : grouped.shoes;
  const outerwear =
    selectedByCategory.outerwear.length > 0 ? selectedByCategory.outerwear : grouped.outerwear;
  const accessories =
    selectedByCategory.accessory.length > 0 ? selectedByCategory.accessory : grouped.accessory;

  const cores: Pick<Outfit, 'top' | 'bottom' | 'dress'>[] = [];
  for (const dress of dresses) cores.push({ dress });
  for (const top of tops) {
    for (const bottom of bottoms) cores.push({ top, bottom });
  }

  const candidates: Outfit[] = [];
  const signatures = new Set<string>();
  for (
    let coreIndex = 0;
    coreIndex < cores.length && candidates.length < maxCandidates;
    coreIndex += 1
  ) {
    const core = cores[coreIndex];
    if (!core) continue;
    const shoeOptions =
      shoes.length > 0 ? takeRotating(shoes, coreIndex, Math.min(2, shoes.length)) : [undefined];
    const variations = buildVariations(outerwear, accessories, selectedByCategory, coreIndex);

    for (const shoe of shoeOptions) {
      for (const variation of variations) {
        const outfit = createOutfit(core, shoe, variation.outerwear, variation.accessories);
        const itemIds = new Set(getOutfitItems(outfit).map((item) => item.id));
        if ([...selected].some((itemId) => !itemIds.has(itemId))) continue;
        const signature = getOutfitSignature(outfit);
        if (signatures.has(signature)) continue;
        signatures.add(signature);
        candidates.push(outfit);
        if (candidates.length >= maxCandidates) break;
      }
      if (candidates.length >= maxCandidates) break;
    }
  }
  return candidates;
}

function groupItems(
  items: readonly ClothingItem[],
  selected: ReadonlySet<string>,
  request: StylingRequest,
  maximum: number,
): Record<ClothingCategory, ClothingItem[]> {
  const grouped: Record<ClothingCategory, ClothingItem[]> = {
    top: [],
    bottom: [],
    shoes: [],
    outerwear: [],
    accessory: [],
    dress: [],
    other: [],
  };
  for (const item of items) grouped[item.category].push(item);
  for (const category of Object.keys(grouped) as ClothingCategory[]) {
    grouped[category] = grouped[category]
      .sort(
        (left, right) =>
          candidatePriority(right, selected, request) -
            candidatePriority(left, selected, request) || left.id.localeCompare(right.id),
      )
      .slice(0, maximum);
  }
  return grouped;
}

function groupSelected(
  grouped: Record<ClothingCategory, ClothingItem[]>,
  selected: ReadonlySet<string>,
): Record<ClothingCategory, ClothingItem[]> {
  return Object.fromEntries(
    (Object.keys(grouped) as ClothingCategory[]).map((category) => [
      category,
      grouped[category].filter((item) => selected.has(item.id)),
    ]),
  ) as Record<ClothingCategory, ClothingItem[]>;
}

function candidatePriority(
  item: ClothingItem,
  selected: ReadonlySet<string>,
  request: StylingRequest,
): number {
  let score = selected.has(item.id) ? 100 : 0;
  if (request.occasion && item.occasions?.includes(request.occasion)) score += 20;
  if (request.desiredStyle?.some((style) => item.styles?.includes(style))) score += 15;
  if (request.season && item.seasons?.includes(request.season)) score += 10;
  return score;
}

function buildVariations(
  outerwear: readonly ClothingItem[],
  accessories: readonly ClothingItem[],
  selected: Record<ClothingCategory, ClothingItem[]>,
  index: number,
): { outerwear?: ClothingItem; accessories?: ClothingItem[] }[] {
  const selectedOuterwear = selected.outerwear[0];
  const selectedAccessories = selected.accessory;
  if (selectedOuterwear || selectedAccessories.length > 0) {
    return [
      {
        ...(selectedOuterwear ? { outerwear: selectedOuterwear } : {}),
        ...(selectedAccessories.length > 0 ? { accessories: selectedAccessories.slice(0, 2) } : {}),
      },
    ];
  }

  const outer = outerwear.length > 0 ? outerwear[index % outerwear.length] : undefined;
  const accessory = accessories.length > 0 ? accessories[index % accessories.length] : undefined;
  return [
    {},
    ...(outer ? [{ outerwear: outer }] : []),
    ...(accessory ? [{ accessories: [accessory] }] : []),
    ...(outer && accessory ? [{ outerwear: outer, accessories: [accessory] }] : []),
  ];
}

function takeRotating<T>(values: readonly T[], start: number, count: number): (T | undefined)[] {
  const result: T[] = [];
  for (let offset = 0; offset < count; offset += 1) {
    const value = values[(start + offset) % values.length];
    if (value !== undefined) result.push(value);
  }
  return result;
}

function createOutfit(
  core: Pick<Outfit, 'top' | 'bottom' | 'dress'>,
  shoes: ClothingItem | undefined,
  outerwear: ClothingItem | undefined,
  accessories: ClothingItem[] | undefined,
): Outfit {
  const parts = [
    core.top,
    core.bottom,
    core.dress,
    shoes,
    outerwear,
    ...(accessories ?? []),
  ].filter((item): item is ClothingItem => Boolean(item));
  return {
    id: `outfit-${stableHash(
      parts
        .map((item) => item.id)
        .sort()
        .join('|'),
    )}`,
    ...core,
    ...(shoes ? { shoes } : {}),
    ...(outerwear ? { outerwear } : {}),
    ...(accessories && accessories.length > 0 ? { accessories } : {}),
    score: 0,
    scoreBreakdown: { ...EMPTY_BREAKDOWN },
  };
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
