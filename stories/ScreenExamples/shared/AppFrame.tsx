import {
  useEffect,
  useId,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  ActionIcon,
  Anchor,
  AppShell,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Burger,
  Divider,
  Drawer,
  Group,
  Menu,
  Modal,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconBox,
  IconChartBar,
  IconDashboard,
  IconLayoutSidebar,
  IconLogout,
  IconMessage,
  IconPlus,
  IconReceipt,
  IconSearch,
  IconSelector,
  IconSettings,
  IconUserCircle,
  IconUsers,
  type Icon,
} from '@tabler/icons-react';
import { ATTENTION_COLOR, CURRENT_USER, INQUIRIES, ORGANIZATIONS, type Organization } from './data';

export const ICON_SIZE = 16;

/*
 * The fictional service's name. The sign-in screen shows it, because there the user has not entered yet and needs to
 * know they are at the right service. The frame does not: the signed-in user is already in it, the top of the sidebar
 * names the organization, and a service puts its own name in the document title.
 */
export const SERVICE_NAME = '販売管理';

// Container breakpoints for the Grids in the main area; Mantine needs exact widths for container queries.
// lg (66rem = 1056px) is where the four stat cards and the side-by-side chart row start; it stays clear of the main width at
// common viewports (1440: 1152 open / 1360 rail, 1280: 992 / 1200, 1200: 912 / 1120, 1024: 736 / 944).
export const CONTENT_BREAKPOINTS = {
  xs: '36rem',
  sm: '48rem',
  md: '48rem',
  lg: '66rem',
  xl: '80rem',
};

interface NavItem {
  label: string;
  icon: Icon;
  count?: number;
  children?: string[];
}

// A screen names its place with a parent label and, for a parent with children, a child label.
export const NAV_ITEMS: NavItem[] = [
  { label: 'ホーム', icon: IconDashboard, children: ['ダッシュボード', 'お知らせ'] },
  { label: '受注', icon: IconReceipt, children: ['受注一覧', '出荷', '返品'] },
  { label: '顧客', icon: IconUsers },
  { label: '商品', icon: IconBox, children: ['商品一覧', '在庫'] },
  { label: '問い合わせ', icon: IconMessage, count: INQUIRIES.open },
  { label: 'レポート', icon: IconChartBar, children: ['売上', '在庫推移'] },
];

// The link at the foot of the sidebar, apart from the work the service is for.
export const SETTINGS_LABEL = '設定';

interface NavbarProps {
  rail: boolean;
  parent: string;
  page: string | undefined;
  organization: Organization;
  onOrganizationChange: (organization: Organization) => void;
  counts: Partial<Record<string, number>> | undefined;
  openedParents: string[];
  onToggleParent: (label: string) => void;
  onExpandParent: (label: string) => void;
  onNavigate: (label: string, event: MouseEvent<HTMLElement>) => void;
  /** Only the Drawer on narrow screens passes its close button; the top row carries it beside the switcher. */
  closeButton?: ReactNode;
}

/*
 * A link that opens a Menu (the organization switcher), with its name in a Tooltip for the rail. The Tooltip sits
 * between Menu and Menu.Target: Tooltip hands its hover and focus handlers and ref to Menu.Target, Menu.Target passes
 * them on through Popover.Target, and Popover.Target puts them and aria-haspopup / aria-expanded / aria-controls on
 * the NavLink. The Menu is controlled so the Tooltip stays hidden while the Menu is open. Only links without child
 * links use it: a NavLink with children already opens and closes them itself.
 */
function MenuLink({
  rail,
  name,
  position,
  width,
  dropdown,
  link,
}: {
  rail: boolean;
  name: string;
  position: 'right-start' | 'bottom-start';
  width: number;
  dropdown: ReactNode;
  link: ReactElement;
}) {
  const [opened, setOpened] = useState(false);
  return (
    // alignItemsLabels="all" keeps the indicator slot on plain items too, so they line up with the radio items.
    <Menu
      opened={opened}
      onChange={setOpened}
      position={position}
      width={width}
      alignItemsLabels="all"
    >
      <Tooltip label={name} position="right" disabled={!rail || opened}>
        <Menu.Target>{link}</Menu.Target>
      </Tooltip>
      {dropdown}
    </Menu>
  );
}

