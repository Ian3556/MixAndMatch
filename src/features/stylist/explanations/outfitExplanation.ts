import { describeColorRelationship } from '../engine/colorEngine';
import type { Outfit, StyleProfile, StylingRequest } from '../types';
import { getOutfitItems } from '../types';

export function explainOutfit(
  outfit: Outfit,
  request: StylingRequest,
  profile: StyleProfile,
): string {
  const items = getOutfitItems(outfit);
  const sentences: string[] = [];
  const colors = Array.from(
    new Set(
      items.map((item) => item.primaryColor).filter((color): color is string => Boolean(color)),
    ),
  );
  if (colors.length >= 2 && outfit.scoreBreakdown.color >= 72) {
    const relationship = describeColorRelationship(outfit);
    sentences.push(
      `The ${formatList(colors.slice(0, 3))} palette creates a ${colorDescription(relationship)} combination.`,
    );
  }

  const desiredStyles = request.desiredStyle ?? [];
  const matchedStyle = desiredStyles.find((style) =>
    items.some((item) => item.styles?.includes(style)),
  );
  if (matchedStyle && outfit.scoreBreakdown.style >= 70) {
    sentences.push(
      `The look includes ${displayToken(matchedStyle)} signals requested in the brief.`,
    );
  } else {
    const profileStyle = profile.preferredStyles.find((style) =>
      items.some((item) => item.styles?.includes(style)),
    );
    if (profileStyle && outfit.scoreBreakdown.preference >= 65) {
      sentences.push(
        `The combination reflects your preference for ${displayToken(profileStyle)} styling.`,
      );
    }
  }

  if (request.occasion && outfit.scoreBreakdown.occasion >= 70) {
    sentences.push(
      `Its known occasion and formality signals suit ${displayToken(request.occasion)}.`,
    );
  } else if (
    (request.temperature !== undefined || request.weather) &&
    outfit.scoreBreakdown.weather >= 70
  ) {
    const context =
      request.temperature === undefined ? request.weather : `${request.temperature}°C`;
    sentences.push(`The available warmth and season metadata is compatible with ${context}.`);
  }

  if (sentences.length === 0) {
    const names = items.slice(0, 3).map((item) => item.name);
    sentences.push(
      `This look combines ${formatList(names)} using the wardrobe metadata currently available.`,
    );
  }
  return sentences.slice(0, 3).join(' ');
}

function colorDescription(relationship: ReturnType<typeof describeColorRelationship>): string {
  if (relationship === 'monochromatic') return 'cohesive tonal';
  if (relationship === 'neutral') return 'versatile neutral';
  if (relationship === 'analogous') return 'soft analogous';
  if (relationship === 'complementary') return 'controlled complementary';
  return 'balanced';
}

function formatList(values: readonly string[]): string {
  const displayed = values.map(displayToken);
  if (displayed.length <= 1) return displayed[0] ?? 'available pieces';
  if (displayed.length === 2) return `${displayed[0]} and ${displayed[1]}`;
  return `${displayed.slice(0, -1).join(', ')}, and ${displayed.at(-1)}`;
}

function displayToken(value: string): string {
  return value.replace(/-/g, ' ');
}
