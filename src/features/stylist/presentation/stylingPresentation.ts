import type { ClothingItem, StylingRecommendation } from '../types';
import { getOutfitItems } from '../types';

export function getRecommendationTitle(recommendation: StylingRecommendation): string {
  const items = getOutfitItems(recommendation.outfit);
  const style = items.flatMap((item) => item.styles ?? [])[0];
  return style?.replace(/-/g, ' ') ?? items[0]?.name ?? 'Wardrobe look';
}

export function buildStylingInstructions(items: readonly ClothingItem[]): string[] {
  const top = items.find((item) => item.category === 'top');
  const bottom = items.find((item) => item.category === 'bottom');
  const dress = items.find((item) => item.category === 'dress');
  const outerwear = items.find((item) => item.category === 'outerwear');
  const shoes = items.find((item) => item.category === 'shoes');
  const accessory = items.find((item) => item.category === 'accessory');
  const instructions: string[] = [];

  if (top && bottom) {
    instructions.push(
      `Use a clean front tuck on ${top.name} to sharpen the line into ${bottom.name}.`,
    );
  } else if (dress) {
    instructions.push(
      `Let ${dress.name} set the silhouette; keep the remaining layers restrained.`,
    );
  }

  if (outerwear) {
    const base = top ?? dress;
    instructions.push(
      base
        ? `Layer ${outerwear.name} over ${base.name} and keep the front open for a longer line.`
        : `Wear ${outerwear.name} open so the outfit keeps a clean vertical line.`,
    );
  } else if (top && supportsSleeveRoll(top)) {
    instructions.push(`Roll the sleeves of ${top.name} once or twice for a lighter finish.`);
  }

  if (shoes) {
    instructions.push(`Finish with ${shoes.name}; the shoe pairing anchors the full look.`);
  } else if (accessory) {
    instructions.push(`Keep ${accessory.name} as the single focal accessory.`);
  }

  if (accessory && shoes && instructions.length < 3) {
    instructions.push(
      `Use ${accessory.name} as the final accent rather than adding another statement piece.`,
    );
  }

  return instructions.slice(0, 3);
}

function supportsSleeveRoll(item: ClothingItem): boolean {
  const description = `${item.name} ${item.subcategory ?? ''}`.toLowerCase();
  return ['shirt', 'blouse', 'overshirt', 'button'].some((term) => description.includes(term));
}
