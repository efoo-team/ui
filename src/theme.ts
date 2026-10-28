/*
 * The default tokens and component styling are adapted from MantineHub's
 * shadcn theme: https://github.com/RubixCube-Innovations/mantine-theme-builder
 * Copyright (c) 2024 RubixCube Innovations. See THIRD_PARTY_NOTICES.md.
 */
import {
  Accordion,
  ActionIcon,
  Alert,
  Anchor,
  AppShell,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Burger,
  Button,
  Card,
  Cascader,
  Checkbox,
  CheckboxIndicator,
  Chip,
  Collapse,
  Combobox,
  createTheme,
  Drawer,
  EmptyState,
  Indicator,
  Input,
  InputWrapper,
  Menu,
  Loader,
  Modal,
  MultiSelect,
  NavLink,
  Notification,
  NumberInput,
  Pagination,
  parseThemeColor,
  PasswordInput,
  Pill,
  Popover,
  Progress,
  ProgressRoot,
  Radio,
  RadioGroup,
  RadioIndicator,
  RangeSlider,
  RingProgress,
  SegmentedControl,
  Select,
  Skeleton,
  Slider,
  Stepper,
  Switch,
  Table,
  Tabs,
  TagsInput,
  Text,
  ThemeIcon,
  Timeline,
  TreeSelect,
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
import {
  drawerTransitionProps,
  modalTransitionProps,
  motion,
  overlayTransitionProps,
} from './motion.js';
import {
  efooVariantColorResolver,
  getFilledContrast,
  getZincContrast,
} from './variant-color-resolver.js';
// Imported before the other styles so that dist/styles.css starts with the layer order.
import baseClasses from './styles/base.module.css';
import accordionClasses from './styles/accordion.module.css';
import actionIconClasses from './styles/action-icon.module.css';
import alertClasses from './styles/alert.module.css';
import anchorClasses from './styles/anchor.module.css';
import appShellClasses from './styles/app-shell.module.css';
import avatarClasses from './styles/avatar.module.css';
import badgeClasses from './styles/badge.module.css';
import breadcrumbsClasses from './styles/breadcrumbs.module.css';
import burgerClasses from './styles/burger.module.css';
import buttonClasses from './styles/button.module.css';
import cardClasses from './styles/card.module.css';
import chartClasses from './styles/chart.module.css';
import checkboxClasses from './styles/checkbox.module.css';
import chipClasses from './styles/chip.module.css';
import drawerClasses from './styles/drawer.module.css';
import datesClasses from './styles/dates.module.css';
import emptyStateClasses from './styles/empty-state.module.css';
import loaderClasses from './styles/loader.module.css';
import dropzoneClasses from './styles/dropzone.module.css';
import inlineInputClasses from './styles/inline-input.module.css';
import inputClasses from './styles/input.module.css';
import menuClasses from './styles/menu.module.css';
import modalClasses from './styles/modal.module.css';
import navLinkClasses from './styles/nav-link.module.css';
import notificationClasses from './styles/notification.module.css';
import notificationsClasses from './styles/notifications.module.css';
import paginationClasses from './styles/pagination.module.css';
import popoverClasses from './styles/popover.module.css';
import pillClasses from './styles/pill.module.css';
import progressClasses from './styles/progress.module.css';
import sliderClasses from './styles/slider.module.css';
import radioClasses from './styles/radio.module.css';
import segmentedControlClasses from './styles/segmented-control.module.css';
import selectClasses from './styles/select.module.css';
import skeletonClasses from './styles/skeleton.module.css';
import switchClasses from './styles/switch.module.css';
import tableClasses from './styles/table.module.css';
import tabsClasses from './styles/tabs.module.css';
import textClasses from './styles/text.module.css';
import './text-variants.js';
import tooltipClasses from './styles/tooltip.module.css';

interface IconColorProps {
  color?: string;
  iconColor?: string;
  variant?: string;
}

// Mantine computes the check and dot color from the primaryShade without the color scheme and writes it inline;
// the mark follows the fill the resolver actually draws (black on green and yellow, the scheme's contrast on zinc).
function getCheckboxIconColor(theme: MantineTheme, props: IconColorProps) {
  if (props.iconColor) return undefined;
  if (props.variant === 'outline') return 'var(--checkbox-color)';
  return props.variant === 'light' ? undefined : getFilledContrast(theme, props.color);
}

function getRadioIconColor(theme: MantineTheme, props: IconColorProps) {
  if (props.iconColor || (props.variant !== undefined && props.variant !== 'filled')) {
    return undefined;
  }
  return getFilledContrast(theme, props.color);
}

// The dark filled shade is too dark for the thin bar on the dark surface. The outline color is each scheme's line color.
function getNotificationBarColor(theme: MantineTheme, color: string | undefined) {
  if (!color) return undefined;
  const parsed = parseThemeColor({ color, theme });
  return parsed.isThemeColor && parsed.shade === undefined && parsed.color !== NEUTRAL_COLOR
    ? `var(--mantine-color-${parsed.color}-outline)`
    : undefined;
}

// Mantine's clear buttons and page arrows have no accessible name; screen readers would announce only "button".
const clearSelectionProps = { 'aria-label': '選択を解除' };
const clearInputProps = { 'aria-label': '入力を消去' };
const PAGINATION_CONTROL_LABELS = {
  first: '最初のページ',
  previous: '前のページ',
  next: '次のページ',
  last: '最後のページ',
} as const;

/*
 * @mantine/charts is optional for services, so the theme refers to its components by name instead of importing
 * them. shadcn/ui's charts draw solid grid lines and smooth ("natural") curves without dots.
 */
const chartClassNames = {
  root: chartClasses.root,
  tooltip: chartClasses.tooltip,
  tooltipLabel: chartClasses.tooltipLabel,
  tooltipItem: chartClasses.tooltipItem,
};
const gridChart = { classNames: chartClassNames, defaultProps: { strokeDasharray: 0 } };
const curveChart = {
  classNames: chartClassNames,
  defaultProps: { strokeDasharray: 0, curveType: 'natural', withDots: false },
};
const chartComponents = {
  AreaChart: curveChart,
  LineChart: curveChart,
  CompositeChart: { ...curveChart, defaultProps: { strokeDasharray: 0, curveType: 'natural' } },
  BarChart: gridChart,
  ScatterChart: gridChart,
  CandlestickChart: gridChart,
  BubbleChart: { classNames: chartClassNames },
  DonutChart: { classNames: chartClassNames },
  PieChart: { classNames: chartClassNames },
  RadarChart: { classNames: chartClassNames },
  RadialBarChart: { classNames: chartClassNames },
  FunnelChart: { classNames: chartClassNames },
  SankeyChart: { classNames: chartClassNames },
  SunburstChart: { classNames: chartClassNames },
  Treemap: { classNames: chartClassNames },
  Sparkline: { defaultProps: { curveType: 'natural' } },
  // The tooltip resolves its Styles API under its own name, not the chart's.
  ChartTooltip: { classNames: chartClassNames },
};

// Dates are optional; Styles API names allow applications without @mantine/dates to load the theme.
const dateClassNames = {
  day: datesClasses.day,
  weekday: datesClasses.weekday,
  calendarHeader: datesClasses.calendarHeader,
  calendarHeaderControl: datesClasses.calendarHeaderControl,
  calendarHeaderLevel: datesClasses.calendarHeaderLevel,
  monthsListControl: datesClasses.monthsListControl,
  yearsListControl: datesClasses.yearsListControl,
};
const calendarDefaults = {
  monthLabelFormat: 'YYYY年M月',
  ariaLabels: {
    previousMonth: '前の月',
    nextMonth: '次の月',
    previousYear: '前年',
    nextYear: '翌年',
    previousDecade: '前の10年',
    nextDecade: '次の10年',
    monthLevelControl: '月を選択',
    yearLevelControl: '年を選択',
  },
};
const dateComponents = {
  Calendar: { classNames: dateClassNames, defaultProps: calendarDefaults },
  DatePicker: { classNames: dateClassNames, defaultProps: calendarDefaults },
  DateInput: {
    classNames: dateClassNames,
    defaultProps: {
      ...calendarDefaults,
      valueFormat: 'YYYY/MM/DD',
      clearButtonProps: clearInputProps,
    },
  },
  DatePickerInput: {
    classNames: dateClassNames,
    defaultProps: {
      ...calendarDefaults,
      valueFormat: 'YYYY/MM/DD',
      clearButtonProps: clearSelectionProps,
    },
  },
  DateTimePicker: {
    classNames: dateClassNames,
    defaultProps: {
      ...calendarDefaults,
      valueFormat: 'YYYY/MM/DD HH:mm',
      clearButtonProps: clearSelectionProps,
      submitButtonProps: { 'aria-label': '日時を確定' },
    },
  },
  InlineDateTimePicker: { classNames: dateClassNames, defaultProps: calendarDefaults },
};

const comboboxClassNames = {
  dropdown: popoverClasses.list,
  options: selectClasses.options,
  option: selectClasses.option,
};

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
  // shadcn/ui's radius scale (--radius 10px): 4, 6, 8, 10 and 14px. Controls and dropdowns use lg.
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.625rem',
    xl: '0.875rem',
  },
  defaultRadius: 'lg',
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
  // Tailwind's leading for each text size: 12/16, 14/20, 16/24, 18/28 and 20/28.
  lineHeights: {
    xs: '1.3333',
    sm: '1.4286',
    md: '1.5',
    lg: '1.5556',
    xl: '1.4',
  },
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.25rem', lineHeight: '2.5rem' },
      h2: { fontSize: '1.875rem', lineHeight: '2.25rem' },
      h3: { fontSize: '1.5rem', lineHeight: '2rem' },
      h4: { fontSize: '1.25rem', lineHeight: '1.75rem' },
      h5: { fontSize: '1rem', lineHeight: '1.5rem' },
      h6: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    },
  },
  // Tailwind v4 shadows. The negative spread keeps the shadow under the element instead of around it.
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  variantColorResolver: efooVariantColorResolver,
  components: {
    ...chartComponents,
    ...dateComponents,
    // The extension remains optional for services; Mantine resolves its theme by component name.
    Dropzone: { classNames: { root: dropzoneClasses.root } },
    Accordion: Accordion.extend({
      classNames: {
        root: accordionClasses.root,
        control: accordionClasses.control,
        label: accordionClasses.label,
        content: accordionClasses.content,
      },
    }),
    ActionIcon: ActionIcon.extend({ classNames: { root: actionIconClasses.root } }),
    Alert: Alert.extend({
      classNames: { root: alertClasses.root, body: alertClasses.body, title: alertClasses.title },
    }),
    // Without the underline a link in body text only differs by its weight.
    Anchor: Anchor.extend({
      classNames: { root: anchorClasses.root },
      defaultProps: { underline: 'always' },
    }),
    AppShell: AppShell.extend({
      classNames: {
        navbar: appShellClasses.navbar,
        main: appShellClasses.main,
        header: appShellClasses.header,
        footer: appShellClasses.footer,
        aside: appShellClasses.aside,
        section: appShellClasses.section,
      },
      // shadcn/ui folds its sidebar in 200ms linear; an ease-out finished most of the width in the first frames.
      defaultProps: {
        transitionDuration: motion.durationStandard,
        transitionTimingFunction: 'linear',
      },
    }),
    Autocomplete: Autocomplete.extend({
      classNames: comboboxClassNames,
      defaultProps: { clearButtonProps: clearInputProps },
    }),
    // Without a color the fallback takes the avatar surface of the resolver, which stays visible on hovered rows and menu
    // items (shadcn/ui's muted equals its hover surface, so its avatar loses its outline there); Mantine's dark gray light
    // variant is nearly black.
    Avatar: Avatar.extend({
      classNames: { root: avatarClasses.root, placeholder: avatarClasses.placeholder },
      vars: (_theme, props) =>
        props.color === undefined && (props.variant === undefined || props.variant === 'light')
          ? {
              root: {
                '--avatar-bg': 'var(--efoo-color-avatar, var(--mantine-color-default-hover))',
                '--avatar-color': 'var(--efoo-color-avatar-text, var(--mantine-color-dimmed))',
              },
            }
          : { root: {} },
    }),
    // shadcn/ui overlaps avatars by 8px (-space-x-2); Mantine's 12px hid the initials of the avatar behind.
    AvatarGroup: AvatarGroup.extend({ defaultProps: { spacing: 'xs' } }),
    // shadcn/ui's badges are mostly secondary (a muted surface with the text color); status colors default to a tint.
    // A variant is always set, so Mantine never falls back to its white text on the light dark-scheme fill.
    Badge: Badge.extend({
      classNames: { root: badgeClasses.root },
      // shadcn/ui's outline badge keeps the surface line (white 10% in dark), not the input line of buttons.
      vars: (theme, props) => ({
        root: {
          '--badge-bd':
            props.variant === 'outline' && getZincContrast(theme, props.color)
              ? '1px solid var(--mantine-color-default-border)'
              : undefined,
        },
      }),
      defaultProps: { variant: 'light' },
    }),
    Breadcrumbs: Breadcrumbs.extend({
      classNames: {
        root: breadcrumbsClasses.root,
        breadcrumb: breadcrumbsClasses.breadcrumb,
        separator: breadcrumbsClasses.separator,
      },
    }),
    Burger: Burger.extend({ classNames: { root: burgerClasses.root } }),
    Button: Button.extend({
      classNames: { root: buttonClasses.root, section: buttonClasses.section },
    }),
    // shadcn/ui's dashboard-01 card: 24px padding and shadow-xs. The corners follow the default radius in card.module.css.
    Card: Card.extend({
      classNames: { root: cardClasses.root },
      defaultProps: { withBorder: true, padding: 'lg', shadow: 'xs' },
    }),
    Cascader: Cascader.extend({ classNames: { dropdown: popoverClasses.list } }),
    Checkbox: Checkbox.extend({
      classNames: {
        root: `${checkboxClasses.root} ${inlineInputClasses.root}`,
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
      classNames: { indicator: checkboxClasses.indicator },
      defaultProps: { radius: 'xs' },
      vars: (theme, props) => ({
        indicator: { '--checkbox-icon-color': getCheckboxIconColor(theme, props) },
      }),
    }),
    // Mantine sets the checked text only when color or variant is given, and white otherwise.
    Chip: Chip.extend({
      classNames: { root: chipClasses.root, label: chipClasses.label },
      vars: (theme, props) => ({
        root: {
          '--chip-color':
            props.variant === undefined || props.variant === 'filled'
              ? getFilledContrast(theme, props.color)
              : undefined,
        },
      }),
    }),
    // Collapse (NavLink children) opens with the theme motion; Mantine skips it with reduced motion. Accordion passes its
    // own 200ms to the panel, so only the easing reaches it.
    Collapse: Collapse.extend({
      defaultProps: {
        transitionDuration: motion.durationStandard,
        transitionTimingFunction: motion.easing,
      },
    }),
    Combobox: Combobox.extend({
      classNames: { dropdown: popoverClasses.list },
      defaultProps: { transitionProps: overlayTransitionProps },
    }),
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
        header: drawerClasses.header,
        title: drawerClasses.title,
        body: drawerClasses.body,
        close: drawerClasses.close,
      }),
      defaultProps: { transitionProps: drawerTransitionProps, overlayProps, shadow: 'lg' },
    }),
    EmptyState: EmptyState.extend({
      classNames: {
        root: emptyStateClasses.root,
        title: emptyStateClasses.title,
        description: emptyStateClasses.description,
      },
    }),
    Indicator: Indicator.extend({
      vars: (theme, props) => ({
        root: { '--indicator-text-color': getFilledContrast(theme, props.color) },
      }),
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
    Loader: Loader.extend({ classNames: { root: loaderClasses.root } }),
    Menu: Menu.extend({
      classNames: {
        item: menuClasses.item,
        itemSection: menuClasses.itemSection,
        label: menuClasses.label,
      },
    }),
    Modal: Modal.extend({
      classNames: {
        root: modalClasses.root,
        inner: modalClasses.inner,
        content: modalClasses.content,
        header: modalClasses.header,
        title: modalClasses.title,
        body: modalClasses.body,
        close: modalClasses.close,
      },
      // shadcn/ui's dialog is drawn by its 1px line, with no large shadow.
      // shadcn/ui's dialog opens in the middle of the viewport.
      defaultProps: {
        transitionProps: modalTransitionProps,
        overlayProps,
        shadow: 'xs',
        centered: true,
      },
    }),
    MultiSelect: MultiSelect.extend({
      classNames: { ...comboboxClassNames, inputField: inputClasses.pillsField },
      defaultProps: { clearButtonProps: clearSelectionProps },
    }),
    NavLink: NavLink.extend({
      classNames: {
        root: navLinkClasses.root,
        section: navLinkClasses.section,
        body: navLinkClasses.body,
        label: navLinkClasses.label,
        description: navLinkClasses.description,
        collapse: navLinkClasses.collapse,
        children: navLinkClasses.children,
      },
    }),
    Notification: Notification.extend({
      classNames: {
        root: notificationClasses.root,
        icon: notificationClasses.icon,
        closeButton: notificationClasses.closeButton,
      },
      styles: (theme, props) => ({
        root: {
          '--efoo-notification-bar': getNotificationBarColor(theme, props.color),
          '--efoo-notification-icon-color': getFilledContrast(theme, props.color),
        },
      }),
      defaultProps: { withBorder: true },
    }),
    Pagination: Pagination.extend({
      classNames: { control: paginationClasses.control },
      defaultProps: {
        getControlProps: (control) => ({ 'aria-label': PAGINATION_CONTROL_LABELS[control] }),
        // The ellipsis is drawn as an unnamed image; the page numbers around it already tell the gap.
        attributes: { dots: { 'aria-hidden': true } },
      },
      vars: (theme, props) => ({
        root: { '--pagination-active-color': getFilledContrast(theme, props.color) },
      }),
    }),
    NumberInput: NumberInput.extend({ classNames: { control: inputClasses.numberControl } }),
    PasswordInput: PasswordInput.extend({
      classNames: { visibilityToggle: inputClasses.visibilityToggle },
      defaultProps: {
        visibilityToggleFocusable: true,
        // Mantine's label is English. The button reports shown or hidden through aria-pressed.
        visibilityToggleButtonProps: { 'aria-label': 'パスワードを表示' },
      },
    }),
    // @mantine/notifications is optional for services, so the theme refers to it by name instead of importing it.
    // Sonner's toasts are 356px wide.
    Notifications: {
      classNames: { notification: notificationsClasses.notification },
      defaultProps: { containerWidth: 356 },
    },
    Pill: Pill.extend({ classNames: { root: pillClasses.root }, defaultProps: { radius: 'sm' } }),
    Popover: Popover.extend({
      classNames: { dropdown: popoverClasses.dropdown },
      defaultProps: { transitionProps: overlayTransitionProps, shadow: 'md' },
    }),
    Progress: Progress.extend({
      classNames: { root: progressClasses.root },
      defaultProps: { size: 4 },
    }),
    ProgressRoot: ProgressRoot.extend({ defaultProps: { size: 4 } }),
    Radio: Radio.extend({
      classNames: {
        root: `${radioClasses.root} ${inlineInputClasses.root}`,
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
      classNames: { indicator: radioClasses.indicator },
      vars: (theme, props) => ({
        indicator: { '--radio-icon-color': getRadioIconColor(theme, props) },
      }),
    }),
    RangeSlider: RangeSlider.extend({
      classNames: { root: sliderClasses.root, thumb: sliderClasses.thumb },
      defaultProps: { size: 'xs', thumbSize: 12 },
    }),
    RingProgress: RingProgress.extend({
      defaultProps: { rootColor: 'var(--mantine-color-default-hover)' },
    }),
    SegmentedControl: SegmentedControl.extend({
      classNames: {
        root: segmentedControlClasses.root,
        indicator: segmentedControlClasses.indicator,
        label: segmentedControlClasses.label,
        input: segmentedControlClasses.input,
      },
      // shadcn/ui's tabs list has no lines between the triggers.
      defaultProps: { withItemsBorders: false },
    }),
    Select: Select.extend({
      classNames: comboboxClassNames,
      defaultProps: { checkIconPosition: 'right', clearButtonProps: clearSelectionProps },
    }),
    Skeleton: Skeleton.extend({
      classNames: { root: skeletonClasses.root },
      defaultProps: { radius: 'md' },
    }),
    Slider: Slider.extend({
      classNames: { root: sliderClasses.root, thumb: sliderClasses.thumb },
      defaultProps: { size: 'xs', thumbSize: 12 },
    }),
    Stepper: Stepper.extend({
      vars: (theme, props) => ({
        root: { '--stepper-icon-color': getFilledContrast(theme, props.color) },
      }),
    }),
    Switch: Switch.extend({
      classNames: {
        root: `${switchClasses.root} ${inlineInputClasses.root}`,
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
    // Mantine's 7px leaves rows at 35px; shadcn/ui's cells have 8px above and below.
    Table: Table.extend({
      classNames: { table: tableClasses.table, th: tableClasses.th },
      defaultProps: { verticalSpacing: 'xs' },
    }),
    Tabs: Tabs.extend({
      classNames: { root: tabsClasses.root, list: tabsClasses.list, tab: tabsClasses.tab },
    }),
    TagsInput: TagsInput.extend({
      classNames: { ...comboboxClassNames, inputField: inputClasses.pillsField },
      defaultProps: { clearButtonProps: clearInputProps },
    }),
    // variant="metric" and variant="emphasis"; see text-variants.ts.
    Text: Text.extend({ classNames: { root: textClasses.root } }),
    ThemeIcon: ThemeIcon.extend({ defaultProps: { variant: 'filled' } }),
    Timeline: Timeline.extend({
      vars: (theme, props) => ({
        root: { '--tl-icon-color': getFilledContrast(theme, props.color) },
      }),
    }),
    TreeSelect: TreeSelect.extend({ classNames: { dropdown: popoverClasses.list } }),
    Tooltip: Tooltip.extend({
      classNames: { tooltip: tooltipClasses.tooltip },
      defaultProps: {
        transitionProps: overlayTransitionProps,
        radius: 'md',
        // In shadcn/ui's sidebar-07 the tooltip box starts 10px from its trigger (its arrow fills the gap). The theme
        // has no arrow by default and keeps the same distance (Mantine: 5px).
        offset: 10,
        arrowSize: 8,
        events: { hover: true, focus: true, touch: false },
      },
    }),
  },
});
