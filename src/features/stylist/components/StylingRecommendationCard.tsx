import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { OutfitFeedbackState } from '@/services/stylistPersistence';
import { useAppTheme, type AppTheme } from '@/theme';

import type { ClothingItem, StylingRecommendation } from '../types';
import { getOutfitItems } from '../types';
import {
  buildStylingInstructions,
  getRecommendationTitle,
} from '../presentation/stylingPresentation';
import { OutfitImageComposition } from './OutfitImageComposition';

type FeedbackAction = 'like' | 'dislike' | 'save' | 'wore';

type Props = {
  recommendation: StylingRecommendation;
  index: number;
  feedback?: OutfitFeedbackState;
  saved: boolean;
  neverRecommendItemIds: readonly string[];
  busy?: boolean;
  featured?: boolean;
  onFeedback: (action: FeedbackAction) => void;
  onNeverRecommend: (item: ClothingItem) => void;
  onOpen?: () => void;
};

export function StylingRecommendationCard({
  recommendation,
  index,
  feedback,
  saved,
  neverRecommendItemIds,
  busy = false,
  featured = false,
  onFeedback,
  onNeverRecommend,
  onOpen,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const items = getOutfitItems(recommendation.outfit);
  const neverRecommend = new Set(neverRecommendItemIds);
  const instructions = buildStylingInstructions(items);

  return (
    <View style={[styles.card, featured ? styles.featuredCard : null]}>
      <View style={styles.headingRow}>
        <View style={styles.lookIdentity}>
          <Text style={styles.lookNumber}>LOOK {String(index + 1).padStart(2, '0')}</Text>
          <Text style={[styles.lookTitle, featured ? styles.featuredTitle : null]}>
            {getRecommendationTitle(recommendation)}
          </Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={styles.score}>{Math.round(recommendation.score)}</Text>
          <Text style={styles.scoreLabel}>MATCH / 100</Text>
        </View>
      </View>

      <OutfitImageComposition featured={featured} items={items} />

      {!recommendation.outfit.shoes ? (
        <Text style={styles.availabilityNote}>
          Footwear is open: no compatible shoe was available in this wardrobe.
        </Text>
      ) : null}

      <View style={[styles.editorialNotes, width >= 720 ? styles.editorialNotesWide : null]}>
        <View style={styles.noteColumn}>
          <Text style={styles.noteLabel}>WHY IT WORKS</Text>
          <Text style={styles.noteBody}>{recommendation.explanation}</Text>
        </View>
        <View style={styles.noteColumn}>
          <Text style={styles.noteLabel}>HOW TO WEAR IT</Text>
          {instructions.map((instruction, instructionIndex) => (
            <View key={instruction} style={styles.instructionRow}>
              <Text style={styles.instructionIndex}>
                {String(instructionIndex + 1).padStart(2, '0')}
              </Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.itemDirectory}>
        <Text style={styles.noteLabel}>WARDROBE PIECES</Text>
        {items.map((item, itemIndex) => {
          const excluded = neverRecommend.has(item.id);
          return (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemIndex}>{String(itemIndex + 1).padStart(2, '0')}</Text>
              <View style={styles.itemCopy}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.name}
                </Text>
                <Text style={styles.itemMeta}>
                  {[item.category, item.primaryColor].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: excluded }}
                disabled={excluded || busy}
                hitSlop={8}
                onPress={() => onNeverRecommend(item)}
                style={({ pressed }) => [styles.excludeAction, pressed ? styles.pressed : null]}
              >
                <Text style={[styles.excludeLabel, excluded ? styles.excludeLabelDisabled : null]}>
                  {excluded ? 'EXCLUDED' : 'NEVER RECOMMEND'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={styles.feedbackRow}>
        <FeedbackControl
          disabled={busy}
          label="LIKE"
          onPress={() => onFeedback('like')}
          selected={feedback?.sentiment === 'like'}
          styles={styles}
        />
        <FeedbackControl
          disabled={busy}
          label="DISLIKE"
          onPress={() => onFeedback('dislike')}
          selected={feedback?.sentiment === 'dislike'}
          styles={styles}
        />
        <FeedbackControl
          disabled={busy}
          label="SAVE"
          onPress={() => onFeedback('save')}
          selected={saved}
          styles={styles}
        />
        <FeedbackControl
          disabled={busy}
          label="WORE"
          onPress={() => onFeedback('wore')}
          selected={Boolean(feedback?.woreAt)}
          styles={styles}
        />
      </View>

      {onOpen ? (
        <Pressable
          accessibilityRole="button"
          onPress={onOpen}
          style={({ pressed }) => [styles.detailLink, pressed ? styles.pressed : null]}
        >
          <Text style={styles.detailLinkLabel}>VIEW FULL BREAKDOWN →</Text>
        </Pressable>
      ) : null}

      {__DEV__ ? <ScoreBreakdown recommendation={recommendation} styles={styles} /> : null}
    </View>
  );
}

type Styles = ReturnType<typeof createStyles>;

function FeedbackControl({
  label,
  selected,
  disabled,
  onPress,
  styles,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
  styles: Styles;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.feedbackControl,
        selected ? styles.feedbackControlSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.feedbackLabel, selected ? styles.feedbackLabelSelected : null]}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </Pressable>
  );
}

function ScoreBreakdown({
  recommendation,
  styles,
}: {
  recommendation: StylingRecommendation;
  styles: Styles;
}) {
  return (
    <View style={styles.debug}>
      <Text style={styles.debugTitle}>DEVELOPMENT SCORE BREAKDOWN</Text>
      <View style={styles.debugGrid}>
        {Object.entries(recommendation.scoreBreakdown).map(([label, score]) => (
          <Text key={label} style={styles.debugValue}>
            {label} {score.toFixed(1)}
          </Text>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      borderTopColor: theme.colors.text,
      borderTopWidth: 1,
      gap: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    featuredCard: { borderTopWidth: 2, gap: theme.spacing.xl },
    headingRow: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.md },
    lookIdentity: { flex: 1, gap: theme.spacing.xs },
    lookNumber: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.6,
    },
    lookTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.regular,
      lineHeight: theme.typography.lineHeight.xl,
      textTransform: 'capitalize',
    },
    featuredTitle: {
      fontSize: theme.typography.fontSize.xxxl,
      letterSpacing: -1,
      lineHeight: theme.typography.lineHeight.xxxl,
    },
    scoreBlock: { alignItems: 'flex-end', minWidth: 72 },
    score: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxl,
      fontVariant: ['tabular-nums'],
      lineHeight: theme.typography.lineHeight.xxl,
    },
    scoreLabel: { color: theme.colors.textMuted, fontSize: 10, letterSpacing: 1 },
    availabilityNote: {
      borderLeftColor: theme.colors.warning,
      borderLeftWidth: 2,
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      paddingLeft: theme.spacing.sm,
    },
    editorialNotes: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
    },
    editorialNotesWide: { flexDirection: 'row' },
    noteColumn: { flex: 1, gap: theme.spacing.md, minWidth: 220 },
    noteLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.4,
    },
    noteBody: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    instructionRow: { flexDirection: 'row', gap: theme.spacing.sm },
    instructionIndex: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontVariant: ['tabular-nums'],
      width: 22,
    },
    instructionText: {
      color: theme.colors.text,
      flex: 1,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    itemDirectory: { gap: theme.spacing.sm },
    itemRow: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minHeight: 56,
      paddingVertical: theme.spacing.xs,
    },
    itemIndex: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      fontVariant: ['tabular-nums'],
      width: 24,
    },
    itemCopy: { flex: 1, gap: theme.spacing.xxs },
    itemName: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    itemMeta: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      textTransform: 'capitalize',
    },
    excludeAction: { justifyContent: 'center', minHeight: 44, paddingLeft: theme.spacing.sm },
    excludeLabel: {
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: 10,
      letterSpacing: 0.7,
      textAlign: 'right',
    },
    excludeLabelDisabled: { color: theme.colors.textMuted },
    feedbackRow: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    feedbackControl: {
      alignItems: 'center',
      borderRightColor: theme.colors.border,
      borderRightWidth: StyleSheet.hairlineWidth,
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: 48,
      minWidth: 96,
      paddingHorizontal: theme.spacing.sm,
    },
    feedbackControlSelected: { backgroundColor: theme.colors.primarySoft },
    feedbackLabel: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 0.8,
    },
    feedbackLabelSelected: { color: theme.colors.primary, fontWeight: '600' },
    detailLink: { alignItems: 'flex-start', justifyContent: 'center', minHeight: 44 },
    detailLinkLabel: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1,
    },
    debug: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    debugTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
    },
    debugGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    debugValue: {
      color: theme.colors.textMuted,
      fontFamily: 'monospace',
      fontSize: theme.typography.fontSize.xs,
      minWidth: 120,
    },
    pressed: { opacity: 0.62 },
  });
}
