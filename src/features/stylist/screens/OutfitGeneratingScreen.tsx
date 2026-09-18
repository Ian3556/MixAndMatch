import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { ErrorState, SkeletonCard } from '@/components/ui/StateViews';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';
import { useStylistStore } from '@/store/stylistStore';
import { useAppTheme, type AppTheme } from '@/theme';

import { useStylistData } from '../useStylistData';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitGenerating'>;

export function OutfitGeneratingScreen({ navigation, route }: Props) {
  const styles = createStyles(useAppTheme());
  const { user, profile, wardrobe, ready, error: dataError, retry } = useStylistData();
  const styleProfile = profile?.styleProfile;
  const generate = useStylistStore((state) => state.generate);
  const started = useRef(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user || started.current) return;
    started.current = true;
    void generate({
      userId: user.id,
      wardrobe,
      ...(styleProfile ? { styleProfile } : {}),
      request: route.params.request,
    })
      .then((generation) =>
        navigation.replace(STYLIST_ROUTES.OUTFIT_RESULT, { generationId: generation.id }),
      )
      .catch((caught: unknown) => {
        started.current = false;
        setGenerationError(
          caught instanceof Error ? caught.message : 'The styling engine could not generate looks.',
        );
      });
  }, [generate, navigation, ready, route.params.request, styleProfile, user, wardrobe]);

  const error = generationError ?? dataError;
  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Using only local wardrobe data"
      title="Building your looks"
    >
      {error ? (
        <ErrorState
          action={{
            label: 'Try again',
            onPress: () => {
              setGenerationError(null);
              started.current = false;
              retry();
            },
          }}
          message={error}
          title="Generation stopped"
        />
      ) : (
        <View style={styles.skeletons}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      )}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    skeletons: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  });
}
