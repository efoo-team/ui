import { isLightColor, luminance } from '@mantine/core';

const hexColorPattern = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const hslColorPattern =
  /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*(0?\.\d+|\d+(\.\d+)?))?\s*\)$/i;

function hasSupportedLuminance(color: string): boolean {
  const normalized = color.trim().toLowerCase();

  if (normalized === 'white' || normalized === 'black' || hexColorPattern.test(normalized)) {
    return true;
  }

  if (hslColorPattern.test(normalized)) {
    return true;
  }

  const rgb = normalized.match(/^rgba?\((.*)\)$/i);
  if (!rgb) {
    return false;
  }

  const channels = (rgb[1] ?? '')
    .replace(/[^0-9,./]/g, '')
    .split(/[/,]/)
    .map(Number);

  return channels.length >= 3 && channels.slice(0, 3).every(Number.isFinite);
}

export function getContrastColor(color: string, threshold: number): string | undefined {
  const normalized = color.trim().toLowerCase();

  if (normalized === 'white') {
    return 'var(--mantine-color-black)';
  }

  if (normalized === 'black') {
    return 'var(--mantine-color-white)';
  }

  if (!hasSupportedLuminance(color) || !Number.isFinite(luminance(color))) {
    return undefined;
  }

  return isLightColor(color, threshold)
    ? 'var(--mantine-color-black)'
    : 'var(--mantine-color-white)';
}
