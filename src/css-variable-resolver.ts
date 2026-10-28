/*
 * CSS variable names and light/dark token mapping are adapted from MantineHub's
 * shadcn theme: https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import { isLightColor, type CSSVariablesResolver, type MantineTheme } from '@mantine/core';
import { NEUTRAL_COLOR as z, STATUS_COLORS, type StatusColor } from './colors.js';
import { motionCssVariables } from './motion.js';

/*
 * Status colors follow shadcn/ui's destructive: the light-scheme fill is the 600 shade (yellow 500, which reads as
 * yellow rather than ochre and takes black text), and the light variant is
 * the fill at 10% (20% in dark) behind colored text. The light-scheme text takes the lightest shade that keeps
 * 4.5:1 on that tint (600 falls to 2.7-4.0:1 for red, green and yellow), and colored text on the page
 * (Mantine's -text, which otherwise follows the fill) takes the lightest shade that keeps 4.5:1 on white.
 */
const LIGHT_FILLED_SHADE: Record<StatusColor, number> = { red: 6, yellow: 5, green: 6, blue: 6 };
const LIGHT_TEXT_SHADE: Record<StatusColor, number> = { red: 7, yellow: 8, green: 8, blue: 7 };
const LIGHT_PAGE_TEXT_SHADE: Record<StatusColor, number> = { red: 6, yellow: 7, green: 7, blue: 6 };
const DARK_TEXT_SHADE = 4;

// Mantine picks black or white text from the primaryShade; the fill here is another shade, so the text follows the fill.
function getContrast(theme: MantineTheme, color: StatusColor, shade: number) {
  const value = theme.colors[color][shade];
  return value && isLightColor(value, theme.luminanceThreshold)
    ? 'var(--mantine-color-black)'
    : 'var(--mantine-color-white)';
}

const lightStatusColors = (theme: MantineTheme) =>
  Object.fromEntries(
    STATUS_COLORS.flatMap((color) => [
      [
        `--mantine-color-${color}-filled`,
        `var(--mantine-color-${color}-${LIGHT_FILLED_SHADE[color]})`,
      ],
      [
        `--mantine-color-${color}-filled-hover`,
        `var(--mantine-color-${color}-${LIGHT_FILLED_SHADE[color] + 1})`,
      ],
      [`--mantine-color-${color}-contrast`, getContrast(theme, color, LIGHT_FILLED_SHADE[color])],
      [
        `--mantine-color-${color}-text`,
        `var(--mantine-color-${color}-${LIGHT_PAGE_TEXT_SHADE[color]})`,
      ],
      [
        `--mantine-color-${color}-light`,
        `color-mix(in srgb, var(--mantine-color-${color}-filled) 10%, transparent)`,
      ],
      [
        `--mantine-color-${color}-light-hover`,
        `color-mix(in srgb, var(--mantine-color-${color}-filled) 15%, transparent)`,
      ],
      [
        `--mantine-color-${color}-light-color`,
        `var(--mantine-color-${color}-${LIGHT_TEXT_SHADE[color]})`,
      ],
    ]),
  );

/*
 * The dark scheme fills with the same shades as light, so yellow stays yellow instead of Mantine's brown 800.
 * Red keeps the 800 of the destructive button. The hover lightens one shade instead of Mantine's darker one.
 */
const DARK_FILLED_SHADE: Record<StatusColor, number> = { red: 8, yellow: 5, green: 6, blue: 6 };

