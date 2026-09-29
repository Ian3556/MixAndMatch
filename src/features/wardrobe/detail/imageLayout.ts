export function productImageResizeMode(width: number, height: number): 'cover' | 'contain' {
  return width > height * 1.2 ? 'contain' : 'cover';
}
