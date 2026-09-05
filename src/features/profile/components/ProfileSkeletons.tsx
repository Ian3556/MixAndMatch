import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

export function ProfileIdentitySkeleton() {
  const styles = createStyles(useAppTheme());
  return (
    <View
      accessibilityLabel="Profile identity loading"
      accessibilityRole="progressbar"
      style={styles.identity}
    >
      <View style={styles.avatar} />
      <View style={styles.identityCopy}>
        <View style={[styles.line, styles.name]} />
        <View style={[styles.line, styles.email]} />
      </View>
    </View>
  );
}

export function StyleProfileRowSkeleton() {
  const styles = createStyles(useAppTheme());
  return (
    <View
      accessibilityLabel="Style profile loading"
      accessibilityRole="progressbar"
      style={styles.styleSection}
    >
      <View style={[styles.line, styles.sectionTitle]} />
      <View style={styles.navigationRow}>
        <View style={[styles.line, styles.navigationLabel]} />
        <View style={[styles.line, styles.chevron]} />
      </View>
    </View>
  );
}

export function ProfileFormSkeleton({ rows = 5 }: { rows?: number }) {
  const styles = createStyles(useAppTheme());
  return (
    <View
      accessibilityLabel="Profile preferences loading"
      accessibilityRole="progressbar"
      style={styles.form}
    >
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.formGroup}>
          <View style={[styles.line, styles.formLabel]} />
          <View style={styles.tags}>
            <View style={[styles.line, styles.tagWide]} />
            <View style={[styles.line, styles.tag]} />
            <View style={[styles.line, styles.tag]} />
          </View>
        </View>
      ))}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    identity: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      paddingTop: theme.spacing.sm,
    },
    avatar: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.full,
      height: 96,
      width: 96,
    },
    identityCopy: { flex: 1, gap: theme.spacing.sm },
    line: { backgroundColor: theme.colors.surfaceMuted },
    name: { height: 34, maxWidth: 320, width: '72%' },
    email: { height: 14, maxWidth: 240, width: '54%' },
    styleSection: { gap: theme.spacing.lg },
    sectionTitle: { height: 18, width: 142 },
    navigationRow: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      justifyContent: 'space-between',
      minHeight: 58,
    },
    navigationLabel: { height: 16, width: 112 },
    chevron: { height: 16, width: 10 },
    form: { gap: theme.spacing.xl },
    formGroup: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    formLabel: { height: 13, width: 112 },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    tag: { height: 42, width: 76 },
    tagWide: { height: 42, width: 112 },
  });
}