const darkStatusColors = (theme: MantineTheme) =>
  Object.fromEntries(
    STATUS_COLORS.flatMap((color) => [
      [
        `--mantine-color-${color}-filled`,
        `var(--mantine-color-${color}-${DARK_FILLED_SHADE[color]})`,
      ],
      [
        `--mantine-color-${color}-filled-hover`,
        `var(--mantine-color-${color}-${DARK_FILLED_SHADE[color] - 1})`,
      ],
      [`--mantine-color-${color}-contrast`, getContrast(theme, color, DARK_FILLED_SHADE[color])],
      [
        `--mantine-color-${color}-light`,
        `color-mix(in srgb, var(--mantine-color-${color}-${DARK_TEXT_SHADE}) 20%, transparent)`,
      ],
      [
        `--mantine-color-${color}-light-hover`,
        `color-mix(in srgb, var(--mantine-color-${color}-${DARK_TEXT_SHADE}) 30%, transparent)`,
      ],
      [`--mantine-color-${color}-light-color`, `var(--mantine-color-${color}-${DARK_TEXT_SHADE})`],
    ]),
  );

// The neutral primary makes links a gray close to the text; shadcn/ui's links are the text color.
const neutralAnchor = (theme: MantineTheme): Record<string, string> =>
  theme.primaryColor === z ? { '--mantine-color-anchor': 'var(--mantine-color-text)' } : {};

// shadcn/ui's --chart-1..5: shades of blue, the same in both schemes. Each scheme sets them so a service can split them.
const chartColors = Object.fromEntries(
  [3, 5, 6, 7, 8].map((shade, index) => [
    `--efoo-chart-${index + 1}`,
    `var(--mantine-color-blue-${shade})`,
  ]),
);

// Returns only the differences from Mantine's default resolver, which Mantine deep-merges with this result.
export const efooCssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: { ...motionCssVariables },
  light: {
    ...neutralAnchor(theme),
    ...chartColors,
    [`--mantine-color-${z}-filled`]: `var(--mantine-color-${z}-9)`,
    [`--mantine-color-${z}-contrast`]: `var(--mantine-color-${z}-0)`,
    ...lightStatusColors(theme),
    // red-6 is shadcn/ui's destructive and Mantine's light error color, so buttons, text and errors share one red.
    '--mantine-color-red-outline': 'var(--mantine-color-red-6)',
    '--efoo-color-ring': `var(--mantine-color-${z}-4)`,
    '--efoo-color-tab-pills-text': 'var(--mantine-color-gray-7)',
    '--efoo-color-skeleton': 'var(--mantine-color-default-hover)',
    '--efoo-color-sidebar': `var(--mantine-color-${z}-0)`,
  },
  dark: {
    ...neutralAnchor(theme),
    ...chartColors,
    [`--mantine-color-${z}-filled`]: `var(--mantine-color-${z}-2)`,
    [`--mantine-color-${z}-filled-hover`]: `var(--mantine-color-${z}-3)`,
    [`--mantine-color-${z}-light`]: `var(--mantine-color-${z}-8)`,
    [`--mantine-color-${z}-light-hover`]: `var(--mantine-color-${z}-7)`,
    [`--mantine-color-${z}-contrast`]: `var(--mantine-color-${z}-9)`,
    ...(theme.primaryColor === z
      ? { '--mantine-primary-color-contrast': `var(--mantine-color-${z}-9)` }
      : {}),
    ...darkStatusColors(theme),
    '--mantine-color-error': 'var(--mantine-color-red-4)',
    '--efoo-color-ring': `var(--mantine-color-${z}-5)`,
    '--efoo-color-sidebar': `var(--mantine-color-${z}-9)`,
    // shadcn/ui's skeleton is the accent surface, #404040 in dashboard-01; white 10% vanishes on a Card.
    '--efoo-color-skeleton': `var(--mantine-color-${z}-7)`,
    // shadcn/ui's dark input line is white 15%; other surfaces keep white 10%.
    '--efoo-color-input-border': 'rgba(255, 255, 255, 0.15)',
    // shadcn/ui's dark outline surface: input (white 15%) at 30%, and at 50% on hover.
    '--efoo-color-outline-bg': 'color-mix(in srgb, white 4.5%, transparent)',
    '--efoo-color-outline-hover': 'color-mix(in srgb, white 7.5%, transparent)',
    '--efoo-color-tab-pills-active':
      'color-mix(in srgb, white 5%, var(--mantine-color-default-hover))',
  },
});
