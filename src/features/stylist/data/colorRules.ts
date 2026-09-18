export const COLOR_FAMILIES = [
  'black',
  'white',
  'grey',
  'navy',
  'blue',
  'brown',
  'beige',
  'cream',
  'green',
  'olive',
  'red',
  'burgundy',
  'orange',
  'yellow',
  'pink',
  'purple',
] as const;

export type ColorFamily = (typeof COLOR_FAMILIES)[number];

export const NEUTRAL_COLORS = new Set<ColorFamily>([
  'black',
  'white',
  'grey',
  'navy',
  'brown',
  'beige',
  'cream',
]);

export const COLOR_WHEEL: readonly ColorFamily[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
];

const COLOR_ALIASES: Record<string, ColorFamily> = {
  ash: 'grey',
  charcoal: 'grey',
  gray: 'grey',
  ivory: 'cream',
  khaki: 'beige',
  maroon: 'burgundy',
  natural: 'beige',
  'navy blue': 'navy',
  offwhite: 'cream',
  'off-white': 'cream',
  stone: 'beige',
  tan: 'beige',
};

export function normalizeColor(value: string | null | undefined): string | undefined {
  const normalized = normalizeToken(value);
  if (!normalized) return undefined;
  if (normalized in COLOR_ALIASES) return COLOR_ALIASES[normalized];
  return COLOR_FAMILIES.find((color) => normalized === color || normalized.includes(color));
}

export function normalizeToken(value: string | null | undefined): string | undefined {
  const normalized = value
    ?.toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-');
  return normalized || undefined;
}
