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
import { NEUTRAL_COLOR, STATUS_COLORS } from './colors.js';

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

function isStatusColor(theme: MantineTheme, color: string | undefined): boolean {
  if (!color) return false;
  const parsed = parseThemeColor({ color, theme });
  return (
    parsed.isThemeColor &&
    parsed.shade === undefined &&
    (STATUS_COLORS as readonly string[]).includes(parsed.color)
  );
}

const statusContrast = (color: string) =>
  `var(--mantine-color-${color}-contrast, var(--mantine-color-white))`;

// Text on a filled surface of the color. Mantine writes white for components outside the variant resolver
// (Pagination, Chip, Stepper and others), which is unreadable on the light dark-scheme neutral fill.
export function getFilledContrast(
  theme: MantineTheme,
  color: string | undefined,
): string | undefined {
  if (isNeutralColor(theme, color)) return ZINC_CONTRAST;
  return color && isStatusColor(theme, color) ? statusContrast(color) : undefined;
}

export const efooVariantColorResolver: VariantColorsResolver = (input) => {
  const resolved = defaultVariantColorsResolver(input);
  const autoContrast = input.autoContrast ?? input.theme.autoContrast;

  // variant="default" is shadcn/ui's outline button (README): in dark it has the input line (white 15%) and the faint
  // outline surface instead of Mantine's card surface. The light scheme leaves --efoo-color-* undefined.
  if (input.variant === 'default') {
    return {
      ...resolved,
      background: 'var(--efoo-color-outline-bg, var(--mantine-color-default))',
      hover: 'var(--efoo-color-outline-hover, var(--mantine-color-default-hover))',
      border: '1px solid var(--efoo-color-input-border, var(--mantine-color-default-border))',
    };
  }

  // The status fill is not the primaryShade Mantine judges the text by; the resolver sets the text per scheme.
  if (input.variant === 'filled' && autoContrast && isStatusColor(input.theme, input.color)) {
    return { ...resolved, color: statusContrast(input.color as string) };
  }

  if (!isNeutralColor(input.theme, input.color)) {
    return resolved;
  }

  if (input.variant === 'filled') {
    return { ...resolved, color: ZINC_CONTRAST };
  }

  // shadcn/ui's outline uses the input line, the body text and the accent hover instead of the filled color.
  // The dark scheme adds a faint surface (--efoo-color-outline-*); the light scheme leaves them undefined.
  if (input.variant === 'outline') {
    return {
      ...resolved,
      background: 'var(--efoo-color-outline-bg, transparent)',
      border: '1px solid var(--efoo-color-input-border, var(--mantine-color-default-border))',
      color: 'var(--mantine-color-text)',
      hover: 'var(--efoo-color-outline-hover, var(--mantine-color-default-hover))',
    };
  }

  // Mantine colors the white variant with the filled color, which is light in the dark scheme.
  if (input.variant === 'white') {
    return { ...resolved, color: `var(--mantine-color-${NEUTRAL_COLOR}-9)` };
  }

  return resolved;
};
