import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ActionButton } from '@/components/ActionButton';
import { outfitConcepts } from '@/fixtures/outfits';

import { OutfitCard } from './OutfitCard';
import { SettingRow } from './SettingRow';

const { testTheme, useAppThemeMock } = vi.hoisted(() => {
  const theme = {
    isDark: false,
    preference: 'system',
    setPreference: vi.fn(),
    colors: {
      background: '#fff',
      surface: '#fff',
      surfaceElevated: '#fff',
      surfaceMuted: '#eee',
      text: '#111',
      textMuted: '#666',
      primary: '#5544cc',
      primaryPressed: '#332299',
      primarySoft: '#eeebff',
      border: '#ddd',
      success: '#070',
      warning: '#970',
      danger: '#c22',
      overlay: '#0008',
    },
    spacing: { none: 0, xxs: 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },
    typography: {
      fontFamily: { regular: 'System', medium: 'System', bold: 'System' },
      fontSize: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40 },
      lineHeight: { xs: 16, sm: 20, md: 24, lg: 28, xl: 32, xxl: 40, xxxl: 48 },
      fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    },
    radii: { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, full: 999 },
    shadows: { none: {}, sm: {}, md: {}, lg: {} },
    navigationTheme: {},
  };

  return { testTheme: theme, useAppThemeMock: vi.fn(() => theme) };
});

vi.mock('react-native', () => ({
  ActivityIndicator: 'ActivityIndicator',
  Pressable: 'Pressable',
  Text: 'Text',
  View: 'View',
  StyleSheet: { create: <T,>(styles: T) => styles, hairlineWidth: 1 },
}));

vi.mock('@/theme', () => ({ useAppTheme: useAppThemeMock }));

function element(node: ReactNode): ReactElement<Record<string, unknown>> {
  if (!isValidElement<Record<string, unknown>>(node)) throw new Error('Expected a React element.');
  return node;
}

describe('reusable component contracts', () => {
  beforeEach(() => {
    useAppThemeMock.mockReturnValue(testTheme);
  });

  it('exposes enabled, disabled, and busy state on buttons', () => {
    const onPress = vi.fn();
    const enabled = element(ActionButton({ label: 'Continue', onPress }));
    expect(enabled.props.accessibilityRole).toBe('button');
    expect(enabled.props.accessibilityState).toEqual({ disabled: false, busy: false });

    const disabled = element(ActionButton({ label: 'Continue', onPress, disabled: true }));
    expect(disabled.props.disabled).toBe(true);
    expect(disabled.props.accessibilityState).toEqual({ disabled: true, busy: false });

    const loading = element(ActionButton({ label: 'Continue', onPress, loading: true }));
    expect(loading.props.disabled).toBe(true);
    expect(loading.props.accessibilityState).toEqual({ disabled: true, busy: true });
  });

  it('renders setting labels and values with an accessible action contract', () => {
    const onPress = vi.fn();
    const row = element(SettingRow({ label: 'Appearance', value: 'System', onPress }));
    expect(row.props.accessibilityLabel).toBe('Appearance');
    expect(row.props.accessibilityRole).toBe('button');
    expect(row.props.onPress).toBe(onPress);
  });

  it('renders fixture outfit content and fires the open action', () => {
    const outfit = outfitConcepts[0];
    expect(outfit).toBeDefined();
    if (!outfit) return;
    const onPress = vi.fn();
    const card = element(OutfitCard({ outfit, onPress }));
    expect(card.props.accessibilityLabel).toContain(outfit.name);
    expect(card.props.onPress).toBe(onPress);
  });

  it('creates component styles for both light and dark theme variants', () => {
    expect(() => SettingRow({ label: 'Theme', value: 'Light' })).not.toThrow();
    useAppThemeMock.mockReturnValue({ ...testTheme, isDark: true });
    expect(() => SettingRow({ label: 'Theme', value: 'Dark' })).not.toThrow();
  });
});
