import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Storybook's own frame uses neutral zinc like the theme, so only the stories show color.
// It follows the OS color scheme when the page loads; the toolbar switch changes the stories only.
const fontBase = 'Inter, system-ui, sans-serif';
const fontCode = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const light = create({
  base: 'light',
  brandTitle: 'efoo UI',
  colorPrimary: '#18181b',
  colorSecondary: '#18181b',
  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appHoverBg: '#f4f4f5',
  appBorderColor: '#e4e4e7',
  appBorderRadius: 10,
  fontBase,
  fontCode,
  textColor: '#09090b',
  textInverseColor: '#fafafa',
  textMutedColor: '#71717b',
  barTextColor: '#71717b',
  barHoverColor: '#09090b',
  barSelectedColor: '#09090b',
  barBg: '#ffffff',
  buttonBg: '#ffffff',
  buttonBorder: '#e4e4e7',
  booleanBg: '#f4f4f5',
  booleanSelectedBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#e4e4e7',
  inputTextColor: '#09090b',
  inputBorderRadius: 10,
});

const dark = create({
  base: 'dark',
  brandTitle: 'efoo UI',
  colorPrimary: '#e4e4e7',
  colorSecondary: '#52525c',
  appBg: '#18181b',
  appContentBg: '#09090b',
  appPreviewBg: '#09090b',
  appHoverBg: '#27272a',
  appBorderColor: 'rgba(255, 255, 255, 0.1)',
  appBorderRadius: 10,
  fontBase,
  fontCode,
  textColor: '#fafafa',
  textInverseColor: '#18181b',
  textMutedColor: '#9f9fa9',
  barTextColor: '#9f9fa9',
  barHoverColor: '#fafafa',
  barSelectedColor: '#fafafa',
  barBg: '#09090b',
  buttonBg: '#18181b',
  buttonBorder: 'rgba(255, 255, 255, 0.15)',
  booleanBg: '#27272a',
  booleanSelectedBg: '#3f3f46',
  inputBg: '#18181b',
  inputBorder: 'rgba(255, 255, 255, 0.15)',
  inputTextColor: '#fafafa',
  inputBorderRadius: 10,
});

addons.setConfig({
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light,
});