// The organization switcher is a NavLink that leads with an Avatar; in the rail the theme shows only the avatar.
function OrganizationMenu({
  rail,
  organization,
  onOrganizationChange,
}: Pick<NavbarProps, 'rail' | 'organization' | 'onOrganizationChange'>) {
  return (
    <MenuLink
      rail={rail}
      name={organization.name}
      position={rail ? 'right-start' : 'bottom-start'}
      width={240}
      link={
        <NavLink
          component="button"
          type="button"
          label={organization.name}
          description={organization.note}
          leftSection={<Avatar aria-hidden>{organization.initial}</Avatar>}
          rightSection={<IconSelector size={16} />}
          aria-label={`組織を切り替える（現在：${organization.name}）`}
        />
      }
      dropdown={
        <Menu.Dropdown>
          <Menu.Label>組織</Menu.Label>
          {/* The organizations are one choice: Menu.RadioItem is a menuitemradio with aria-checked and draws the
              theme's indicator on the selected one. Choosing switches the whole screen, so the menu closes. */}
          <Menu.RadioGroup
            value={organization.name}
            onChange={(name) => {
              const chosen = ORGANIZATIONS.find((item) => item.name === name);
              if (chosen) onOrganizationChange(chosen);
            }}
          >
            {ORGANIZATIONS.map((item) => (
              <Menu.RadioItem key={item.name} value={item.name} closeMenuOnClick>
                <Group gap="xs" wrap="nowrap">
                  <Avatar size="sm" aria-hidden>
                    {item.initial}
                  </Avatar>
                  {item.name}
                </Group>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
          <Menu.Divider />
          <Menu.Item leftSection={<IconPlus size={16} />}>組織を追加</Menu.Item>
        </Menu.Dropdown>
      }
    />
  );
}

/*
 * One set of NavLinks serves both widths and keeps the same elements when the navbar folds, so the theme can cut the
 * labels at the edge and hide them at the end. With <AppShell.Navbar mod={{ rail }}> the theme folds the links into
 * icons, so each link carries its name in aria-label and a Tooltip. The theme hides child links in the rail, so
 * pressing a parent there widens the sidebar with that parent open; only the organization switcher opens a Menu.
 *
 * Links that move to a screen are anchors: in a service, pass the router's Link as `component` and the path as its
 * `to` (or `href`), so a link opens in a new tab and reads as a link. A parent that only opens its child links stays
 * a button.
 */
function Navbar({
  rail,
  parent,
  page,
  organization,
  onOrganizationChange,
  counts,
  openedParents,
  onToggleParent,
  onExpandParent,
  onNavigate,
  closeButton,
}: NavbarProps) {
  const top = (
    <Group gap="xs" wrap="nowrap">
      <Stack flex={1} miw={0}>
        <OrganizationMenu
          rail={rail}
          organization={organization}
          onOrganizationChange={onOrganizationChange}
        />
      </Stack>
      {closeButton}
    </Group>
  );
  const links = (
    <Stack gap={4}>
      {NAV_ITEMS.map(({ label, icon: ItemIcon, count: defaultCount, children }) => {
        const count = counts ? counts[label] : defaultCount;
        const name = count ? `${label}（未対応 ${count} 件）` : label;
        const icon = <ItemIcon size={ICON_SIZE} />;
        if (children) {
          const opened = openedParents.includes(label);
          return (
            // A parent keeps one NavLink at both widths. Its opened state is controlled, so every way of pressing
            // it (click, Enter, Space) reaches onChange: in the rail it widens the sidebar and opens this parent,
            // in the full sidebar it opens or closes the children. The rail hides the children, so aria-expanded
            // follows what is shown there.
            <Tooltip key={label} label={label} position="right" disabled={!rail}>
              <NavLink
                component="button"
                type="button"
                label={label}
                aria-label={label}
                leftSection={icon}
                // In the rail the open child is not visible, so its parent shows the current place.
                active={rail && label === parent}
                opened={opened}
                onChange={() => (rail ? onExpandParent(label) : onToggleParent(label))}
                aria-expanded={rail ? false : opened}
              >
                {children.map((child) => {
                  const current = label === parent && child === page;
                  return (
                    <NavLink
                      key={child}
                      component="a"
                      href="#"
                      label={child}
                      active={current}
                      aria-current={current ? 'page' : undefined}
                      onClick={(event) => onNavigate(child, event)}
                    />
                  );
                })}
              </NavLink>
            </Tooltip>
          );
        }
        const current = label === parent;
        return (
          // In the rail the theme hides the count badge, so the Tooltip carries the count.
          <Tooltip key={label} label={name} position="right" disabled={!rail}>
            <NavLink
              component="a"
              href="#"
              label={label}
              aria-label={name}
              active={current}
              aria-current={current ? 'page' : undefined}
              onClick={(event) => onNavigate(label, event)}
              leftSection={icon}
              rightSection={
                count ? (
                  <Badge color={ATTENTION_COLOR} aria-hidden>
                    {count}
                  </Badge>
                ) : undefined
              }
            />
          </Tooltip>
        );
      })}
    </Stack>
  );
  const foot = (
    <Tooltip label={SETTINGS_LABEL} position="right" disabled={!rail}>
      <NavLink
        component="a"
        href="#"
        label={SETTINGS_LABEL}
        aria-label={SETTINGS_LABEL}
        active={parent === SETTINGS_LABEL}
        aria-current={parent === SETTINGS_LABEL ? 'page' : undefined}
        onClick={(event) => onNavigate(SETTINGS_LABEL, event)}
        leftSection={<IconSettings size={ICON_SIZE} />}
      />
    </Tooltip>
  );
  if (closeButton) {
    // In the Drawer the whole body scrolls, so the parts only stack, 16px apart like the navbar sections, with the
    // settings link at the foot.
    return (
      <Stack gap="md" flex={1}>
        {top}
        <Box flex={1}>{links}</Box>
        {foot}
      </Stack>
    );
  }
  return (
    <>
      <AppShell.Section>{top}</AppShell.Section>
      <AppShell.Section grow component={ScrollArea} scrollbars="y">
        {links}
      </AppShell.Section>
      <AppShell.Section>{foot}</AppShell.Section>
    </>
  );
}

function AccountMenu() {
  return (
    <Menu position="bottom-end" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="アカウントのメニュー">
          <Avatar size="sm">{CURRENT_USER.initial}</Avatar>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          {CURRENT_USER.name}（{CURRENT_USER.email}）
        </Menu.Label>
        <Menu.Item leftSection={<IconUserCircle size={ICON_SIZE} />}>アカウント設定</Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={ICON_SIZE} />}>サインアウト</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export interface AppFrameProps {
  /** The label in NAV_ITEMS (or SETTINGS_LABEL) that holds the current screen, e.g. '受注'. */
  parent: string;
  /** The child label under `parent` that is the current screen, e.g. '受注一覧'. Omit it for a link without children. */
  page?: string;
  /** The page path in the header. Defaults to [parent, page]; the last item is the current screen. */
  breadcrumbs?: string[];
  /** The organization selected in the switcher when the screen opens. Defaults to the first of ORGANIZATIONS. */
  defaultOrganization?: Organization;
  /**
   * The counts beside the sidebar links without child links, by label. Defaults to the counts in NAV_ITEMS (the open
   * inquiries); pass {} for an organization that has nothing to count yet.
   */
  counts?: Partial<Record<string, number>>;
  /**
   * Called with the label of a sidebar link or a page path item before the screen moves to it; return false to stay,
   * and call `proceed` to move after all (once the user has confirmed). A service does this with its router's
   * navigation blocker (React Router's useBlocker and its proceed, for example); in Storybook the links lead nowhere,
   * so a screen that guards unsaved changes uses this instead. Links to the current screen, and buttons that only open
   * child links or a menu, do not move and do not call it.
   */
  onBeforeNavigate?: (label: string, proceed: () => void) => boolean;
  /** The content of the main area. */
  children: ReactNode;
}

/*
 * The frame every 画面例 of the fictional sales management service shares: the sidebar with the organization switcher,
 * the header with the page path, the global search and the account menu. A screen passes its place in the sidebar and
 * writes only the content of the main area.
 */
export function AppFrame({
  parent,
  page,
  breadcrumbs,
  defaultOrganization,
  counts,
  onBeforeNavigate,
  children,
}: AppFrameProps) {
  const path = breadcrumbs ?? (page ? [parent, page] : [parent]);
  const [opened, { toggle, close }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop, open: openDesktop }] = useDisclosure(true);
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [organization, setOrganization] = useState<Organization>(
    defaultOrganization ?? ORGANIZATIONS[0]!,
  );
  const [openedParents, setOpenedParents] = useState<string[]>([parent]);
  const navbarId = useId();
  const theme = useMantineTheme();
  const wide = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  // The icon rail exists only on wide screens; on narrow screens the sidebar opens in full in the Drawer.
  const rail = wide === true && !desktopOpened;
  // The Drawer belongs to narrow screens: widening the window closes it, so it does not come back on narrowing.
  useEffect(() => {
    if (wide) close();
  }, [wide, close]);
  // Pressing a parent in the rail widens the sidebar with that parent open, like shadcn/ui's sidebar-07.
  const expandParent = (label: string) => {
    openDesktop();
    setOpenedParents((current) => (current.includes(label) ? current : [...current, label]));
  };
  /*
   * Moving closes the Drawer. A press that the screen holds back keeps it open, so the user is where they pressed if
   * they stay; when they move after all, the screen calls proceed and it closes then. Storybook's links lead nowhere,
   * so moving is only closing; in a service the router moves, and proceed is its blocker's.
   */
  const navigate = (label: string, event: MouseEvent<HTMLElement>) => {
    const moves = event.currentTarget.getAttribute('aria-current') !== 'page';
    if (moves && onBeforeNavigate?.(label, close) === false) {
      event.preventDefault();
      return;
    }
    close();
  };
  const toggleParent = (label: string) =>
    setOpenedParents((current) =>
      current.includes(label) ? current.filter((value) => value !== label) : [...current, label],
    );

  return (
    <AppShell
      layout="alt"
      // 64px puts the header's center on the organization row's center (8px inset + 48px row).
      header={{ height: 64 }}
      // Below sm the AppShell navbar stays collapsed and hidden; the Drawer shows the sidebar there instead.
      navbar={{ width: rail ? 48 : 256, breakpoint: 'sm', collapsed: { mobile: true } }}
      padding="md"
    >
      {/* The navbar comes first in the DOM, so Tab reaches the sidebar before the header, as it reads on screen. */}
      <AppShell.Navbar mod={{ rail }} id={navbarId} aria-label="サイドバー" visibleFrom="sm">
        <Navbar
          rail={rail}
          parent={parent}
          page={page}
          organization={organization}
          onOrganizationChange={setOrganization}
          openedParents={openedParents}
          onToggleParent={toggleParent}
          counts={counts}
          onExpandParent={expandParent}
          onNavigate={navigate}
        />
      </AppShell.Navbar>
      {/*
        On narrow screens the same sidebar opens in a Drawer, like shadcn/ui's mobile sidebar in a Sheet (18rem). The
        Drawer moves focus into it and keeps Tab there, closes on Escape and on the overlay, stops the page behind it
        from scrolling and returns focus to the Burger. A link that moves to a screen closes it. variant="sidebar"
        gives it the navbar's surface and inset.
      */}
      <Drawer.Root variant="sidebar" opened={opened && wide === false} onClose={close} size={288}>
        <Drawer.Overlay />
        <Drawer.Content aria-label="サイドバー">
          <Drawer.Body mih="100%" display="flex">
            <Box component="nav" aria-label="サイドバー" display="flex" flex={1}>
              <Navbar
                rail={false}
                parent={parent}
                page={page}
                organization={organization}
                onOrganizationChange={setOrganization}
                openedParents={openedParents}
                onToggleParent={toggleParent}
                counts={counts}
                onExpandParent={expandParent}
                onNavigate={navigate}
                closeButton={<Drawer.CloseButton aria-label="サイドバーを閉じる" />}
              />
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between" wrap="nowrap">
          {/* Like shadcn/ui: 8px from the toggle to the divider, 16px from the divider to the page path. */}
          <Group gap="md" wrap="nowrap" miw={0}>
            <Group gap="xs" wrap="nowrap">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                // sm draws 18px lines beside the 16px header icons with a similar weight, in a 26px target (WCAG 2.5.8
                // asks for 24px).
                size="sm"
                aria-label="サイドバー"
                aria-haspopup="dialog"
                aria-expanded={opened}
              />
              <ActionIcon
                variant="subtle"
                visibleFrom="sm"
                onClick={toggleDesktop}
                aria-label="サイドバー"
                aria-expanded={desktopOpened}
                aria-controls={navbarId}
              >
                <IconLayoutSidebar size={ICON_SIZE} />
              </ActionIcon>
              {/* The vertical Divider stretches to its box, so a 16px box gives it its height. */}
              <Box h={16} display="flex">
                <Divider orientation="vertical" />
              </Box>
            </Group>
            {/* On narrow screens the sidebar is hidden, so the header names the organization instead of the path. */}
            <Text variant="emphasis" hiddenFrom="sm" truncate>
              {organization.name}
            </Text>
            <Breadcrumbs visibleFrom="sm">
              {path.map((item, index) =>
                index === path.length - 1 ? (
                  <Text key={index} size="sm" aria-current="page">
                    {item}
                  </Text>
                ) : (
                  <Anchor key={index} href="#" size="sm" onClick={(event) => navigate(item, event)}>
                    {item}
                  </Anchor>
                ),
              )}
            </Breadcrumbs>
          </Group>
          <Group gap="sm" wrap="nowrap">
            <TextInput
              visibleFrom="sm"
              w={280}
              leftSection={<IconSearch size={16} />}
              placeholder="受注・顧客・商品を検索"
              aria-label="全体を検索"
            />
            <ActionIcon
              variant="subtle"
              hiddenFrom="sm"
              onClick={openSearch}
              aria-label="全体を検索"
            >
              <IconSearch size={ICON_SIZE} />
            </ActionIcon>
            <AccountMenu />
          </Group>
        </Group>
      </AppShell.Header>
      <Modal opened={searchOpened} onClose={closeSearch} title="全体を検索">
        <TextInput
          data-autofocus
          leftSection={<IconSearch size={16} />}
          placeholder="受注・顧客・商品を検索"
          aria-label="検索する言葉"
        />
      </Modal>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
