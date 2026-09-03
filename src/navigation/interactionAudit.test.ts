import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { WARDROBE_ROUTES } from './routes';

const roots = ['src/app', 'src/components', 'src/features', 'src/navigation', 'src/screens'];
const sourceFiles = roots.flatMap((root) => collectSourceFiles(root));

describe('application interaction audit', () => {
  it('contains no console-only or empty button handlers', () => {
    for (const file of sourceFiles) {
      const source = readFileSync(file, 'utf8');
      expect(source, file).not.toMatch(/console\.(?:log|debug)\s*\(/);
      expect(source, file).not.toMatch(
        /onPress\s*=\s*\{\s*\(\)\s*=>\s*(?:undefined|null|\{\s*\})\s*\}/,
      );
      expect(source, file).not.toMatch(/onPress\s*=\s*\{\s*undefined\s*\}/);
    }
  });

  it('gives every directly rendered Pressable a handler and/or disabled contract', () => {
    for (const file of sourceFiles) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/<Pressable\b([\s\S]*?)>/g)) {
        const openingTag = match[0];
        expect(
          openingTag.includes('onPress=') || openingTag.includes('disabled='),
          `${file}: ${openingTag}`,
        ).toBe(true);
      }
    }
  });

  it('registers every wardrobe workflow route in its navigator', () => {
    const navigator = readFileSync('src/navigation/TabNavigators.tsx', 'utf8');
    for (const key of Object.keys(WARDROBE_ROUTES)) {
      expect(navigator).toContain(`name={WARDROBE_ROUTES.${key}}`);
    }
  });

  it('keeps Explore details in the Explore stack so Back follows local history', () => {
    const navigator = readFileSync('src/navigation/TabNavigators.tsx', 'utf8');
    const exploreScreens = [
      'src/features/explore/screens/ExploreScreen.tsx',
      'src/features/explore/screens/SearchResultsScreen.tsx',
      'src/features/explore/screens/StyleCategoryScreen.tsx',
    ]
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');

    expect(navigator).toContain('name={EXPLORE_ROUTES.INSPIRATION_DETAIL}');
    expect(exploreScreens).toContain('EXPLORE_ROUTES.INSPIRATION_DETAIL');
    expect(exploreScreens).not.toContain('MAIN_ROUTES.HOME_TAB');
  });

  it('keeps Explore image lifecycle handlers stable across normal renders', () => {
    const feed = readFileSync('src/features/explore/components/ExploreMasonryFeed.tsx', 'utf8');

    expect(feed).toContain('onLoadEnd={handleImageLoadEnd}');
    expect(feed).toContain('onLoadStart={handleImageLoadStart}');
    expect(feed).not.toMatch(/onLoad(?:End|Start)=\{\(\) =>/);
  });

  it('keeps the complete URL import control contract visible and guarded', () => {
    const screen = [
      'src/features/wardrobe/screens/ImportWardrobeWebsiteScreen.tsx',
      'src/features/wardrobe/components/ImportUrlInputStep.tsx',
      'src/features/wardrobe/components/ImportPreviewStep.tsx',
    ]
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    for (const label of [
      'Paste',
      'Clear',
      'Analyse URL',
      'Select all',
      'Deselect all',
      'Add selected to wardrobe',
      'Back',
      'Cancel',
    ]) {
      expect(screen).toContain(label);
    }
    expect(screen).toContain('importLock.current');
    expect(screen).toContain('saveLock.current');
    expect(screen).toContain('loading={isSaving}');
  });

  it('labels later-phase 3D actions as unavailable', () => {
    const stylistSources = sourceFiles
      .filter((file) => file.includes(join('features', 'stylist')))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    expect(stylistSources).not.toMatch(/label="(?:Preview in 3D|Open 3D preview)"/);
    expect(stylistSources).toContain('3D preview unavailable');
  });
});

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}
