/*
 * Neutral variant behavior is adapted from MantineHub's shadcn theme:
 * https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import {
  defaultVariantColorsResolver,
  parseThemeColor,
  type MantineTheme,
  type VariantColorsResolver,
} from '@mantine/core';
import { NEUTRAL_COLOR } from './colors.js';

export const ZINC_CONTRAST = `var(--mantine-color-${NEUTRAL_COLOR}-contrast, var(--mantine-color-white))`;

function isNeutralColor(theme: MantineTheme, color: string | undefined): boolean {
  const parsed = parseThemeColor({ color: color ?? theme.primaryColor, theme });
  return parsed.isThemeColor && parsed.color === NEUTRAL_COLOR && parsed.shade === undefined;
}

// The neutral filled color is light in the dark scheme, so text on it follows the scheme instead of Mantine's fixed white.
export function getZincContrast(
  theme: MantineTheme,
  color: string | undefined,
): string | undefined {
  return isNeutralColor(theme, color) ? ZINC_CONTRAST : undefined;
}

export const efooVariantColorResolver: VariantColorsResolver = (input) => {
  const resolved = defaultVariantColorsResolver(input);

  if (!isNeutralColor(input.theme, input.color)) {
    return resolved;
  }

  if (input.variant === 'filled') {
    return { ...resolved, color: ZINC_CONTRAST };
  }

  // Mantine colors the white variant with the filled color, which is light in the dark scheme.
  if (input.variant === 'white') {
    return { ...resolved, color: `var(--mantine-color-${NEUTRAL_COLOR}-9)` };
  }

  return resolved;
};
