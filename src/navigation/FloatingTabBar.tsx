import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Animated, Easing, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import { isMainTabRootRoute } from './navigationConfig';

const TAB_TRANSITION_DURATION_MS = 220;

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
  const [activePosition] = useState(() => new Animated.Value(state.index));
  const [tabListWidth, setTabListWidth] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const tabWidth = tabListWidth / state.routes.length;
  const translateX = activePosition.interpolate({
    inputRange: [0, state.routes.length - 1],
    outputRange: [0, Math.max(0, tabListWidth - tabWidth)],
  });

  useEffect(() => {
    activePosition.stopAnimation();
    Animated.timing(activePosition, {
      duration: TAB_TRANSITION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      toValue: state.index,
      useNativeDriver: true,
    }).start();
  }, [activePosition, state.index]);

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
      pointerEvents="box-none"
      style={[styles.safeAreaGap, { paddingBottom: insets.bottom + theme.spacing.sm }]}
    >
      <View
        accessibilityLabel="Main navigation"
        accessibilityRole="tablist"
        onLayout={(event) => setTabListWidth(event.nativeEvent.layout.width)}
        style={styles.tabList}
      >
        {tabWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.indicator, { transform: [{ translateX }], width: tabWidth }]}
            testID="main-navigation-active-indicator"
          >
            <View style={styles.indicatorLine} />
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          if (!descriptor) return null;

          const { options } = descriptor;
          const focused = state.index === index;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);
          const emphasis = activePosition.interpolate({
            extrapolate: 'clamp',
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.52, 1, 0.52],
          });
          const lift = activePosition.interpolate({
            extrapolate: 'clamp',
            inputRange: [index - 1, index, index + 1],
            outputRange: [0, -2, 0],
          });

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
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              key={route.key}
              onLongPress={handleLongPress}
              onPress={handlePress}
              style={({ pressed }) => [styles.tab, pressed ? styles.pressed : null]}
              testID={options.tabBarButtonTestID}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  { opacity: emphasis, transform: [{ translateY: lift }] },
                ]}
              >
                {options.tabBarIcon?.({
                  color: focused ? theme.colors.primary : theme.colors.textMuted,
                  focused,
                  size: 21,
                })}
                <Text style={[styles.label, focused ? styles.focusedLabel : null]}>{label}</Text>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeAreaGap: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    tabList: {
      ...theme.shadows.md,
      alignSelf: 'center',
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
      height: 68,
      maxWidth: 720,
      position: 'relative',
      width: '100%',
    },
    indicator: {
      alignItems: 'center',
      height: 2,
      left: 0,
      position: 'absolute',
      top: -1,
    },
    indicatorLine: {
      backgroundColor: theme.colors.primary,
      height: 2,
      width: '58%',
    },
    tab: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      minHeight: 64,
      minWidth: 0,
      paddingHorizontal: theme.spacing.xxs,
    },
    tabContent: {
      alignItems: 'center',
      gap: theme.spacing.xs,
      justifyContent: 'center',
    },
    label: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    focusedLabel: {
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    pressed: { opacity: 0.68 },
  });
}
