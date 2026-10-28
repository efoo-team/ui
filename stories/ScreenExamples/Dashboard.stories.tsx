import type { Meta, StoryObj } from '@storybook/react-vite';
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
  Button,
  Card,
  CloseButton,
  Divider,
  Grid,
  Group,
  Menu,
  Modal,
  NavLink,
  Pagination,
  Progress,
  RemoveScroll,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
  VisuallyHidden,
} from '@mantine/core';
import { useDisclosure, useHotkeys, useMediaQuery } from '@mantine/hooks';
import { AreaChart } from '@mantine/charts';
import '@mantine/charts/styles.layer.css';
import {
  IconBox,
  IconCheck,
  IconChartBar,
  IconDashboard,
  IconDotsVertical,
  IconLayoutSidebar,
  IconLogout,
  IconMessage,
  IconPlus,
  IconReceipt,
  IconSearch,
  IconSelector,
  IconSettings,
  IconTrendingUp,
  IconUserCircle,
  IconUsers,
  type Icon,
} from '@tabler/icons-react';

const meta = {
  title: '画面例 / ダッシュボード',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '架空の販売管理サービスのダッシュボードです。部品の見た目は theme の既定に任せ、色は利用者が対応すべきもの（未発送、発注点割れ、未対応の問い合わせ）にだけ使っています。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ICON_SIZE = 16;

// Container breakpoints for the Grids in the main area; Mantine needs exact widths for container queries.
// lg (66rem = 1056px) is where the four stat cards and the side-by-side chart row start; it stays clear of the main width at
// common viewports (1440: 1152 open / 1360 rail, 1280: 992 / 1200, 1200: 912 / 1120, 1024: 736 / 944).
const CONTENT_BREAKPOINTS = { xs: '36rem', sm: '48rem', md: '48rem', lg: '66rem', xl: '80rem' };

// Every name and number below is fictional. Figures that appear twice on the screen are computed from one source.

// The color for "the user should act on this". Everything else stays neutral.
const ATTENTION_COLOR = 'red';

const yen = (value: number) => `¥${value.toLocaleString('ja-JP')}`;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

// Deterministic pseudo-random numbers (mulberry32) so the chart is the same on every render.
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Orders dip on weekends (Sunday first), rise slowly over the quarter and vary a little from day to day.
const WEEKDAY_FACTOR = [0.66, 0.96, 1.06, 1.12, 1.0, 1.16, 0.78];

interface SalesPoint {
  month: number;
  day: number;
  date: string;
  amount: number;
}

// 90 days from August 3 to October 31, 2026. The screen shows the state on October 31.
const SALES: SalesPoint[] = (() => {
  const random = seededRandom(20261031);
  return Array.from({ length: 90 }, (_, index) => {
    const date = new Date(2026, 7, 3 + index);
    const trend = 150_000 + index * 650;
    const noise = 1 + (random() - 0.5) * 0.24;
    const amount = Math.round((trend * (WEEKDAY_FACTOR[date.getDay()] ?? 1) * noise) / 100) * 100;
    const month = date.getMonth() + 1;
    return { month, day: date.getDate(), date: `${month}/${date.getDate()}`, amount };
  });
})();

const salesOfMonth = (month: number) =>
  SALES.filter((point) => point.month === month).map((point) => point.amount);
const OCTOBER = salesOfMonth(10);
const SEPTEMBER = salesOfMonth(9);
// Months have different lengths, so the comparison uses the daily average.
const OCTOBER_GROWTH =
  (sum(OCTOBER) / OCTOBER.length / (sum(SEPTEMBER) / SEPTEMBER.length) - 1) * 100;

// The default period is the current month, so the chart total matches the first card.
const PERIODS = [
  { value: 'week', label: '過去 7 日' },
  { value: 'month', label: '今月' },
  { value: 'quarter', label: '過去 90 日' },
];

const salesOfPeriod = (period: string) =>
  period === 'month'
    ? SALES.filter((point) => point.month === 10)
    : SALES.slice(period === 'week' ? -7 : -90);

interface StockItem {
  name: string;
  unit: string;
  quantity: number;
  reorderPoint: number;
  target: number;
}

const STOCK: StockItem[] = [
  { name: 'A4 コピー用紙（500 枚）', unit: '箱', quantity: 18, reorderPoint: 40, target: 200 },
  { name: 'ボールペン 黒（10 本）', unit: '箱', quantity: 35, reorderPoint: 50, target: 300 },
  { name: 'クリアファイル（20 枚）', unit: '袋', quantity: 120, reorderPoint: 60, target: 250 },
  { name: '付箋 75mm 角', unit: '冊', quantity: 160, reorderPoint: 80, target: 240 },
  { name: 'ホチキス針 No.10', unit: '箱', quantity: 210, reorderPoint: 50, target: 260 },
];

const needsReorder = (item: StockItem) => item.quantity < item.reorderPoint;
const REORDER_COUNT = STOCK.filter(needsReorder).length;

const INQUIRIES = { total: 100, done: 62, inProgress: 24, open: 14, overdue: 3 };

interface Stat {
  label: string;
  value: string;
  note: string;
  badge: { label: string; attention: boolean; trend?: boolean };
}

const STATS: Stat[] = [
  {
    label: '受注額',
    value: yen(sum(OCTOBER)),
    note: `9 月より ${OCTOBER_GROWTH.toFixed(1)}% 多い`,
    badge: { label: `+${OCTOBER_GROWTH.toFixed(1)}%`, attention: false, trend: true },
  },
  {
    label: '新規顧客',
    value: '128',
    note: '9 月より 12 社多い',
    badge: { label: '+12', attention: false, trend: true },
  },
  {
    label: '発注が必要な品目',
    value: String(REORDER_COUNT),
    note: `${REORDER_COUNT} 品目の在庫数が発注点を下回っています`,
    badge: { label: '要発注', attention: true },
  },
  {
    label: '未対応の問い合わせ',
    value: String(INQUIRIES.open),
    note: `${INQUIRIES.open} 件のうち ${INQUIRIES.overdue} 件は受付から 2 日以上`,
    badge: { label: '要対応', attention: true },
  },
];

interface NavItem {
  label: string;
  icon: Icon;
  count?: number;
  children?: string[];
}

// The current page is a child link, so the example shows an open parent with an active child.
const NAV_ITEMS: NavItem[] = [
  { label: 'ホーム', icon: IconDashboard, children: ['ダッシュボード', 'お知らせ'] },
  { label: '受注', icon: IconReceipt, children: ['受注一覧', '出荷', '返品'] },
  { label: '顧客', icon: IconUsers },
  { label: '在庫', icon: IconBox },
  { label: '問い合わせ', icon: IconMessage, count: INQUIRIES.open },
  { label: 'レポート', icon: IconChartBar, children: ['売上', '在庫推移'] },
];

const CURRENT_PARENT = 'ホーム';
const CURRENT_PAGE = 'ダッシュボード';

interface Organization {
  name: string;
  initial: string;
  note: string;
}

const ORGANIZATIONS: Organization[] = [
  { name: '青葉商店', initial: '青', note: '標準プラン' },
  { name: '北町センター', initial: '北', note: '標準プラン' },
  { name: 'みなと通販', initial: 'み', note: 'お試し中' },
];

type OrderStatus = 'paymentPending' | 'notShipped' | 'shipped' | 'cancelled';

// Only "not shipped" asks the user to act; the other states are shown without color.
const STATUS: Record<OrderStatus, { label: string; attention: boolean }> = {
  notShipped: { label: '未発送', attention: true },
  paymentPending: { label: '入金待ち', attention: false },
  shipped: { label: '発送済み', attention: false },
  cancelled: { label: 'キャンセル', attention: false },
};

const STATUS_ORDER: OrderStatus[] = [
  'notShipped',
  'shipped',
  'shipped',
  'paymentPending',
  'shipped',
  'notShipped',
  'cancelled',
];

const CUSTOMERS = [
  'サンプル商事',
  '見本工業',
  'テスト物産',
  '例示デザイン室',
  '模型堂',
  '試作食品',
  '仮名書店',
];

const STAFF = ['青木 陽', '石川 舞', '上田 健'];

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  staff: string;
  date: string;
}

