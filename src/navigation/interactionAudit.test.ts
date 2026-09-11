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

  it('keeps the refined Explore controls functional and heading-free', () => {
    const explore = readFileSync('src/features/explore/screens/ExploreScreen.tsx', 'utf8');
    const searchResults = readFileSync(
      'src/features/explore/screens/SearchResultsScreen.tsx',
      'utf8',
    );
    const searchBar = readFileSync('src/components/ui/SearchBar.tsx', 'utf8');

    expect(explore).toContain('<AppScreen hideHeader title="">');
    expect(explore).toContain('showSubmit={false}');
    expect(explore).toContain('setActiveQuery(query.trim())');
    expect(searchResults).toContain('showSubmit={false}');
    expect(searchResults).toContain('setSubmittedQuery(query.trim())');
    expect(`${explore}\n${searchResults}`).not.toContain('submitLabel=');
    expect(searchBar).toContain('onSubmitEditing={handleSubmit}');
    expect(searchBar).toContain('returnKeyType="search"');
    expect(searchBar).toContain('Keyboard.dismiss()');
    expect(searchBar).toContain('{showSubmit ? (');
  });

  it('uses a bottom sheet with sticky actions and no filter title hierarchy', () => {
    const filterPanel = readFileSync(
      'src/features/explore/components/ExploreFilterPanel.tsx',
      'utf8',
    );

    expect(filterPanel).toContain("justifyContent: 'flex-end'");
    expect(filterPanel).toContain('style={styles.scrollArea}');
    expect(filterPanel).not.toContain('REFINE DISCOVERY');
    expect(filterPanel).not.toContain('styles.title');
  });

  it('pushes related Explore outfits and overlays the circular Back control on the image', () => {
    const detail = readFileSync(
      'src/features/explore/screens/ExploreOutfitDetailScreen.tsx',
      'utf8',
    );

    expect(detail).toContain('navigation.push(EXPLORE_ROUTES.INSPIRATION_DETAIL');
    expect(detail).toContain('<ExploreMasonryFeed');
    expect(detail).toContain('<AppScreen hideHeader title="">');
    expect(detail).toContain('<OutfitImageBackButton onPress={onBack} styles={styles} />');
    expect(detail).toContain('accessibilityLabel="Go back"');
    expect(detail).toContain("import Ionicons from '@expo/vector-icons/Ionicons'");
    expect(detail).toContain('name="chevron-back-outline"');
    expect(detail).not.toContain('←');
    expect(detail).toContain('borderRadius: theme.radii.full');
    expect(detail.match(/borderRadius:/g)).toHaveLength(1);
  });

  it('uses one route-driven, safe-area-aware, full-width bottom tab bar', () => {
    const navigator = readFileSync('src/navigation/MainAppNavigator.tsx', 'utf8');
    const bottomTabBar = readFileSync('src/navigation/FloatingTabBar.tsx', 'utf8');
    const tabBarIcon = readFileSync('src/navigation/TabBarIcon.tsx', 'utf8');

    expect(navigator).toContain('tabBar={FloatingTabBar}');
    expect(navigator).toContain('tabBarShowLabel: false');
    expect(navigator).not.toContain('tabBarStyle:');
    expect(bottomTabBar).toContain('getFocusedRouteNameFromRoute');
    expect(bottomTabBar).toContain('testID="main-navigation-active-indicator"');
    expect(bottomTabBar).toContain('paddingBottom: insets.bottom');
    expect(bottomTabBar).toContain('paddingLeft: insets.left');
    expect(bottomTabBar).toContain('paddingRight: insets.right');
    expect(bottomTabBar).toContain('borderTopWidth: StyleSheet.hairlineWidth');
    expect(bottomTabBar).toContain('backgroundColor: theme.colors.surface');
    expect(bottomTabBar).toContain('navigation.emit({');
    expect(bottomTabBar).toContain('navigation.navigate(route.name, route.params)');
    expect(bottomTabBar).toContain('aria-selected={focused}');
    expect(bottomTabBar).not.toContain('borderRadius');
    expect(bottomTabBar).not.toContain('maxWidth');
    expect(bottomTabBar).not.toContain('theme.shadows');
    expect(tabBarIcon).toContain("home: 'home-outline'");
    expect(tabBarIcon).toContain("explore: 'search-outline'");
    expect(tabBarIcon).toContain("profile: 'person-outline'");
    expect(tabBarIcon).toContain('stroke="currentColor"');
    expect(tabBarIcon).toContain('fill="currentColor"');
    expect(tabBarIcon).toContain(
      'M6 2a2 2 0 0 0-2 2v15c0 1.11.89 2 2 2v1h2v-1h8v1h2v-1c1.11 0 2-.89 2-2V4a2 2 0 0 0-2-2z',
    );
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
      'Import product',
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
