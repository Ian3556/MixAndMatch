import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import type { TabIconKey } from './navigationConfig';

export const STYLIST_ICON_PATHS = [
  'M21 13.5V10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.122-2.122C18.396 6 17.93 6 17 6m-3.5 15H9c-2.828 0-4.243 0-5.121-.879C3 19.243 3 17.828 3 15v-5c0-.93 0-1.395.102-1.776a3 3 0 0 1 2.122-2.122C5.605 6 6.07 6 7 6',
  'M14.224 9.89L12 9l-2.224.89a1.54 1.54 0 0 1-2.068-1.057L7 6l.772-2.316A1 1 0 0 1 8.721 3h6.558a1 1 0 0 1 .949.684L17 6l-.708 2.833a1.54 1.54 0 0 1-2.068 1.057M12 9l4-5.5M12 9L8 3.5M12 9v5m7.5 3.938V19.5m0 0v1.563m0-1.563h-1.25m1.25 0h1.25m1.25 0l-1.084-.361a1.67 1.67 0 0 1-1.055-1.055L19.5 17l-.361 1.084a1.67 1.67 0 0 1-1.055 1.055L17 19.5l1.084.361c.498.166.889.557 1.055 1.055L19.5 22l.361-1.084a1.67 1.67 0 0 1 1.055-1.055z',
] as const;

export const WARDROBE_ICON_PATH =
  'M6 2a2 2 0 0 0-2 2v15c0 1.11.89 2 2 2v1h2v-1h8v1h2v-1c1.11 0 2-.89 2-2V4a2 2 0 0 0-2-2zm0 2h5v15H6zm7 0h5v15h-5zm-5 6v3h2v-3zm6 0v3h2v-3z';

const ioniconNames = {
  home: 'home-outline',
  explore: 'search-outline',
  profile: 'person-outline',
} as const;

export function TabBarIcon({
  icon,
  color,
  size,
}: {
  icon: TabIconKey;
  color: string;
  size: number;
}) {
  const normalizedSize = Math.min(24, Math.max(22, size));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.shell}
    >
      {icon === 'stylist' ? (
        <Svg color={color} height={24} viewBox="0 0 24 24" width={24}>
          <Path d="M0 0h24v24H0z" fill="none" />
          <G
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          >
            {STYLIST_ICON_PATHS.map((path) => (
              <Path d={path} key={path} />
            ))}
          </G>
        </Svg>
      ) : icon === 'wardrobe' ? (
        <Svg color={color} height={23} viewBox="0 0 24 24" width={23}>
          <Path d="M0 0h24v24H0z" fill="none" />
          <Path d={WARDROBE_ICON_PATH} fill="currentColor" />
        </Svg>
      ) : (
        <Ionicons color={color} name={ioniconNames[icon]} size={normalizedSize} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
});
