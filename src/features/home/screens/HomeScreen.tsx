import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/IconButton';
import { FirstOutfitGuide } from '@/features/stylist/components/FirstOutfitGuide';
import { HOME_ROUTES, MAIN_ROUTES } from '@/navigation/routes';
import type { HomeStackParamList, MainTabParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

import { EditorialEmptyState, EditorialRule } from '../components/EditorialPrimitives';
import { FashionSeasonSection } from '../components/FashionSeasonSection';
import { FeaturedStylingSection } from '../components/FeaturedStylingSection';
import { HomeEditorialSkeleton } from '../components/HomeEditorialSkeleton';
import { useHomeEditorialContent } from '../hooks/useHomeEditorialContent';
import type { FashionSeasonRelease, FeaturedOutfit } from '../types/editorial';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const { status, content, retry } = useHomeEditorialContent();
  const isTablet = width >= 640;
  const isWide = width >= 920;

  const openExplore = () => {
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.EXPLORE_TAB);
  };

  const openRelease = (release: FashionSeasonRelease) => {
    showDeferredNotice(`${release.brand} collection story`);
  };

  const openOutfit = (outfit: FeaturedOutfit) => {
    if (!outfit.linkedInspirationId) {
      showDeferredNotice(`${outfit.title} styling story`);
      return;
    }

    navigation.navigate(HOME_ROUTES.INSPIRATION_DETAIL, {
      inspirationId: outfit.linkedInspirationId,
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet ? styles.contentTablet : null,
          isWide ? styles.contentWide : null,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.masthead}>
          <View style={styles.mastheadTopRow}>
            <Text style={styles.edition}>Mix & Match / Edition 01</Text>
            <View style={styles.actions}>
              <IconButton label="Open discovery search" onPress={openExplore} symbol="⌕" />
              <IconButton
                label="Notifications preview"
                onPress={() => showDeferredNotice('Notifications')}
                symbol="○"
              />
            </View>
          </View>
          <EditorialRule />
          <View style={styles.mastheadCopy}>
            <Text
              accessibilityRole="header"
              style={[styles.title, isWide ? styles.titleWide : null]}
            >
              The Daily Edit
            </Text>
            <Text style={styles.subtitle}>
              Collections to know. Proportions to try. A considered view of getting dressed now.
            </Text>
          </View>
        </View>

        <FirstOutfitGuide />

        {status === 'loading' ? (
          <HomeEditorialSkeleton isTablet={isTablet} isWide={isWide} />
        ) : null}

        {status === 'error' ? (
          <EditorialEmptyState
            actionLabel="Try Again"
            message="The latest edition could not be loaded."
            onAction={retry}
          />
        ) : null}

        {status === 'ready' && content ? (
          <>
            <FashionSeasonSection
              featuredReleaseId={content.featuredReleaseId}
              isTablet={isTablet}
              isWide={isWide}
              onOpenRelease={openRelease}
              releases={content.releases}
            />
            <FeaturedStylingSection
              featuredOutfitId={content.featuredOutfitId}
              isTablet={isTablet}
              isWide={isWide}
              onOpenOutfit={openOutfit}
              outfits={content.outfits}
            />
            <View style={styles.editionNote}>
              <EditorialRule />
              <Text style={styles.editionNoteText}>
                Edition note · Release and styling stories are manually curated sample content.
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      alignSelf: 'center',
      gap: 88,
      maxWidth: 1180,
      paddingBottom: 96,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      width: '100%',
    },
    contentTablet: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
    },
    contentWide: {
      paddingHorizontal: theme.spacing.xxl,
    },
    masthead: { gap: theme.spacing.md },
    mastheadTopRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
    },
    edition: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.7,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    actions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    mastheadCopy: { gap: theme.spacing.sm, paddingTop: theme.spacing.md },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 56,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -2,
      lineHeight: 60,
      textTransform: 'uppercase',
    },
    titleWide: {
      fontSize: 92,
      letterSpacing: -3.2,
      lineHeight: 94,
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
      maxWidth: 620,
    },
    editionNote: { gap: theme.spacing.md },
    editionNoteText: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
  });
}
