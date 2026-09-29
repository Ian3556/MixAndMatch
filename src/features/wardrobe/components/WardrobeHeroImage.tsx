import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';
import { productImageResizeMode } from '@/features/wardrobe/detail/imageLayout';

type Props = { imageUrl: string | null; name: string };

export function WardrobeHeroImage({ imageUrl, name }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(Boolean(imageUrl));
  const [failed, setFailed] = useState(false);
  const [landscape, setLandscape] = useState(false);

  return (
    <View style={styles.frame}>
      {imageUrl && !failed ? (
        <Image
          accessibilityLabel={`${name} wardrobe image`}
          onError={() => {
            setFailed(true);
            setLoading(false);
          }}
          onLoad={(event) => {
            const source = event.nativeEvent.source;
            if (source?.width && source.height)
              setLandscape(productImageResizeMode(source.width, source.height) === 'contain');
          }}
          onLoadEnd={() => setLoading(false)}
          resizeMode={landscape ? 'contain' : 'cover'}
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      ) : (
        <View
          accessibilityLabel="Product image unavailable"
          accessibilityRole="image"
          style={styles.fallback}
        >
          <Ionicons color={theme.colors.textMuted} name="image-outline" size={32} />
          <Text style={styles.fallbackText}>IMAGE UNAVAILABLE</Text>
        </View>
      )}
      {loading && !failed ? (
        <View accessibilityLabel="Loading product image" style={styles.skeleton} />
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    frame: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
      width: '100%',
    },
    image: { height: '100%', width: '100%' },
    skeleton: {
      bottom: 0,
      backgroundColor: theme.colors.surfaceMuted,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    fallback: { alignItems: 'center', flex: 1, gap: theme.spacing.sm, justifyContent: 'center' },
    fallbackText: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1.2,
    },
  });
}
