import { Image, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import type { EditorialImageSource } from '../types/editorial';
import { resolveEditorialImageSource } from './editorialAssets';

type EditorialImageProps = {
  alt: string;
  aspectRatio: number;
  image: EditorialImageSource;
  priority?: boolean;
};

export function EditorialImage({ alt, aspectRatio, image, priority = false }: EditorialImageProps) {
  return (
    <View style={[styles.imageFrame, { aspectRatio }]}>
      <Image
        accessibilityLabel={alt}
        accessible
        fadeDuration={priority ? 0 : 160}
        resizeMode="cover"
        source={resolveEditorialImageSource(image)}
        style={styles.image}
      />
    </View>
  );
}

type EditorialSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function EditorialSectionHeader({
  eyebrow,
  title,
  description,
}: EditorialSectionHeaderProps) {
  const theme = useAppTheme();
  const themedStyles = createStyles(theme);

  return (
    <View style={themedStyles.header}>
      <Text style={themedStyles.eyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={themedStyles.heading}>
        {title}
      </Text>
      {description ? <Text style={themedStyles.description}>{description}</Text> : null}
    </View>
  );
}

type EditorialActionProps = {
  label: string;
  onPress: () => void;
};

export function EditorialAction({ label, onPress }: EditorialActionProps) {
  const theme = useAppTheme();
  const themedStyles = createStyles(theme);

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [themedStyles.action, pressed ? themedStyles.pressed : null]}
    >
      <Text style={themedStyles.actionLabel}>{label} →</Text>
    </Pressable>
  );
}

type EditorialEmptyStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EditorialEmptyState({ message, actionLabel, onAction }: EditorialEmptyStateProps) {
  const theme = useAppTheme();
  const themedStyles = createStyles(theme);

  return (
    <View style={themedStyles.emptyState}>
      <Text style={themedStyles.emptyMessage}>{message}</Text>
      {actionLabel && onAction ? <EditorialAction label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

export function EditorialRule({ width = '100%' }: { width?: DimensionValue }) {
  const theme = useAppTheme();
  return (
    <View
      accessibilityElementsHidden
      style={{ backgroundColor: theme.colors.border, height: 1, width }}
    />
  );
}

const styles = StyleSheet.create({
  imageFrame: {
    backgroundColor: '#E8E6E0',
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
});

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      gap: theme.spacing.sm,
      maxWidth: 760,
    },
    eyebrow: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.8,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 42,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -1.1,
      lineHeight: 48,
    },
    description: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
      maxWidth: 620,
    },
    action: {
      alignSelf: 'flex-start',
      justifyContent: 'center',
      minHeight: 44,
      paddingVertical: theme.spacing.sm,
    },
    pressed: { opacity: 0.58 },
    actionLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 0.3,
      lineHeight: theme.typography.lineHeight.sm,
    },
    emptyState: {
      borderColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xl,
    },
    emptyMessage: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
  });
}
