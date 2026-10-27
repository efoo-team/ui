/*
 * Neutral variant behavior is adapted from MantineHub's shadcn theme:
 * https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import { defaultVariantColorsResolver, type VariantColorsResolver } from '@mantine/core';
import { getContrastColor } from './color-contrast';

export const efooVariantColorResolver: VariantColorsResolver = (input) => {
  const resolved = defaultVariantColorsResolver(input);
  const [parsedColorName, colorShade] = (input.color ?? input.theme.primaryColor).split('.');
  const colorName = parsedColorName ?? input.theme.primaryColor;
  const palette = input.theme.colors[colorName];
  const primaryShades =
    typeof input.theme.primaryShade === 'number'
      ? { light: input.theme.primaryShade, dark: input.theme.primaryShade }
      : input.theme.primaryShade;
  const hasSchemeAwareContrast =
    Array.isArray(palette) &&
    getContrastColor(
      palette[primaryShades.light] ?? palette[8] ?? '#18181b',
      input.theme.luminanceThreshold,
    ) !== undefined &&
    getContrastColor(
      palette[primaryShades.dark] ?? palette[8] ?? '#18181b',
      input.theme.luminanceThreshold,
    ) !== undefined;
  const isNeutral = input.color === undefined || colorName === 'zinc' || colorName === 'secondary';
  const isSchemeAwareFilledColor =
    input.variant === 'filled' &&
    (input.autoContrast ?? input.theme.autoContrast) &&
    colorShade === undefined &&
    hasSchemeAwareContrast;

  if (isSchemeAwareFilledColor) {
    return {
      ...resolved,
      color: `var(--mantine-color-${colorName}-contrast)`,
    };
  }

  if (
    input.variant === 'white' &&
    colorShade === undefined &&
    Array.isArray(palette) &&
    getContrastColor(palette[9] ?? '', input.theme.luminanceThreshold) ===
      'var(--mantine-color-white)'
  ) {
    return {
      ...resolved,
      color: `var(--mantine-color-${colorName}-9)`,
    };
  }

  if (!isNeutral || (input.variant !== 'light' && input.variant !== 'outline')) {
    return resolved;
  }

  return {
    ...resolved,
    background: input.variant === 'light' ? 'var(--mantine-color-default-hover)' : 'transparent',
    hover: 'var(--mantine-color-default-hover)',
    color: 'var(--mantine-color-text)',
    border:
      input.variant === 'outline'
        ? '1px solid var(--mantine-color-default-border)'
        : resolved.border,
  };
};
