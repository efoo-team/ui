import { useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import {
  ActionIcon,
  Anchor,
  AppShell,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Burger,
  CloseButton,
  Divider,
  Group,
  Menu,
  Modal,
  NavLink,
  RemoveScroll,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useHotkeys, useMediaQuery } from '@mantine/hooks';
import {
  IconBox,
  IconChartBar,
  IconCheck,
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
  openedParents: string[];
  onToggleParent: (label: string) => void;
  onExpandParent: (label: string) => void;
  onNavigate: () => void;
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
    <Menu opened={opened} onChange={setOpened} position={position} width={width}>
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
          {ORGANIZATIONS.map((item) => (
            <Menu.Item
              key={item.name}
              leftSection={
                <Avatar size="sm" aria-hidden>
                  {item.initial}
                </Avatar>
              }
              rightSection={item.name === organization.name ? <IconCheck size={16} /> : undefined}
              aria-current={item.name === organization.name ? 'true' : undefined}
              onClick={() => onOrganizationChange(item)}
            >
              {item.name}
            </Menu.Item>
          ))}
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
 */
function Navbar({
  rail,
  parent,
  page,
  organization,
  onOrganizationChange,
  openedParents,
  onToggleParent,
  onExpandParent,
  onNavigate,
}: NavbarProps) {
  return (
    <>
      <AppShell.Section>
        <Group gap="xs" wrap="nowrap">
          <Stack flex={1} miw={0}>
            <OrganizationMenu
              rail={rail}
              organization={organization}
              onOrganizationChange={onOrganizationChange}
            />
          </Stack>
          {/* With layout="alt" the open navbar covers the header on narrow screens, so it carries its own close button. */}
          <CloseButton hiddenFrom="sm" onClick={onNavigate} aria-label="サイドバーを閉じる" />
        </Group>
      </AppShell.Section>
      <AppShell.Section grow component={ScrollArea} scrollbars="y">
        <Stack gap={4}>
          {NAV_ITEMS.map(({ label, icon: ItemIcon, count, children }) => {
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
                          component="button"
                          type="button"
                          label={child}
                          active={current}
                          aria-current={current ? 'page' : undefined}
                          onClick={onNavigate}
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
                  component="button"
                  type="button"
                  label={label}
                  aria-label={name}
                  active={current}
                  aria-current={current ? 'page' : undefined}
                  onClick={onNavigate}
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
      </AppShell.Section>
      <AppShell.Section>
        <Tooltip label={SETTINGS_LABEL} position="right" disabled={!rail}>
          <NavLink
            component="button"
            type="button"
            label={SETTINGS_LABEL}
            aria-label={SETTINGS_LABEL}
            active={parent === SETTINGS_LABEL}
            aria-current={parent === SETTINGS_LABEL ? 'page' : undefined}
            onClick={onNavigate}
            leftSection={<IconSettings size={ICON_SIZE} />}
          />
        </Tooltip>
      </AppShell.Section>
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
  /** The content of the main area. */
  children: ReactNode;
}

/*
 * The frame every 画面例 of the fictional sales management service shares: the sidebar with the organization switcher,
 * the header with the page path, the global search and the account menu. A screen passes its place in the sidebar and
 * writes only the content of the main area.
 */
export function AppFrame({ parent, page, breadcrumbs, children }: AppFrameProps) {
  const path = breadcrumbs ?? (page ? [parent, page] : [parent]);
  const [opened, { toggle, close }] = useDisclosure(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [desktopOpened, { toggle: toggleDesktop, open: openDesktop }] = useDisclosure(true);
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [organization, setOrganization] = useState<Organization>(ORGANIZATIONS[0]!);
  const [openedParents, setOpenedParents] = useState<string[]>([parent]);
  const navbarId = useId();
  const theme = useMantineTheme();
  const wide = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  // On narrow screens the navbar always opens in full; the icon rail exists only on wide screens.
  const rail = wide === true && !desktopOpened;
  // Escape anywhere closes the narrow-screen navbar, except while a menu or dialog is open: their own Escape closes
  // them first, and the navbar stays.
  useHotkeys([
    [
      'Escape',
      () => {
        if (!opened || document.querySelector('[role="menu"], [role="dialog"]')) return;
        close();
      },
    ],
  ]);
  const narrowOpen = wide === false && opened;
  // On narrow screens the open navbar covers the page like a dialog: focus moves into it when it opens and back to
  // the Burger when it closes.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wide !== false) return;
    // RemoveScroll takes the navbar's ref, so the navbar is found by its id.
    if (opened) document.getElementById(navbarId)?.querySelector<HTMLElement>('button')?.focus();
    else if (wasOpen.current) burgerRef.current?.focus();
    wasOpen.current = opened;
  }, [opened, wide, navbarId]);
  // Pressing a parent in the rail widens the sidebar with that parent open, like shadcn/ui's sidebar-07.
  const expandParent = (label: string) => {
    openDesktop();
    setOpenedParents((current) => (current.includes(label) ? current : [...current, label]));
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
      navbar={{ width: rail ? 48 : 256, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* The navbar comes first in the DOM, so Tab reaches the sidebar before the header, as it reads on screen. */}
      {/* While the narrow-screen navbar is open the page behind it does not scroll; while it is closed it is inert. */}
      <RemoveScroll enabled={narrowOpen} forwardProps>
        <AppShell.Navbar
          mod={{ rail }}
          id={navbarId}
          aria-label="サイドバー"
          inert={wide === false && !opened ? true : undefined}
          // The full-width navbar on narrow screens has nothing beside it to separate from.
          withBorder={wide !== false}
        >
          <Navbar
            rail={rail}
            parent={parent}
            page={page}
            organization={organization}
            onOrganizationChange={setOrganization}
            openedParents={openedParents}
            onToggleParent={toggleParent}
            onExpandParent={expandParent}
            onNavigate={close}
          />
        </AppShell.Navbar>
      </RemoveScroll>
      {/* The open narrow-screen navbar covers the header and main, so they leave the Tab order meanwhile. */}
      <AppShell.Header px="md" inert={narrowOpen ? true : undefined}>
        <Group h="100%" justify="space-between" wrap="nowrap">
          {/* Like shadcn/ui: 8px from the toggle to the divider, 16px from the divider to the page path. */}
          <Group gap="md" wrap="nowrap" miw={0}>
            <Group gap="xs" wrap="nowrap">
              <Burger
                ref={burgerRef}
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="lg"
                aria-label="サイドバー"
                aria-expanded={opened}
                aria-controls={navbarId}
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
                  <Anchor key={index} href="#" size="sm">
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
      <AppShell.Main inert={narrowOpen ? true : undefined}>{children}</AppShell.Main>
    </AppShell>
  );
}
