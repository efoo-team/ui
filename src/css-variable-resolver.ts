/*
 * CSS variable names and light/dark token mapping are adapted from MantineHub's
 * shadcn theme: https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import type { CSSVariablesResolver } from '@mantine/core';
import { zincColors } from './colors';

function getContrastColor(hex: string, threshold: number): string {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const linearize = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  const luminance = 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);

  return luminance > threshold ? 'var(--mantine-color-black)' : 'var(--mantine-color-white)';
}

export const efooCssVariablesResolver: CSSVariablesResolver = (theme) => {
  const primaryPalette = theme.colors[theme.primaryColor] ?? theme.colors.zinc ?? zincColors;
  const primaryShades =
    typeof theme.primaryShade === 'number'
      ? { light: theme.primaryShade, dark: theme.primaryShade }
      : theme.primaryShade;
  const lightPrimary = primaryPalette[primaryShades.light] ?? primaryPalette[8] ?? '#18181b';
  const darkPrimary = primaryPalette[primaryShades.dark] ?? primaryPalette[0] ?? '#fafafa';

  return {
    variables: {
      '--efoo-motion-duration-fast': '120ms',
      '--efoo-motion-duration-standard': '200ms',
      '--efoo-motion-easing': 'cubic-bezier(0.16, 1, 0.3, 1)',
      '--mantine-heading-font-weight': '600',
    },
    light: {
      '--mantine-primary-color-contrast': getContrastColor(lightPrimary, theme.luminanceThreshold),
      '--mantine-color-text': 'var(--mantine-color-zinc-9)',
      '--mantine-color-body': 'var(--mantine-color-white)',
      '--mantine-color-error': 'var(--mantine-color-red-6)',
      '--mantine-color-placeholder': 'var(--mantine-color-zinc-5)',
      '--mantine-color-anchor': 'var(--mantine-color-zinc-9)',
      '--mantine-color-default': 'var(--mantine-color-white)',
      '--mantine-color-default-hover': 'var(--mantine-color-zinc-1)',
      '--mantine-color-default-color': 'var(--mantine-color-zinc-9)',
      '--mantine-color-default-border': 'var(--mantine-color-zinc-2)',
      '--mantine-color-dimmed': 'var(--mantine-color-zinc-6)',
      '--mantine-color-secondary-filled': 'var(--mantine-color-white)',
      '--mantine-color-secondary-filled-hover': 'var(--mantine-color-zinc-1)',
      '--mantine-color-secondary-outline': 'var(--mantine-color-zinc-2)',
      '--mantine-color-secondary-outline-hover': 'var(--mantine-color-zinc-1)',
      '--mantine-color-zinc-filled': 'var(--mantine-color-zinc-8)',
      '--mantine-color-zinc-filled-hover': 'var(--mantine-color-zinc-9)',
      '--mantine-color-zinc-light': 'var(--mantine-color-zinc-1)',
      '--mantine-color-zinc-light-hover': 'var(--mantine-color-zinc-2)',
      '--mantine-color-zinc-light-color': 'var(--mantine-color-zinc-9)',
      '--mantine-color-zinc-outline': 'var(--mantine-color-zinc-8)',
      '--mantine-color-zinc-outline-hover': 'var(--mantine-color-zinc-1)',
      '--mantine-color-zinc-contrast': getContrastColor(lightPrimary, theme.luminanceThreshold),
    },
    dark: {
      '--mantine-primary-color-contrast': getContrastColor(darkPrimary, theme.luminanceThreshold),
      '--mantine-color-text': 'var(--mantine-color-zinc-0)',
      '--mantine-color-body': 'var(--mantine-color-zinc-9)',
      '--mantine-color-error': 'var(--mantine-color-red-4)',
      '--mantine-color-placeholder': 'var(--mantine-color-zinc-4)',
      '--mantine-color-anchor': 'var(--mantine-color-zinc-3)',
      '--mantine-color-default': 'var(--mantine-color-zinc-9)',
      '--mantine-color-default-hover': 'var(--mantine-color-zinc-8)',
      '--mantine-color-default-color': 'var(--mantine-color-zinc-1)',
      '--mantine-color-default-border': 'var(--mantine-color-zinc-7)',
      '--mantine-color-dimmed': 'var(--mantine-color-zinc-4)',
      '--mantine-color-secondary-filled': 'var(--mantine-color-zinc-8)',
      '--mantine-color-secondary-filled-hover': 'var(--mantine-color-zinc-7)',
      '--mantine-color-secondary-outline': 'var(--mantine-color-zinc-7)',
      '--mantine-color-secondary-outline-hover': 'var(--mantine-color-zinc-8)',
      '--mantine-color-zinc-filled': 'var(--mantine-color-zinc-0)',
      '--mantine-color-zinc-filled-hover': 'var(--mantine-color-zinc-1)',
      '--mantine-color-zinc-light': 'var(--mantine-color-zinc-8)',
      '--mantine-color-zinc-light-hover': 'var(--mantine-color-zinc-7)',
      '--mantine-color-zinc-light-color': 'var(--mantine-color-zinc-0)',
      '--mantine-color-zinc-outline': 'var(--mantine-color-zinc-0)',
      '--mantine-color-zinc-outline-hover': 'var(--mantine-color-zinc-8)',
      '--mantine-color-zinc-contrast': getContrastColor(darkPrimary, theme.luminanceThreshold),
    },
  };
};
