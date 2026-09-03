import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Badge } from '@/components/ui/ProfilePrimitives';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { DeferredNotice } from '@/components/ui/StateViews';
import { allInspiration } from '@/fixtures/inspiration';
import { EXPLORE_ROUTES, HOME_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList, HomeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type HomeProps = NativeStackScreenProps<HomeStackParamList, 'InspirationDetail'>;
type ExploreProps = NativeStackScreenProps<ExploreStackParamList, 'InspirationDetail'>;

export function InspirationDetailScreen({ navigation, route }: HomeProps) {
  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace(HOME_ROUTES.HOME);
  };

  return (
    <InspirationDetailContent inspirationId={route.params.inspirationId} onBack={handleBack} />
  );
}

export function ExploreInspirationDetailScreen({ navigation, route }: ExploreProps) {
  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace(EXPLORE_ROUTES.EXPLORE);
  };

  return (
    <InspirationDetailContent inspirationId={route.params.inspirationId} onBack={handleBack} />
  );
}

function InspirationDetailContent({
  inspirationId,
  onBack,
}: {
  inspirationId: string;
  onBack: () => void;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const item = allInspiration.find((candidate) => candidate.id === inspirationId);

  if (!item) {
    return (
      <AppScreen onBack={onBack} title="Inspiration unavailable">
        <DeferredNotice>
          This fixture is no longer available in the local presentation set.
        </DeferredNotice>
      </AppScreen>
    );
  }

  return (
    <AppScreen onBack={onBack} subtitle={item.caption} title={item.title}>
      <PlaceholderArtwork aspectRatio={4 / 3} colors={item.colors} label={item.title} />
      <View style={styles.copy}>
        <Badge label={item.category} />
        <Text style={styles.heading}>Direction notes</Text>
        <Text style={styles.body}>
          This editorial shell provides room for future garment breakdowns, related looks, and
          source context without presenting fixture content as personalised advice.
        </Text>
      </View>
      <DeferredNotice>
        This is deterministic presentation content. Saving and recommendation services are not
        connected.
      </DeferredNotice>
      <ActionButton label="Save inspiration" onPress={() => showDeferredNotice('Saved styles')} />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    copy: { gap: theme.spacing.sm },
    heading: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    body: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
  });
}
