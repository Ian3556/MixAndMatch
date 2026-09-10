import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import { isMainTabRootRoute } from './navigationConfig';

export function FloatingTabBar(props: BottomTabBarProps) {
  const focusedTabRoute = props.state.routes[props.state.index];
  if (!focusedTabRoute) return null;

  const focusedNestedRouteName = getFocusedRouteNameFromRoute(focusedTabRoute);

  if (!isMainTabRootRoute(focusedTabRoute.name, focusedNestedRouteName)) return null;

  return <VisibleFloatingTabBar {...props} />;
}

function VisibleFloatingTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View
      accessibilityLabel="Main navigation"
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.tabList}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          if (!descriptor) return null;

          const { options } = descriptor;
          const focused = state.index === index;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const handlePress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress',
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const handleLongPress = () =>
            navigation.emit({ target: route.key, type: 'tabLongPress' });

          return (
            <Pressable
              aria-selected={focused}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              key={route.key}
              onLongPress={handleLongPress}
              onPress={handlePress}
              style={({ pressed }) => [styles.tab, pressed ? styles.pressed : null]}
              testID={options.tabBarButtonTestID}
            >
              {focused ? (
                <View
                  pointerEvents="none"
                  style={styles.indicator}
                  testID="main-navigation-active-indicator"
                />
              ) : null}
              <View style={styles.iconSlot}>
                {options.tabBarIcon?.({
                  color: focused ? theme.colors.text : theme.colors.textMuted,
                  focused,
                  size: 24,
                })}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    bar: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    tabList: {
      flexDirection: 'row',
      height: 60,
      width: '100%',
    },
    indicator: {
      backgroundColor: theme.colors.text,
      height: 2,
      position: 'absolute',
      top: 0,
      width: 28,
    },
    tab: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      minHeight: 60,
      minWidth: 0,
    },
    iconSlot: {
      alignItems: 'center',
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    pressed: { opacity: 0.68 },
  });
}
