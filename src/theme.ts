/*
 * The default tokens and component styling are adapted from MantineHub's
 * shadcn theme: https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import {
  AppShell,
  Autocomplete,
  Badge,
  Button,
  Card,
  Checkbox,
  Combobox,
  createTheme,
  Drawer,
  Menu,
  Modal,
  MultiSelect,
  NavLink,
  Notification,
  NumberInput,
  PasswordInput,
  Popover,
  Radio,
  Select,
  Skeleton,
  Switch,
  Table,
  Tabs,
  Textarea,
  TextInput,
  Tooltip,
  type MantineThemeOverride,
  type TransitionProps,
} from '@mantine/core';
import { zincColors } from './colors';
import { efooCssVariablesResolver } from './css-variable-resolver';
import { efooVariantColorResolver } from './variant-color-resolver';
import appShellClasses from './styles/app-shell.module.css';
import badgeClasses from './styles/badge.module.css';
import buttonClasses from './styles/button.module.css';
import cardClasses from './styles/card.module.css';
import checkboxClasses from './styles/checkbox.module.css';
import drawerClasses from './styles/drawer.module.css';
import inputClasses from './styles/input.module.css';
import menuClasses from './styles/menu.module.css';
import modalClasses from './styles/modal.module.css';
import navLinkClasses from './styles/nav-link.module.css';
import notificationClasses from './styles/notification.module.css';
import popoverClasses from './styles/popover.module.css';
import radioClasses from './styles/radio.module.css';
import selectClasses from './styles/select.module.css';
import skeletonClasses from './styles/skeleton.module.css';
import switchClasses from './styles/switch.module.css';
import tableClasses from './styles/table.module.css';
import tabsClasses from './styles/tabs.module.css';
import tooltipClasses from './styles/tooltip.module.css';

const overlayTransition = {
  transition: 'pop',
  duration: 200,
  timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
} satisfies Partial<TransitionProps>;

const comboboxProps = {
  transitionProps: overlayTransition,
};

export const efooTheme: MantineThemeOverride = createTheme({
  colors: {
    zinc: zincColors,
    secondary: zincColors,
    dark: zincColors,
  },
  primaryColor: 'zinc',
  primaryShade: { light: 8, dark: 0 },
  autoContrast: true,
  luminanceThreshold: 0.3,
  respectReducedMotion: true,
  focusRing: 'auto',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '600',
  },
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  defaultRadius: 'sm',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.25rem', lineHeight: '2.5rem' },
      h2: { fontSize: '1.875rem', lineHeight: '2.25rem' },
      h3: { fontSize: '1.5rem', lineHeight: '2rem' },
      h4: { fontSize: '1.25rem', lineHeight: '1.75rem' },
    },
  },
  shadows: {
    xs: '0 1px 2px rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
    md: '0 4px 6px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.06)',
    lg: '0 10px 15px rgb(0 0 0 / 0.1), 0 4px 6px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px rgb(0 0 0 / 0.1), 0 10px 10px rgb(0 0 0 / 0.04)',
  },
  variantColorResolver: efooVariantColorResolver,
  components: {
    AppShell: AppShell.extend({
      classNames: { root: appShellClasses.root },
    }),
    Autocomplete: Autocomplete.extend({
      classNames: { root: selectClasses.root },
      defaultProps: { comboboxProps },
    }),
    Badge: Badge.extend({
      classNames: { root: badgeClasses.root },
    }),
    Button: Button.extend({
      classNames: { root: buttonClasses.root },
    }),
    Card: Card.extend({
      classNames: { root: cardClasses.root },
      defaultProps: { p: 'md', withBorder: true },
    }),
    Checkbox: Checkbox.extend({
      classNames: { root: checkboxClasses.root },
    }),
    Combobox: Combobox.extend({
      defaultProps: { transitionProps: overlayTransition },
    }),
    Drawer: Drawer.extend({
      classNames: { root: drawerClasses.root },
      defaultProps: { transitionProps: overlayTransition },
    }),
    Menu: Menu.extend({
      classNames: { dropdown: menuClasses.dropdown },
      defaultProps: { transitionProps: overlayTransition },
    }),
    Modal: Modal.extend({
      classNames: (_theme, props) => ({
        root: modalClasses.root,
        content: props.fullScreen ? modalClasses.fullScreenContent : modalClasses.content,
      }),
      defaultProps: { transitionProps: overlayTransition },
    }),
    MultiSelect: MultiSelect.extend({
      classNames: { root: selectClasses.root },
      defaultProps: { comboboxProps },
    }),
    NavLink: NavLink.extend({
      classNames: { root: navLinkClasses.root },
    }),
    Notification: Notification.extend({
      classNames: { root: notificationClasses.root },
      defaultProps: { withBorder: true },
    }),
    NumberInput: NumberInput.extend({
      classNames: { root: inputClasses.root },
    }),
    PasswordInput: PasswordInput.extend({
      classNames: { root: inputClasses.root },
    }),
    Popover: Popover.extend({
      classNames: { dropdown: popoverClasses.dropdown },
      defaultProps: { transitionProps: overlayTransition },
    }),
    Radio: Radio.extend({
      classNames: { root: radioClasses.root },
    }),
    Select: Select.extend({
      classNames: { root: selectClasses.root },
      defaultProps: {
        checkIconPosition: 'right',
        comboboxProps,
      },
    }),
    Skeleton: Skeleton.extend({
      classNames: { root: skeletonClasses.root },
    }),
    Switch: Switch.extend({
      classNames: { root: switchClasses.root },
      defaultProps: { withThumbIndicator: true },
    }),
    Table: Table.extend({
      classNames: { table: tableClasses.table },
    }),
    Tabs: Tabs.extend({
      classNames: { root: tabsClasses.root },
    }),
    Textarea: Textarea.extend({
      classNames: { root: inputClasses.root },
    }),
    TextInput: TextInput.extend({
      classNames: { root: inputClasses.root },
    }),
    Tooltip: Tooltip.extend({
      classNames: { tooltip: tooltipClasses.tooltip },
      defaultProps: { transitionProps: overlayTransition },
    }),
  },
});

export { efooCssVariablesResolver };
