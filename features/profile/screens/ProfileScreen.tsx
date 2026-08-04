import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { AppScreen } from '@/components/ui/AppScreen';
import { Avatar, StatCard } from '@/components/ui/ProfilePrimitives';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { DeferredNotice } from '@/components/ui/StateViews';
import { PROFILE_ROUTES } from '@/navigation/routes';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

import { useSignOutAction } from '../useSignOutAction';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const { handleSignOut, isSigningOut, signOutError } = useSignOutAction();
  const name = profile?.displayName || 'Mix & Match member';

  return (
    <AppScreen
      eyebrow="Your account"
      subtitle="Identity, preferences, and app settings"
      title="Profile"
    >
      <View style={styles.profileHeader}>
        <Avatar name={name} />
        <View style={styles.profileCopy}>
          <Text accessibilityRole="header" style={styles.name}>
            {name}
          </Text>
          <Text style={styles.email}>{user?.email ?? 'Email unavailable'}</Text>
        </View>
        <ActionButton
          label="Edit profile"
          onPress={() => navigation.navigate(PROFILE_ROUTES.EDIT_PROFILE)}
          variant="secondary"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle="Future preference categories—not stored profile data"
          title="Style profile"
        />
        <View style={styles.preferenceGrid}>
          {[
            'Preferred styles',
            'Favourite colours',
            'Avoided colours',
            'Typical occasions',
            'Fit preferences',
          ].map((label) => (
            <SettingRow
              key={label}
              label={label}
              onPress={() => showDeferredNotice(label)}
              value="Not set"
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle="Analytics are not calculated in Phase 2"
          title="Activity summary"
        />
        <View style={styles.stats}>
          <StatCard label="Wardrobe items" value="—" />
          <StatCard label="Saved outfits" value="—" />
          <StatCard label="Favourite looks" value="—" />
          <StatCard label="Outfit history" value="—" />
        </View>
      </View>

      <SettingsGroup title="Settings">
        <SettingRow label="Account" onPress={() => navigation.navigate(PROFILE_ROUTES.ACCOUNT)} />
        <SettingRow
          label="Appearance"
          onPress={() => navigation.navigate(PROFILE_ROUTES.APPEARANCE)}
          value={
            theme.preference === 'system'
              ? 'System'
              : theme.preference === 'dark'
                ? 'Dark'
                : 'Light'
          }
        />
        <SettingRow
          label="Notifications"
          onPress={() => navigation.navigate(PROFILE_ROUTES.NOTIFICATIONS)}
        />
        <SettingRow label="Privacy" onPress={() => navigation.navigate(PROFILE_ROUTES.PRIVACY)} />
        <SettingRow label="Help" onPress={() => navigation.navigate(PROFILE_ROUTES.HELP)} />
        <SettingRow label="About" onPress={() => navigation.navigate(PROFILE_ROUTES.ABOUT)} />
      </SettingsGroup>

      <DeferredNotice>
        Only display-name updates and sign-out connect to Phase 1 services. Style and activity
        values remain unpersisted placeholders.
      </DeferredNotice>
      {signOutError ? <ErrorBanner message={signOutError} /> : null}
      <ActionButton
        label="Sign out"
        loading={isSigningOut}
        onPress={() => void handleSignOut()}
        variant="secondary"
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    profileHeader: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    profileCopy: { flex: 1, minWidth: 180 },
    name: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
    },
    email: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    section: { gap: theme.spacing.md },
    preferenceGrid: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      overflow: 'hidden',
    },
    stats: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
}