const ORDERS: Order[] = Array.from({ length: 36 }, (_, index) => ({
  id: `SO-${String(10_240 - index).padStart(6, '0')}`,
  customer: CUSTOMERS[(index * 3) % CUSTOMERS.length] ?? '',
  amount: 8_000 + ((index * 37_919) % 240_000),
  status: STATUS_ORDER[index % STATUS_ORDER.length] ?? 'shipped',
  staff: STAFF[(index * 2) % STAFF.length] ?? '',
  date: `10/${31 - Math.floor(index / 2)}`,
}));

const ORDER_TABS: { value: 'all' | OrderStatus; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'notShipped', label: '未発送' },
  { value: 'shipped', label: '発送済み' },
];

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, attention } = STATUS[status];
  return attention ? (
    <Badge color={ATTENTION_COLOR}>{label}</Badge>
  ) : (
    <Badge variant="outline">{label}</Badge>
  );
}

interface NavbarProps {
  rail: boolean;
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
                    active={rail && label === CURRENT_PARENT}
                    opened={opened}
                    onChange={() => (rail ? onExpandParent(label) : onToggleParent(label))}
                    aria-expanded={rail ? false : opened}
                  >
                    {children.map((child) => (
                      <NavLink
                        key={child}
                        component="button"
                        type="button"
                        label={child}
                        active={child === CURRENT_PAGE}
                        aria-current={child === CURRENT_PAGE ? 'page' : undefined}
                        onClick={onNavigate}
                      />
                    ))}
                  </NavLink>
                </Tooltip>
              );
            }
            return (
              // In the rail the theme hides the count badge, so the Tooltip carries the count.
              <Tooltip key={label} label={name} position="right" disabled={!rail}>
                <NavLink
                  component="button"
                  type="button"
                  label={label}
                  aria-label={name}
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
        <Tooltip label="設定" position="right" disabled={!rail}>
          <NavLink
            component="button"
            type="button"
            label="設定"
            aria-label="設定"
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
          <Avatar size="sm">青</Avatar>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>青木 陽（user@example.com）</Menu.Label>
        <Menu.Item leftSection={<IconUserCircle size={ICON_SIZE} />}>アカウント設定</Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={ICON_SIZE} />}>サインアウト</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card>
      <Stack gap="lg">
        <Stack gap="xs">
          <Group justify="space-between" wrap="nowrap">
            <Text size="sm" c="dimmed">
              {stat.label}
            </Text>
            {stat.badge.attention ? (
              <Badge color={ATTENTION_COLOR}>{stat.badge.label}</Badge>
            ) : (
              <Badge
                variant="outline"
                leftSection={stat.badge.trend && <IconTrendingUp size={12} />}
              >
                {stat.badge.label}
              </Badge>
            )}
          </Group>
          <Text variant="metric">{stat.value}</Text>
        </Stack>
        <Text size="sm" c="dimmed">
          {stat.note}
        </Text>
      </Stack>
    </Card>
  );
}

