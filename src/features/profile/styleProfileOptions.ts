export const preferredStyleOptions = [
  'Old Money',
  'Streetwear',
  'Minimalist',
  'Smart Casual',
  'City Boy',
  'Vintage',
  'Formal',
  'Quiet Luxury',
] as const;

export const faceShapeOptions = ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond'] as const;

export const bodyTypeOptions = [
  'Rectangle',
  'Triangle',
  'Inverted Triangle',
  'Hourglass',
  'Oval',
] as const;

export const skinToneOptions = ['Fair', 'Light', 'Medium', 'Tan', 'Deep'] as const;

export const undertoneOptions = ['Cool', 'Neutral', 'Warm', 'Olive'] as const;

export const occasionOptions = [
  'Everyday',
  'University',
  'Work',
  'Formal',
  'Dinner',
  'Date',
  'Travel',
  'Party',
  'Events',
] as const;

export const fitOptions = [
  'Slim',
  'Regular',
  'Relaxed',
  'Oversized',
  'Tailored',
  'Cropped',
  'High-Waisted',
  'Loose',
] as const;

export const colorOptions = [
  { name: 'Black', hex: '#171714' },
  { name: 'White', hex: '#F7F7F3' },
  { name: 'Cream', hex: '#EFE6D2' },
  { name: 'Beige', hex: '#C9B89B' },
  { name: 'Brown', hex: '#6E4B3A' },
  { name: 'Grey', hex: '#8A8B88' },
  { name: 'Navy', hex: '#1D2C4C' },
  { name: 'Blue', hex: '#4169A1' },
  { name: 'Green', hex: '#4F6B50' },
  { name: 'Red', hex: '#A23A3A' },
  { name: 'Burgundy', hex: '#6A2633' },
  { name: 'Pink', hex: '#D89BAA' },
  { name: 'Purple', hex: '#735B82' },
  { name: 'Yellow', hex: '#D6B84A' },
  { name: 'Orange', hex: '#C8763E' },
] as const;

export function getColorHex(name: string): string | undefined {
  return colorOptions.find((color) => color.name === name)?.hex;
}
