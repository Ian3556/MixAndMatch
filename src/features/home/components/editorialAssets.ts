import type { ImageSourcePropType } from 'react-native';

import type { EditorialImageKey, EditorialImageSource } from '../types/editorial';

const editorialAssets: Record<EditorialImageKey, ImageSourcePropType> = {
  'season-release-hero': require('../../../../assets/editorial/season-release-hero.jpg'),
  'season-release-secondary': require('../../../../assets/editorial/season-release-secondary.jpg'),
  'season-release-resort': require('../../../../assets/editorial/season-release-resort.jpg'),
  'featured-outfit-city-minimal': require('../../../../assets/editorial/featured-outfit-city-minimal.jpg'),
  'featured-outfit-tonal-layers': require('../../../../assets/editorial/featured-outfit-tonal-layers.jpg'),
  'featured-outfit-soft-utility': require('../../../../assets/editorial/featured-outfit-soft-utility.jpg'),
};

export function resolveEditorialImageSource(source: EditorialImageSource): ImageSourcePropType {
  return source.kind === 'asset' ? editorialAssets[source.key] : { uri: source.uri };
}