function SalesCard() {
  const [period, setPeriod] = useState('month');
  const data = salesOfPeriod(period);
  const first = data[0]?.date ?? '';
  const last = data[data.length - 1]?.date ?? '';

  return (
    <Card h="100%">
      <Group justify="space-between" align="flex-start" mb="md">
        <Stack gap={4}>
          <Title order={2} size="h5">
            受注の推移
          </Title>
          <Text size="sm" c="dimmed">
            {first}〜{last} の合計 {yen(sum(data.map((point) => point.amount)))}
          </Text>
        </Stack>
        <SegmentedControl
          data={PERIODS}
          value={period}
          onChange={setPeriod}
          aria-label="表示する期間"
        />
      </Group>
      <AreaChart
        h={260}
        data={data}
        dataKey="date"
        series={[{ name: 'amount', label: '受注額', color: 'var(--efoo-chart-1)' }]}
        valueFormatter={yen}
        yAxisProps={{ width: 80 }}
        xAxisProps={{ minTickGap: 24 }}
      />
    </Card>
  );
}

function StockCard() {
  return (
    <Card h="100%">
      <Stack gap={4} mb="md">
        <Title order={2} size="h5">
          在庫の残り
        </Title>
        <Text size="sm" c="dimmed">
          在庫数 / 適正在庫
        </Text>
      </Stack>
      <Stack gap="md">
        {STOCK.map((item) => {
          const reorder = needsReorder(item);
          return (
            <Stack key={item.name} gap={6}>
              <Group justify="space-between" wrap="nowrap" gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <Text size="sm">{item.name}</Text>
                  {reorder && <Badge color={ATTENTION_COLOR}>要発注</Badge>}
                </Group>
                <Text size="sm" c="dimmed">
                  {item.quantity} / {item.target} {item.unit}
                </Text>
              </Group>
              <Progress
                value={Math.min(100, (item.quantity / item.target) * 100)}
                color={reorder ? ATTENTION_COLOR : undefined}
                aria-label={`${item.name}の在庫 ${item.quantity} ${item.unit}（適正在庫 ${item.target} ${item.unit}、発注点 ${item.reorderPoint} ${item.unit}）`}
              />
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}

interface OrderFilters {
  query: string;
  staff: string | null;
  page: number;
}

function OrdersTable({
  status,
  filters,
  onChange,
}: {
  status: 'all' | OrderStatus;
  filters: OrderFilters;
  onChange: (next: Partial<OrderFilters>) => void;
}) {
  const { query, staff, page } = filters;
  const filtered = ORDERS.filter(
    (order) =>
      (status === 'all' || order.status === status) &&
      (!staff || order.staff === staff) &&
      (query === '' || order.id.includes(query) || order.customer.includes(query)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Group my="md" gap="sm" wrap="wrap">
        <TextInput
          flex="1 1 240px"
          leftSection={<IconSearch size={16} />}
          placeholder="受注番号・顧客名で検索"
          aria-label="受注を検索"
          value={query}
          onChange={(event) => onChange({ query: event.currentTarget.value, page: 1 })}
        />
        <Select
          flex="0 1 180px"
          placeholder="担当者で絞り込み"
          aria-label="担当者で絞り込み"
          data={STAFF}
          value={staff}
          onChange={(value) => onChange({ staff: value, page: 1 })}
          clearable
        />
      </Group>
      <Table.ScrollContainer minWidth={760} scrollAreaProps={{ type: 'always' }}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>受注番号</Table.Th>
              <Table.Th>顧客</Table.Th>
              <Table.Th ta="right">金額</Table.Th>
              <Table.Th>状態</Table.Th>
              <Table.Th>担当者</Table.Th>
              <Table.Th>受注日</Table.Th>
              <Table.Th w={48}>
                <VisuallyHidden>操作</VisuallyHidden>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>{order.id}</Table.Td>
                <Table.Td>{order.customer}</Table.Td>
                <Table.Td ta="right">{yen(order.amount)}</Table.Td>
                <Table.Td>
                  <StatusBadge status={order.status} />
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    <Avatar size="sm" aria-hidden>
                      {order.staff.charAt(0)}
                    </Avatar>
                    <Text size="sm">{order.staff}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{order.date}</Table.Td>
                <Table.Td>
                  <Menu position="bottom-end" width={160}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" aria-label={`${order.id}の操作`}>
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item>詳細を見る</Menu.Item>
                      <Menu.Item>納品書を印刷</Menu.Item>
                      <Menu.Divider />
                      <Menu.Item color="red">キャンセル</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
            {rows.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text size="sm" c="dimmed" ta="center" py="lg">
                    条件に合う受注はありません
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Group justify="space-between" mt="md">
        <Text size="sm" c="dimmed">
          {filtered.length} 件中 {rows.length} 件を表示
        </Text>
        <Pagination total={totalPages} value={page} onChange={(next) => onChange({ page: next })} />
      </Group>
    </>
  );
}

function OrdersCard() {
  // The search and staff filter live outside the tabs so switching tabs keeps them.
  const [tab, setTab] = useState<string>('all');
  const [filters, setFilters] = useState<OrderFilters>({ query: '', staff: null, page: 1 });
  const updateFilters = (next: Partial<OrderFilters>) =>
    setFilters((current) => ({ ...current, ...next }));

  return (
    <Card>
      <Group justify="space-between" mb="md">
        <Title order={2} size="h5">
          最近の受注
        </Title>
        <Button variant="outline" leftSection={<IconPlus size={16} />}>
          受注を登録
        </Button>
      </Group>
      <Tabs
        value={tab}
        onChange={(value) => {
          setTab(value ?? 'all');
          updateFilters({ page: 1 });
        }}
        keepMounted={false}
      >
        <Tabs.List>
          {ORDER_TABS.map((item) => (
            <Tabs.Tab key={item.value} value={item.value}>
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {ORDER_TABS.map((item) => (
          <Tabs.Panel key={item.value} value={item.value}>
            <OrdersTable status={item.value} filters={filters} onChange={updateFilters} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Card>
  );
}

function InquiriesCard() {
  const rows = [
    { label: '対応済み', value: INQUIRIES.done },
    { label: '対応中', value: INQUIRIES.inProgress },
    { label: '未対応', value: INQUIRIES.open },
  ];

  return (
    <Card h="100%">
      <Stack gap={4} mb="md">
        <Title order={2} size="h5">
          問い合わせの対応状況
        </Title>
        <Text size="sm" c="dimmed">
          10 月に受け付けた {INQUIRIES.total} 件のうち、対応済みは {INQUIRIES.done} 件です
        </Text>
      </Stack>
      <Progress
        value={(INQUIRIES.done / INQUIRIES.total) * 100}
        mb="md"
        aria-label={`対応済み ${INQUIRIES.done} 件 / ${INQUIRIES.total} 件`}
      />
      <SimpleGrid cols={3}>
        {rows.map((row) => (
          <Stack key={row.label} gap={4}>
            <Text size="sm" c="dimmed">
              {row.label}
            </Text>
            <Text variant="metric">{row.value}</Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Card>
  );
}

function BestSellersCard() {
  return (
    <Card h="100%" aria-busy="true">
      <Stack gap={4} mb="md">
        <Title order={2} size="h5">
          今週の売れ筋
        </Title>
        <Text size="sm" c="dimmed">
          集計しています
        </Text>
      </Stack>
      <Stack gap="sm">
        {[0, 1, 2].map((row) => (
          <Group key={row} gap="sm" wrap="nowrap">
            <Skeleton height={36} width={36} />
            <Stack gap={6} flex={1}>
              <Skeleton height={12} width="70%" />
              <Skeleton height={12} width="40%" />
            </Stack>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}

function DashboardPage() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [desktopOpened, { toggle: toggleDesktop, open: openDesktop }] = useDisclosure(true);
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [organization, setOrganization] = useState<Organization>(ORGANIZATIONS[0]!);
  const [openedParents, setOpenedParents] = useState<string[]>([CURRENT_PARENT]);
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
              <Anchor href="#" size="sm">
                {CURRENT_PARENT}
              </Anchor>
              <Text size="sm" aria-current="page">
                {CURRENT_PAGE}
              </Text>
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
      <AppShell.Main inert={narrowOpen ? true : undefined}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={1} size="h3">
              ダッシュボード
            </Title>
            <Text size="sm" c="dimmed">
              2026 年 10 月の実績（10 月 31 日時点）
            </Text>
          </Stack>
          {/* Columns follow the width of the main area, not the viewport, so an open sidebar is taken into account. */}
          <SimpleGrid type="container" cols={{ base: 1, '36rem': 2, [CONTENT_BREAKPOINTS.lg]: 4 }}>
            {STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </SimpleGrid>
          <Grid type="container" breakpoints={CONTENT_BREAKPOINTS}>
            {/* 6/6 puts the gap between the chart and stock cards on the gap between the 2nd and 3rd stat card. */}
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <SalesCard />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <StockCard />
            </Grid.Col>
          </Grid>
          <OrdersCard />
          <Grid type="container" breakpoints={CONTENT_BREAKPOINTS}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InquiriesCard />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <BestSellersCard />
            </Grid.Col>
          </Grid>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}

export const Dashboard: Story = {
  name: 'ダッシュボード',
  render: () => <DashboardPage />,
};
