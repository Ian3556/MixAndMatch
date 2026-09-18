import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { CatalogFilterOptions, CatalogProductFilters } from '@/catalog/browseTypes';
import { ActionButton } from '@/components/ActionButton';
import { Chip } from '@/components/ui/Chip';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  filters: CatalogProductFilters;
  options: CatalogFilterOptions;
  onChange: (filters: CatalogProductFilters) => void;
  onClear: () => void;
};

const SORT_OPTIONS: { label: string; value: CatalogProductFilters['sort'] }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price low–high', value: 'price_asc' },
  { label: 'Price high–low', value: 'price_desc' },
  { label: 'Name', value: 'name' },
];

export function CatalogFilterPanel({ filters, options, onChange, onClear }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View accessibilityLabel="Product filters" style={styles.panel}>
      <FilterSection label="Sort">
        {SORT_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            onPress={() => onChange({ ...filters, sort: option.value })}
            selected={filters.sort === option.value}
            square
          />
        ))}
      </FilterSection>

      {options.genders.length > 0 ? (
        <FilterSection label="Gender">
          {options.genders.map((gender) => (
            <Chip
              key={gender}
              label={formatLabel(gender)}
              onPress={() =>
                onChange({ ...filters, gender: filters.gender === gender ? null : gender })
              }
              selected={filters.gender === gender}
              square
            />
          ))}
        </FilterSection>
      ) : null}

      {options.colorFamilies.length > 0 ? (
        <FilterSection label="Colour">
          {options.colorFamilies.map((color) => (
            <Chip
              key={color}
              label={color}
              onPress={() =>
                onChange({ ...filters, colorFamily: filters.colorFamily === color ? null : color })
              }
              selected={filters.colorFamily === color}
              square
            />
          ))}
        </FilterSection>
      ) : null}

      {options.sizes.length > 0 ? (
        <FilterSection label="Size">
          {options.sizes.map((size) => (
            <Chip
              key={size}
              label={size}
              onPress={() => onChange({ ...filters, size: filters.size === size ? null : size })}
              selected={filters.size === size}
              square
            />
          ))}
        </FilterSection>
      ) : null}

      {options.styleTags.length > 0 ? (
        <FilterSection label="Style">
          {options.styleTags.map((style) => {
            const selected = filters.styleTags.includes(style);
            return (
              <Chip
                key={style}
                label={formatLabel(style)}
                onPress={() =>
                  onChange({
                    ...filters,
                    styleTags: selected
                      ? filters.styleTags.filter((entry) => entry !== style)
                      : [...filters.styleTags, style],
                  })
                }
                selected={selected}
                square
              />
            );
          })}
        </FilterSection>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.label}>Price · MYR</Text>
        <View style={styles.priceRow}>
          <TextInput
            accessibilityLabel="Minimum price"
            keyboardType="numeric"
            onChangeText={(value) => onChange({ ...filters, minimumPrice: parsePrice(value) })}
            placeholder={options.minimumPrice === null ? 'Minimum' : String(options.minimumPrice)}
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            value={filters.minimumPrice === null ? '' : String(filters.minimumPrice)}
          />
          <Text style={styles.priceSeparator}>to</Text>
          <TextInput
            accessibilityLabel="Maximum price"
            keyboardType="numeric"
            onChangeText={(value) => onChange({ ...filters, maximumPrice: parsePrice(value) })}
            placeholder={options.maximumPrice === null ? 'Maximum' : String(options.maximumPrice)}
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            value={filters.maximumPrice === null ? '' : String(filters.maximumPrice)}
          />
        </View>
      </View>

      <ActionButton label="Clear filters" onPress={onClear} variant="text" />
    </View>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

function parsePrice(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function formatLabel(value: string): string {
  return value
    .split('_')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    panel: {
      borderBottomColor: theme.colors.border,
      borderTopColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    section: { gap: theme.spacing.sm },
    label: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    priceRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    input: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      color: theme.colors.text,
      flex: 1,
      minHeight: 48,
      paddingHorizontal: theme.spacing.md,
    },
    priceSeparator: { color: theme.colors.textMuted },
  });
}
