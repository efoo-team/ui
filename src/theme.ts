/*
 * The default tokens and component styling are adapted from MantineHub's
 * shadcn theme: https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxIndicator,
  Combobox,
  createTheme,
  Drawer,
  Input,
  InputWrapper,
  Menu,
  Modal,
  MultiSelect,
  NavLink,
  Notification,
  parseThemeColor,
  PasswordInput,
  Pill,
  Popover,
  Radio,
  RadioGroup,
  RadioIndicator,
  Select,
  Skeleton,
  Switch,
  Table,
  Tabs,
  ThemeIcon,
  Tooltip,
  type MantineTheme,
  type MantineThemeOverride,
} from '@mantine/core';
import {
  blueColors,
  darkColors,
  grayColors,
  greenColors,
  NEUTRAL_COLOR,
  redColors,
  yellowColors,
  zincColors,
} from './colors.js';
import { drawerTransitionProps, modalTransitionProps, overlayTransitionProps } from './motion.js';
import { efooVariantColorResolver, getZincContrast } from './variant-color-resolver.js';
// Imported before the other styles so that dist/styles.css starts with the layer order.
import baseClasses from './styles/base.module.css';
import actionIconClasses from './styles/action-icon.module.css';
import badgeClasses from './styles/badge.module.css';
import buttonClasses from './styles/button.module.css';
import checkboxClasses from './styles/checkbox.module.css';
import drawerClasses from './styles/drawer.module.css';
import inlineInputClasses from './styles/inline-input.module.css';
import inputClasses from './styles/input.module.css';
import menuClasses from './styles/menu.module.css';
import modalClasses from './styles/modal.module.css';
import navLinkClasses from './styles/nav-link.module.css';
import notificationClasses from './styles/notification.module.css';
import notificationsClasses from './styles/notifications.module.css';
import pillClasses from './styles/pill.module.css';
import radioClasses from './styles/radio.module.css';
import selectClasses from './styles/select.module.css';
import skeletonClasses from './styles/skeleton.module.css';
import switchClasses from './styles/switch.module.css';
import tableClasses from './styles/table.module.css';
import tabsClasses from './styles/tabs.module.css';
import tooltipClasses from './styles/tooltip.module.css';

interface IconColorProps {
  color?: string;
  iconColor?: string;
  variant?: string;
}

// Mantine computes the check and dot color without the color scheme and writes white inline.
function getCheckboxIconColor(theme: MantineTheme, props: IconColorProps) {
  if (props.iconColor) return undefined;
  if (props.variant === 'outline') return 'var(--checkbox-color)';
  return props.variant === 'light' ? undefined : getZincContrast(theme, props.color);
}

function getRadioIconColor(theme: MantineTheme, props: IconColorProps) {
  if (props.iconColor || (props.variant !== undefined && props.variant !== 'filled')) {
    return undefined;
  }
  return getZincContrast(theme, props.color);
}

// The dark filled shade is too dark for the thin bar on the dark surface. The outline color is each scheme's line color.
function getNotificationBarColor(theme: MantineTheme, color: string | undefined) {
  if (!color) return undefined;
  const parsed = parseThemeColor({ color, theme });
  return parsed.isThemeColor && parsed.shade === undefined && parsed.color !== NEUTRAL_COLOR
    ? `var(--mantine-color-${parsed.color}-outline)`
    : undefined;
}

const comboboxClassNames = { options: selectClasses.options, option: selectClasses.option };

const overlayProps = { backgroundOpacity: 0.15, blur: 4 };

export const efooTheme: MantineThemeOverride = createTheme({
  colors: {
    zinc: zincColors,
    gray: grayColors,
    dark: darkColors,
    red: redColors,
    yellow: yellowColors,
    green: greenColors,
    blue: blueColors,
  },
  black: '#09090b',
  primaryColor: 'zinc',
  primaryShade: { light: 7, dark: 8 },
  autoContrast: true,
  luminanceThreshold: 0.179,
  respectReducedMotion: true,
  focusClassName: baseClasses.focus,
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
    ActionIcon: ActionIcon.extend({ classNames: { root: actionIconClasses.root } }),
    Autocomplete: Autocomplete.extend({ classNames: comboboxClassNames }),
    // Without a variant Mantine leaves the text color to its CSS default (white), which is unreadable on the dark-scheme neutral fill.
    Badge: Badge.extend({
      classNames: { root: badgeClasses.root },
      defaultProps: { variant: 'filled' },
    }),
    Button: Button.extend({
      classNames: { root: buttonClasses.root, section: buttonClasses.section },
    }),
    Card: Card.extend({ defaultProps: { withBorder: true } }),
    Checkbox: Checkbox.extend({
      classNames: {
        root: checkboxClasses.root,
        inner: checkboxClasses.inner,
        input: checkboxClasses.input,
        icon: checkboxClasses.icon,
        label: inlineInputClasses.label,
      },
      defaultProps: { radius: 'xs' },
      vars: (theme, props) => ({
        root: { '--checkbox-icon-color': getCheckboxIconColor(theme, props) },
      }),
    }),
    CheckboxIndicator: CheckboxIndicator.extend({
      defaultProps: { radius: 'xs' },
      vars: (theme, props) => ({
        indicator: { '--checkbox-icon-color': getCheckboxIconColor(theme, props) },
      }),
    }),
    Combobox: Combobox.extend({ defaultProps: { transitionProps: overlayTransitionProps } }),
    Drawer: Drawer.extend({
      classNames: (_theme, props) => ({
        inner: drawerClasses.inner,
        content:
          props.position === 'right'
            ? drawerClasses.contentRight
            : props.position === 'top'
              ? drawerClasses.contentTop
              : props.position === 'bottom'
                ? drawerClasses.contentBottom
                : drawerClasses.contentLeft,
        title: drawerClasses.title,
        close: drawerClasses.close,
      }),
      defaultProps: { transitionProps: drawerTransitionProps, overlayProps, shadow: 'lg' },
    }),
    Input: Input.extend({
      classNames: { wrapper: inputClasses.wrapper, input: inputClasses.input },
    }),
    InputWrapper: InputWrapper.extend({
      classNames: {
        label: inputClasses.label,
        description: inputClasses.description,
        error: inputClasses.error,
      },
    }),
    Menu: Menu.extend({ classNames: { item: menuClasses.item } }),
    Modal: Modal.extend({
      classNames: {
        inner: modalClasses.inner,
        content: modalClasses.content,
        title: modalClasses.title,
        close: modalClasses.close,
      },
      defaultProps: { transitionProps: modalTransitionProps, overlayProps },
    }),
    MultiSelect: MultiSelect.extend({ classNames: comboboxClassNames }),
    NavLink: NavLink.extend({
      classNames: { root: navLinkClasses.root, children: navLinkClasses.children },
    }),
    Notification: Notification.extend({
      classNames: { root: notificationClasses.root, closeButton: notificationClasses.closeButton },
      styles: (theme, props) => ({
        root: { '--efoo-notification-bar': getNotificationBarColor(theme, props.color) },
      }),
      defaultProps: { withBorder: true },
    }),
    PasswordInput: PasswordInput.extend({
      classNames: { visibilityToggle: inputClasses.visibilityToggle },
      defaultProps: {
        visibilityToggleFocusable: true,
        // Mantine's label is English. The button reports shown or hidden through aria-pressed.
        visibilityToggleButtonProps: { 'aria-label': 'パスワードを表示' },
      },
    }),
    // @mantine/notifications is optional for services, so the theme refers to it by name instead of importing it.
    Notifications: { classNames: { notification: notificationsClasses.notification } },
    Pill: Pill.extend({ classNames: { root: pillClasses.root }, defaultProps: { radius: 'sm' } }),
    Popover: Popover.extend({
      defaultProps: { transitionProps: overlayTransitionProps, shadow: 'md' },
    }),
    Radio: Radio.extend({
      classNames: {
        root: radioClasses.root,
        inner: radioClasses.inner,
        radio: radioClasses.radio,
        icon: radioClasses.icon,
        label: inlineInputClasses.label,
      },
      vars: (theme, props) => ({
        root: { '--radio-icon-color': getRadioIconColor(theme, props) },
      }),
    }),
    RadioGroup: RadioGroup.extend({ classNames: { root: radioClasses.group } }),
    RadioIndicator: RadioIndicator.extend({
      vars: (theme, props) => ({
        indicator: { '--radio-icon-color': getRadioIconColor(theme, props) },
      }),
    }),
    Select: Select.extend({
      classNames: comboboxClassNames,
      defaultProps: { checkIconPosition: 'right' },
    }),
    Skeleton: Skeleton.extend({ classNames: { root: skeletonClasses.root } }),
    Switch: Switch.extend({
      classNames: {
        root: switchClasses.root,
        input: switchClasses.input,
        track: switchClasses.track,
        thumb: switchClasses.thumb,
        label: inlineInputClasses.label,
      },
      styles: (theme, props) => ({
        root: { '--efoo-switch-checked-contrast': getZincContrast(theme, props.color) },
      }),
      defaultProps: { withThumbIndicator: false },
    }),
    Table: Table.extend({ classNames: { table: tableClasses.table, th: tableClasses.th } }),
    Tabs: Tabs.extend({
      classNames: { root: tabsClasses.root, list: tabsClasses.list, tab: tabsClasses.tab },
    }),
    ThemeIcon: ThemeIcon.extend({ defaultProps: { variant: 'filled' } }),
    Tooltip: Tooltip.extend({
      classNames: { tooltip: tooltipClasses.tooltip },
      defaultProps: {
        transitionProps: overlayTransitionProps,
        radius: 'md',
        arrowSize: 8,
        events: { hover: true, focus: true, touch: false },
      },
    }),
  },
});
