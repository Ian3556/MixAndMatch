import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type PlaceholderArtworkProps = {
  label: string;
  colors: readonly string[];
  aspectRatio?: number;
  compact?: boolean;
};

export function PlaceholderArtwork({
  label,
  colors,
  aspectRatio = 4 / 5,
  compact = false,
}: PlaceholderArtworkProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View
      accessibilityLabel={`${label} placeholder artwork`}
      accessibilityRole="image"
      style={[
        styles.artwork,
        { aspectRatio, backgroundColor: colors[0] ?? theme.colors.surfaceMuted },
      ]}
    >
      <View
        style={[styles.shapeLarge, { backgroundColor: colors[1] ?? theme.colors.primarySoft }]}
      />
      {!compact ? (
        <View style={[styles.shapeSmall, { backgroundColor: colors[2] ?? theme.colors.surface }]} />
      ) : null}
      <View style={styles.labelShell}>
        <Text numberOfLines={2} style={styles.label}>
          {label}
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    artwork: {
      borderRadius: theme.radii.lg,
      justifyContent: 'flex-end',
      overflow: 'hidden',
      padding: theme.spacing.md,
      position: 'relative',
      width: '100%',
    },
    shapeLarge: {
      borderRadius: theme.radii.full,
      height: '72%',
      opacity: 0.82,
      position: 'absolute',
      right: '-18%',
      top: '-12%',
      width: '88%',
    },
    shapeSmall: {
      borderRadius: theme.radii.full,
      bottom: '-18%',
      height: '56%',
      left: '-20%',
      opacity: 0.55,
      position: 'absolute',
      width: '70%',
    },
    labelShell: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radii.sm,
      maxWidth: '92%',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    label: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.md,
    },
  });
}
