/*
 * CSS variable names and light/dark token mapping are adapted from MantineHub's
 * shadcn theme: https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import type { CSSVariablesResolver } from '@mantine/core';
import { NEUTRAL_COLOR as z, STATUS_COLORS } from './colors.js';
import { motionCssVariables } from './motion.js';

// Mantine's dark filled hover is one shade darker; the status colors lighten instead, and their light variant text keeps the hue.
const darkStatusColors = Object.fromEntries(
  STATUS_COLORS.flatMap((color) => [
    [`--mantine-color-${color}-filled-hover`, `var(--mantine-color-${color}-7)`],
    [`--mantine-color-${color}-light-color`, `var(--mantine-color-${color}-3)`],
  ]),
);

// Returns only the differences from Mantine's default resolver, which Mantine deep-merges with this result.
export const efooCssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: { ...motionCssVariables },
  light: {
    [`--mantine-color-${z}-filled`]: `var(--mantine-color-${z}-9)`,
    [`--mantine-color-${z}-contrast`]: `var(--mantine-color-${z}-0)`,
    // red-6 is shadcn/ui's destructive and Mantine's light error color, so buttons, text and errors share one red.
    '--mantine-color-red-filled': 'var(--mantine-color-red-6)',
    '--mantine-color-red-filled-hover': 'var(--mantine-color-red-7)',
    '--mantine-color-red-outline': 'var(--mantine-color-red-6)',
    '--efoo-color-ring': `var(--mantine-color-${z}-4)`,
    '--efoo-color-tab-pills-text': 'var(--mantine-color-gray-7)',
    '--efoo-color-skeleton': 'var(--mantine-color-default-hover)',
    '--efoo-color-sidebar': `var(--mantine-color-${z}-0)`,
  },
  dark: {
    [`--mantine-color-${z}-filled`]: `var(--mantine-color-${z}-2)`,
    [`--mantine-color-${z}-filled-hover`]: `var(--mantine-color-${z}-3)`,
    [`--mantine-color-${z}-light`]: `var(--mantine-color-${z}-8)`,
    [`--mantine-color-${z}-light-hover`]: `var(--mantine-color-${z}-7)`,
    [`--mantine-color-${z}-contrast`]: `var(--mantine-color-${z}-9)`,
    ...(theme.primaryColor === z
      ? { '--mantine-primary-color-contrast': `var(--mantine-color-${z}-9)` }
      : {}),
    ...darkStatusColors,
    '--mantine-color-error': 'var(--mantine-color-red-4)',
    '--efoo-color-ring': `var(--mantine-color-${z}-5)`,
    '--efoo-color-sidebar': `var(--mantine-color-${z}-9)`,
    // shadcn/ui's dark outline surface: input (white 15%) at 30%, and at 50% on hover.
    '--efoo-color-outline-bg': 'color-mix(in srgb, white 4.5%, transparent)',
    '--efoo-color-outline-hover': 'color-mix(in srgb, white 7.5%, transparent)',
    '--efoo-color-tab-pills-active':
      'color-mix(in srgb, white 5%, var(--mantine-color-default-hover))',
  },
});
