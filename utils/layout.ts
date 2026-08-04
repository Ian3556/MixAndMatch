export function getGridColumnCount(width: number) {
  if (width >= 720) return 3;
  if (width >= 360) return 2;
  return 1;
}

export function getGridItemWidth(width: number, columns: number, gap: number, padding: number) {
  return Math.max(0, (width - padding * 2 - gap * (columns - 1)) / columns);
}
