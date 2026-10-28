/*
 * Palette values adapted from MantineHub's shadcn theme:
 * https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import type { MantineColorsTuple } from '@mantine/core';

export const NEUTRAL_COLOR = 'zinc';

// Tailwind v4 zinc 50-900. zinc-950 is theme.black and the dark page background.
export const zincColors: MantineColorsTuple = [
  '#fafafa',
  '#f4f4f5',
  '#e4e4e7',
  '#d4d4d8',
  '#9f9fa9',
  '#71717b',
  '#52525c',
  '#3f3f46',
  '#27272a',
  '#18181b',
];

/*
 * Light-scheme roles of the shades that Mantine component CSS reads directly:
 * 0 hover surface (Combobox option, NavLink, CloseButton, Tabs, default-hover)
 * 1 Menu item hover, filled input, Pill
 * 2 dropdown border, disabled surface
 * 3 surface border (Paper, Card, Table, Tabs, AppShell), Skeleton, Switch off track
 * 4 input, Checkbox and Radio border, default-border
 * 5 placeholder, disabled text
 * 6 dimmed, Combobox chevron, Notification description
 * 7 CloseButton icon
 * 9 Notification title, Tooltip background
 */
export const grayColors: MantineColorsTuple = [
  '#f4f4f5',
  '#f4f4f5',
  '#e4e4e7',
  '#e4e4e7',
  '#e4e4e7',
  '#71717b',
  '#71717b',
  '#52525c',
  '#27272a',
  '#09090b',
];

/*
 * Dark-scheme roles of the shades that Mantine component CSS reads directly:
 * 0 text
 * 1 CloseButton icon, Switch track label
 * 2 dimmed
 * 3 placeholder, Combobox chevron
 * 4 border, Menu item hover, Skeleton (translucent so it stays visible on every surface)
 * 5 default-hover, filled input, Switch off track
 * 6 card and popover surface, input background
 * 7 page background
 * 8 surfaces Mantine draws below the page (SegmentedControl, pre)
 * 9 filled hover of color="dark"
 */
export const darkColors: MantineColorsTuple = [
  '#fafafa',
  '#d4d4d8',
  '#9f9fa9',
  '#9f9fa9',
  'rgba(255, 255, 255, 0.1)',
  '#27272a',
  '#18181b',
  '#09090b',
  '#18181b',
  '#27272a',
];

export const STATUS_COLORS = ['red', 'yellow', 'green', 'blue'] as const;
export type StatusColor = (typeof STATUS_COLORS)[number];

// Tailwind v4 50-900 for the colors used to show status.
export const redColors: MantineColorsTuple = [
  '#fef2f2',
  '#ffe2e2',
  '#ffc9c9',
  '#ffa2a2',
  '#ff6467',
  '#fb2c36',
  '#e7000b',
  '#c10007',
  '#9f0712',
  '#82181a',
];

export const yellowColors: MantineColorsTuple = [
  '#fefce8',
  '#fef9c2',
  '#fff085',
  '#ffdf20',
  '#fdc700',
  '#f0b100',
  '#d08700',
  '#a65f00',
  '#894b00',
  '#733e0a',
];

export const greenColors: MantineColorsTuple = [
  '#f0fdf4',
  '#dcfce7',
  '#b9f8cf',
  '#7bf1a8',
  '#05df72',
  '#00c950',
  '#00a63e',
  '#008236',
  '#016630',
  '#0d542b',
];

export const blueColors: MantineColorsTuple = [
  '#eff6ff',
  '#dbeafe',
  '#bedbff',
  '#8ec5ff',
  '#51a2ff',
  '#2b7fff',
  '#155dfc',
  '#1447e6',
  '#193cb8',
  '#1c398e',
];
