/*
 * CSS variable names and light/dark token mapping are adapted from MantineHub's
 * shadcn theme: https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import type { CSSVariablesResolver } from '@mantine/core';
import { NEUTRAL_COLOR as z } from './colors.js';
import { motionCssVariables } from './motion.js';

// Returns only the differences from Mantine's default resolver, which Mantine deep-merges with this result.
export const efooCssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: { ...motionCssVariables },
  light: {
    [`--mantine-color-${z}-filled`]: `var(--mantine-color-${z}-9)`,
    [`--mantine-color-${z}-contrast`]: `var(--mantine-color-${z}-0)`,
    '--efoo-color-ring': `var(--mantine-color-${z}-4)`,
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
    '--mantine-color-error': 'var(--mantine-color-red-4)',
    '--efoo-color-ring': `var(--mantine-color-${z}-5)`,
  },
});
