import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorBanner } from '@/components/ErrorBanner';
import { AppScreen } from '@/components/ui/AppScreen';
import { isCatalogDevToolsEnabled } from '@/constants/catalogDevTools';
import { ActivitySummary } from '@/features/profile/components/ActivitySummary';
import { ProfileIdentity } from '@/features/profile/components/ProfileIdentity';
import {
  ProfileDirectoryRow,
  ProfileSettingsDirectory,
} from '@/features/profile/components/ProfileSettingsDirectory';
import {
  ProfileIdentitySkeleton,
  StyleProfileRowSkeleton,
} from '@/features/profile/components/ProfileSkeletons';
import { SignOutRow } from '@/features/profile/components/SignOutRow';
import { StyleProfileEntry } from '@/features/profile/components/StyleProfileEntry';
import { PROFILE_ROUTES } from '@/navigation/routes';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';

import { useSignOutAction } from '../useSignOutAction';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const profile = useAuthStore((state) => state.profile);
  const profileStatus = useAuthStore((state) => state.profileStatus);
  const user = useAuthStore((state) => state.user);
  const wardrobeItems = useWardrobeStore((state) => state.items);
  const wardrobeStatus = useWardrobeStore((state) => state.status);
  const wardrobeError = useWardrobeStore((state) => state.error);
  const loadedWardrobeUserId = useWardrobeStore((state) => state.loadedUserId);
  const refreshWardrobe = useWardrobeStore((state) => state.refresh);
  const { handleSignOut, isSigningOut, signOutError } = useSignOutAction();

  useEffect(() => {
    if (
      user &&
      (loadedWardrobeUserId !== user.id || wardrobeStatus === 'idle') &&
      wardrobeStatus !== 'loading'
    ) {
      void refreshWardrobe(user.id);
    }
  }, [loadedWardrobeUserId, refreshWardrobe, user, wardrobeStatus]);

  const editProfile = () => navigation.navigate(PROFILE_ROUTES.EDIT_PROFILE);
  const profileLoading = profileStatus === 'loading' || !profile;
  const wardrobeLoading =
    Boolean(user) &&
    (wardrobeStatus === 'idle' ||
      wardrobeStatus === 'loading' ||
      loadedWardrobeUserId !== user?.id);
  const currentWardrobeError =
    wardrobeStatus === 'error' && loadedWardrobeUserId === user?.id ? wardrobeError : null;
  const appearanceValue =
    theme.preference === 'system' ? 'System' : theme.preference === 'dark' ? 'Dark' : 'Light';

  return (
    <AppScreen
      hideHeader
      scrollProps={{ contentInsetAdjustmentBehavior: 'automatic' }}
      title="Profile"
    >
      <View style={styles.page}>
        {profileLoading ? (
          <ProfileIdentitySkeleton />
        ) : (
          <ProfileIdentity
            avatarUrl={profile.avatarUrl}
            email={user?.email ?? 'Email unavailable'}
            name={profile.displayName ?? 'Mix & Match member'}
            onEdit={editProfile}
          />
        )}

        <ActivitySummary
          onRetryWardrobe={() => {
            if (user) void refreshWardrobe(user.id);
          }}
          wardrobeCount={wardrobeItems.length}
          wardrobeError={currentWardrobeError}
          wardrobeLoading={wardrobeLoading}
        />

        {profileLoading ? (
          <StyleProfileRowSkeleton />
        ) : (
          <StyleProfileEntry onPress={() => navigation.navigate(PROFILE_ROUTES.STYLE_PROFILE)} />
        )}

        <ProfileSettingsDirectory
          appearanceValue={appearanceValue}
          catalogOperationsRow={
            isCatalogDevToolsEnabled() ? (
              <ProfileDirectoryRow
                icon="construct-outline"
                label="Catalogue Operations"
                onPress={() => navigation.navigate(PROFILE_ROUTES.CATALOG_DEVELOPMENT)}
              />
            ) : undefined
          }
          onAbout={() => navigation.navigate(PROFILE_ROUTES.ABOUT)}
          onAccount={() => navigation.navigate(PROFILE_ROUTES.ACCOUNT)}
          onAppearance={() => navigation.navigate(PROFILE_ROUTES.APPEARANCE)}
          onHelp={() => navigation.navigate(PROFILE_ROUTES.HELP)}
          onNotifications={() => navigation.navigate(PROFILE_ROUTES.NOTIFICATIONS)}
          onPrivacy={() => navigation.navigate(PROFILE_ROUTES.PRIVACY)}
        />

        <View style={styles.signOutSection}>
          {signOutError ? <ErrorBanner message={signOutError} /> : null}
          <SignOutRow isSigningOut={isSigningOut} onPress={() => void handleSignOut()} />
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    page: {
      alignSelf: 'center',
      gap: theme.spacing.xxl,
      maxWidth: 760,
      paddingBottom: theme.spacing.xl,
      width: '100%',
    },
    signOutSection: { gap: theme.spacing.md },
  });
}
