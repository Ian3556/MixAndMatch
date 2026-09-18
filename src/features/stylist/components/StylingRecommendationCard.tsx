import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import type { OutfitFeedbackState } from '@/services/stylistPersistence';
import { useAppTheme, type AppTheme } from '@/theme';

import type { ClothingItem, StylingRecommendation } from '../types';
import { getOutfitItems } from '../types';

type FeedbackAction = 'like' | 'dislike' | 'save' | 'wore';

type Props = {
  recommendation: StylingRecommendation;
  index: number;
  feedback?: OutfitFeedbackState;
  saved: boolean;
  neverRecommendItemIds: readonly string[];
  busy?: boolean;
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
  onFeedback,
  onNeverRecommend,
  onOpen,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const items = getOutfitItems(recommendation.outfit);
  const neverRecommend = new Set(neverRecommendItemIds);

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.lookIdentity}>
          <Text style={styles.lookNumber}>LOOK {String(index + 1).padStart(2, '0')}</Text>
          <Text style={styles.lookTitle}>{lookTitle(recommendation)}</Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={styles.score}>{recommendation.score.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>MATCH</Text>
        </View>
      </View>

      <View style={styles.itemGrid}>
        {items.map((item) => (
          <RecommendationItem
            item={item}
            key={item.id}
            neverRecommended={neverRecommend.has(item.id)}
            onNeverRecommend={() => onNeverRecommend(item)}
            placeholderColors={[
              theme.colors.primarySoft,
              theme.colors.surfaceMuted,
              theme.colors.surface,
            ]}
            styles={styles}
          />
        ))}
      </View>
      {!recommendation.outfit.shoes ? (
        <Text style={styles.availabilityNote}>
          Footwear is not included because no compatible shoe candidate was available.
        </Text>
      ) : null}

      <View style={styles.explanation}>
        <Text style={styles.explanationLabel}>Why this works</Text>
        <Text style={styles.explanationBody}>{recommendation.explanation}</Text>
      </View>

      <View style={styles.feedbackRow}>
        <Chip
          label="Like"
          onPress={() => {
            if (!busy) onFeedback('like');
          }}
          selected={feedback?.sentiment === 'like'}
        />
        <Chip
          label="Dislike"
          onPress={() => {
            if (!busy) onFeedback('dislike');
          }}
          selected={feedback?.sentiment === 'dislike'}
        />
        <Chip
          label="Save"
          onPress={() => {
            if (!busy) onFeedback('save');
          }}
          selected={saved}
        />
        <Chip
          label="Wore"
          onPress={() => {
            if (!busy) onFeedback('wore');
          }}
          selected={Boolean(feedback?.woreAt)}
        />
      </View>

      {onOpen ? (
        <Pressable
          accessibilityRole="button"
          onPress={onOpen}
          style={({ pressed }) => [styles.detailLink, pressed ? styles.pressed : null]}
        >
          <Text style={styles.detailLinkLabel}>View full breakdown →</Text>
        </Pressable>
      ) : null}

      {__DEV__ ? <ScoreBreakdown recommendation={recommendation} styles={styles} /> : null}
    </View>
  );
}

type Styles = ReturnType<typeof createStyles>;

function RecommendationItem({
  item,
  neverRecommended,
  onNeverRecommend,
  placeholderColors,
  styles,
}: {
  item: ClothingItem;
  neverRecommended: boolean;
  onNeverRecommend: () => void;
  placeholderColors: readonly string[];
  styles: Styles;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <View style={styles.item}>
      <View style={styles.imageFrame}>
        {item.imageUrl && !imageFailed ? (
          <Image
            accessibilityLabel={`${item.name} wardrobe image`}
            onError={() => setImageFailed(true)}
            resizeMode="cover"
            source={{ uri: item.imageUrl }}
            style={styles.image}
          />
        ) : (
          <PlaceholderArtwork colors={placeholderColors} compact label={item.name} />
        )}
      </View>
      <Text numberOfLines={2} style={styles.itemName}>
        {item.name}
      </Text>
      <Text style={styles.itemMeta}>
        {[item.category, item.primaryColor].filter(Boolean).join(' · ')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: neverRecommended }}
        disabled={neverRecommended}
        onPress={onNeverRecommend}
        style={({ pressed }) => [styles.neverButton, pressed ? styles.pressed : null]}
      >
        <Text style={[styles.neverLabel, neverRecommended ? styles.neverLabelDisabled : null]}>
          {neverRecommended ? 'Excluded from future looks' : 'Never recommend this item'}
        </Text>
      </Pressable>
    </View>
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
      <Text style={styles.debugTitle}>Development score breakdown</Text>
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

function lookTitle(recommendation: StylingRecommendation): string {
  const outfit = recommendation.outfit;
  const style = getOutfitItems(outfit).flatMap((item) => item.styles ?? [])[0];
  if (style) return style.replace(/-/g, ' ');
  return outfit.dress ? 'One-piece wardrobe look' : 'Wardrobe combination';
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      borderTopColor: theme.colors.text,
      borderTopWidth: 2,
      gap: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    headingRow: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.md },
    lookIdentity: { flex: 1, gap: theme.spacing.xs },
    lookNumber: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: 1.4,
    },
    lookTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      textTransform: 'capitalize',
    },
    scoreBlock: { alignItems: 'flex-end' },
    score: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      fontVariant: ['tabular-nums'],
    },
    scoreLabel: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1,
    },
    itemGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    item: { flexGrow: 1, gap: theme.spacing.xs, minWidth: 138, width: '28%' },
    imageFrame: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
      width: '100%',
    },
    image: { height: '100%', width: '100%' },
    itemName: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    itemMeta: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      textTransform: 'capitalize',
    },
    neverButton: { justifyContent: 'center', minHeight: 44 },
    neverLabel: { color: theme.colors.danger, fontSize: theme.typography.fontSize.xs },
    neverLabelDisabled: { color: theme.colors.textMuted },
    availabilityNote: { color: theme.colors.warning, fontSize: theme.typography.fontSize.sm },
    explanation: {
      backgroundColor: theme.colors.surfaceMuted,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    explanationLabel: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.bold },
    explanationBody: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    feedbackRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    detailLink: { alignItems: 'flex-start', justifyContent: 'center', minHeight: 44 },
    detailLinkLabel: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
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
      textTransform: 'uppercase',
    },
    debugGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    debugValue: {
      color: theme.colors.textMuted,
      fontFamily: 'monospace',
      fontSize: theme.typography.fontSize.xs,
      minWidth: 120,
    },
    pressed: { opacity: 0.7 },
  });
}
