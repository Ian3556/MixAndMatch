/** Read a complete fibre composition only; marketing fabric names are not materials. */
export function extractMaterialCompositionFromHtml(html: string): string | undefined {
  const compositions = new Set<string>();
  const expression =
    /(?:\d{1,3}\s*%\s*(?:recycled\s+)?(?:cotton|polyester|elastane|nylon|wool|linen|silk|viscose|rayon|spandex)\s*(?:\/|,|and)\s*)?\d{1,3}\s*%\s*(?:recycled\s+)?(?:cotton|polyester|elastane|nylon|wool|linen|silk|viscose|rayon|spandex)/gi;
  for (const match of html.matchAll(expression)) {
    const segments = [
      ...match[0].matchAll(
        /(\d{1,3})\s*%\s*((?:recycled\s+)?(?:cotton|polyester|elastane|nylon|wool|linen|silk|viscose|rayon|spandex))/gi,
      ),
    ];
    if (segments.reduce((sum, segment) => sum + Number(segment[1]), 0) !== 100) continue;
    compositions.add(
      segments.map((segment) => `${segment[1]}% ${segment[2]!.toLowerCase()}`).join(' / '),
    );
    if (compositions.size > 1) return undefined;
  }
  return [...compositions][0];
}
