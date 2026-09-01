import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { homeEditorialContent } from './data/homeEditorialContent';
import { getHomeEditorialContent } from './services/homeEditorialService';

describe('Home editorial content', () => {
  it('keeps release and outfit ids unique with complete editorial metadata', () => {
    const releaseIds = homeEditorialContent.releases.map((release) => release.id);
    const outfitIds = homeEditorialContent.outfits.map((outfit) => outfit.id);

    expect(new Set(releaseIds).size).toBe(releaseIds.length);
    expect(new Set(outfitIds).size).toBe(outfitIds.length);
    expect(releaseIds).toContain(homeEditorialContent.featuredReleaseId);
    expect(outfitIds).toContain(homeEditorialContent.featuredOutfitId);
    expect(
      homeEditorialContent.releases.every(
        (release) =>
          release.brand &&
          release.collection &&
          release.season &&
          release.releaseDate &&
          release.description &&
          release.image,
      ),
    ).toBe(true);
    expect(
      homeEditorialContent.outfits.every(
        (outfit) =>
          outfit.description &&
          outfit.garments.length > 0 &&
          outfit.colours.length > 0 &&
          outfit.materials.length > 0 &&
          outfit.stylingTechniques.length > 0,
      ),
    ).toBe(true);
  });

  it('covers released, current, and upcoming collection states', () => {
    const statuses = homeEditorialContent.releases.map((release) => release.status);
    expect(statuses).toEqual(expect.arrayContaining(['released', 'current', 'upcoming']));
  });

  it('loads through the asynchronous editorial service boundary', async () => {
    await expect(getHomeEditorialContent()).resolves.toBe(homeEditorialContent);
    expect(homeEditorialContent.provenance).toBe('manually-seeded');
  });
});

describe('Home editorial design constraints', () => {
  it('keeps newly created Home UI free of border radius declarations', () => {
    const componentFiles = [
      './components/EditorialPrimitives.tsx',
      './components/FashionSeasonSection.tsx',
      './components/FeaturedStylingSection.tsx',
      './components/HomeEditorialSkeleton.tsx',
      './screens/HomeScreen.tsx',
    ];

    const source = componentFiles
      .map((relativePath) =>
        readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8'),
      )
      .join('\n');

    expect(source).not.toMatch(/borderRadius\s*:/);
    expect(source).not.toMatch(/rounded(?:Small|Medium|Large)?/i);
  });

  it('keeps the skeleton hidden from accessibility traversal', () => {
    const skeletonSource = readFileSync(
      fileURLToPath(new URL('./components/HomeEditorialSkeleton.tsx', import.meta.url)),
      'utf8',
    );

    expect(skeletonSource).toContain('accessibilityElementsHidden');
    expect(skeletonSource).toContain('importantForAccessibility="no-hide-descendants"');
  });
});
