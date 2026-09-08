import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeViewMode } from '@/store/wardrobeStore';

type Props = {
  searchVisible: boolean;
  sort: 'recent' | 'name';
  viewMode: WardrobeViewMode;
  onAdd: () => void;
  onChangeView: (mode: WardrobeViewMode) => void;
  onToggleSearch: () => void;
  onToggleSort: () => void;
};

export function WardrobeToolbar({
  searchVisible,
  sort,
  viewMode,
  onAdd,
  onChangeView,
  onToggleSearch,
  onToggleSort,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.toolbar}>
      <ToolButton
        active={searchVisible}
        icon={searchVisible ? 'close-outline' : 'search-outline'}
        label={searchVisible ? 'Hide wardrobe search' : 'Search wardrobe'}
        onPress={onToggleSearch}
        styles={styles}
        theme={theme}
      />
      <ToolButton
        active={sort === 'name'}
        icon="swap-vertical-outline"
        label={`Sort wardrobe by ${sort === 'recent' ? 'name' : 'most recent'}`}
        onPress={onToggleSort}
        styles={styles}
        theme={theme}
      />
      <View accessibilityLabel="Wardrobe view" accessibilityRole="toolbar" style={styles.toggle}>
        <ToolButton
          active={viewMode === 'grid'}
          icon="grid-outline"
          label="View wardrobe as grid"
          onPress={() => onChangeView('grid')}
          styles={styles}
          theme={theme}
        />
        <ToolButton
          active={viewMode === 'list'}
          icon="list-outline"
          label="View wardrobe as list"
          onPress={() => onChangeView('list')}
          styles={styles}
          theme={theme}
        />
      </View>
      <Pressable
        accessibilityLabel="Add clothes"
        accessibilityRole="button"
        onPress={onAdd}
        style={({ pressed }) => [styles.addButton, pressed ? styles.pressed : null]}
      >
        <Ionicons color={theme.colors.surface} name="add-outline" size={28} />
      </Pressable>
    </View>
  );
}

type ToolButtonProps = {
  active: boolean;
  icon:
    'close-outline' | 'grid-outline' | 'list-outline' | 'search-outline' | 'swap-vertical-outline';
  label: string;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  theme: AppTheme;
};

function ToolButton({ active, icon, label, onPress, styles, theme }: ToolButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.toolButton,
        active ? styles.toolButtonActive : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Ionicons color={active ? theme.colors.primary : theme.colors.text} name={icon} size={20} />
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    toolbar: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      justifyContent: 'flex-end',
    },
    toggle: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
    },
    toolButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    toolButtonActive: { backgroundColor: theme.colors.primarySoft },
    addButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      height: 48,
      justifyContent: 'center',
      marginLeft: theme.spacing.xs,
      width: 48,
    },
    pressed: { opacity: 0.64 },
  });
}
