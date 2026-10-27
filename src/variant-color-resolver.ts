/*
 * Neutral variant behavior is adapted from MantineHub's shadcn theme:
 * https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import { defaultVariantColorsResolver, type VariantColorsResolver } from '@mantine/core';

export const efooVariantColorResolver: VariantColorsResolver = (input) => {
  const resolved = defaultVariantColorsResolver(input);
  const color = input.color?.split('.')[0];
  const isNeutral = color === undefined || color === 'zinc' || color === 'secondary';

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
