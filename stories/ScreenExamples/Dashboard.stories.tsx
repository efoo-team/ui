import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Burger,
  Button,
  Card,
  Grid,
  Group,
  Menu,
  Modal,
  NavLink,
  Pagination,
  Progress,
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
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
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
    label: '10 月の受注額',
    value: yen(sum(OCTOBER)),
    note: `9 月より ${OCTOBER_GROWTH.toFixed(1)}% 多い`,
    badge: { label: `+${OCTOBER_GROWTH.toFixed(1)}%`, attention: false, trend: true },
  },
  {
    label: '10 月の新規顧客',
    value: '128 社',
    note: '9 月より 12 社多い',
    badge: { label: '+12', attention: false, trend: true },
  },
  {
    label: '発注が必要な品目',
    value: `${REORDER_COUNT} 品目`,
    note: '在庫数が発注点を下回っています',
    badge: { label: '要発注', attention: true },
  },
  {
    label: '未対応の問い合わせ',
    value: `${INQUIRIES.open} 件`,
    note: `うち ${INQUIRIES.overdue} 件は受付から 2 日以上`,
    badge: { label: '要対応', attention: true },
  },
];

interface NavItem {
  label: string;
  icon: Icon;
  count?: number;
  children?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'ダッシュボード', icon: IconDashboard },
  { label: '受注', icon: IconReceipt, children: ['受注一覧', '出荷', '返品'] },
  { label: '顧客', icon: IconUsers },
  { label: '在庫', icon: IconBox },
  { label: '問い合わせ', icon: IconMessage, count: INQUIRIES.open },
  { label: 'レポート', icon: IconChartBar, children: ['売上', '在庫'] },
];

const CURRENT_PAGE = 'ダッシュボード';

interface Organization {
  name: string;
  initial: string;
  note: string;
}

const ORGANIZATIONS: Organization[] = [
  { name: 'サンプル販売 本店', initial: '本', note: '標準プラン' },
  { name: 'サンプル販売 北支店', initial: '北', note: '標準プラン' },
  { name: 'サンプル販売 通信販売部', initial: '通', note: 'お試し中' },
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
  onNavigate: () => void;
}

// The organization switcher is a NavLink that leads with an Avatar; in the rail the theme shows only the avatar.
function OrganizationMenu({
  rail,
  organization,
  onOrganizationChange,
}: Pick<NavbarProps, 'rail' | 'organization' | 'onOrganizationChange'>) {
  return (
    <Menu position={rail ? 'right-start' : 'bottom-start'} width={240}>
      <Menu.Target>
        <NavLink
          component="button"
          type="button"
          label={organization.name}
          description={organization.note}
          leftSection={<Avatar aria-hidden>{organization.initial}</Avatar>}
          rightSection={<IconSelector size={16} />}
          aria-label={`組織を切り替える（現在：${organization.name}）`}
        />
      </Menu.Target>
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
    </Menu>
  );
}

/*
 * A parent link in the rail opens its children from a Menu. The NavLink sits directly under Menu.Target so it
 * receives aria-haspopup, aria-expanded and aria-controls; the Tooltip points at it through \`target\` instead of
 * wrapping it, because a wrapping Tooltip would take those attributes.
 */
function RailParent({
  label,
  name,
  icon,
  items,
}: {
  label: string;
  name: string;
  icon: ReactNode;
  items: string[];
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Menu position="right-start" width={180}>
        <Menu.Target>
          <NavLink
            ref={ref}
            component="button"
            type="button"
            label={label}
            aria-label={name}
            leftSection={icon}
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{label}</Menu.Label>
          {items.map((child) => (
            <Menu.Item key={child}>{child}</Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      <Tooltip label={label} position="right" target={ref} />
    </>
  );
}

/*
 * One set of NavLinks serves both widths. With <AppShell.Navbar mod={{ collapsed }}> the theme folds them into
 * icons and hides labels, badges and child links, so each link carries its name in aria-label and a Tooltip, and a
 * parent opens its child links from a Menu instead.
 */
function Navbar({
  rail,
  organization,
  onOrganizationChange,
  openedParents,
  onToggleParent,
  onNavigate,
}: NavbarProps) {
  return (
    <>
      <AppShell.Section mb="xs">
        <OrganizationMenu
          rail={rail}
          organization={organization}
          onOrganizationChange={onOrganizationChange}
        />
      </AppShell.Section>
      <AppShell.Section grow component={ScrollArea} scrollbars="y">
        <Stack gap={4}>
          {NAV_ITEMS.map(({ label, icon: ItemIcon, count, children }) => {
            const name = count ? `${label}（未対応 ${count} 件）` : label;
            const icon = <ItemIcon size={ICON_SIZE} />;
            if (children && rail) {
              return (
                <RailParent key={label} label={label} name={name} icon={icon} items={children} />
              );
            }
            if (children) {
              return (
                <NavLink
                  key={label}
                  component="button"
                  type="button"
                  label={label}
                  leftSection={icon}
                  opened={openedParents.includes(label)}
                  onChange={() => onToggleParent(label)}
                >
                  {children.map((child) => (
                    <NavLink
                      key={child}
                      component="button"
                      type="button"
                      label={child}
                      onClick={onNavigate}
                    />
                  ))}
                </NavLink>
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
                  active={label === CURRENT_PAGE}
                  aria-current={label === CURRENT_PAGE ? 'page' : undefined}
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
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Text size="sm" c="dimmed">
            {stat.label}
          </Text>
          {stat.badge.attention ? (
            <Badge color={ATTENTION_COLOR}>{stat.badge.label}</Badge>
          ) : (
            <Badge variant="outline" leftSection={stat.badge.trend && <IconTrendingUp size={12} />}>
              {stat.badge.label}
            </Badge>
          )}
        </Group>
        <Text variant="metric">{stat.value}</Text>
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
            <Text variant="metric">{row.value} 件</Text>
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
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [organization, setOrganization] = useState<Organization>(ORGANIZATIONS[0]!);
  const [openedParents, setOpenedParents] = useState<string[]>(['受注']);
  const navbarId = useId();
  const theme = useMantineTheme();
  const wide = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  // On narrow screens the navbar always opens in full; the icon rail exists only on wide screens.
  const rail = wide === true && !desktopOpened;
  // Escape closes the narrow-screen navbar from the Burger or from inside the navbar. A menu opened from the navbar
  // renders in a portal, but React still bubbles its keydown here, so events from outside the navbar's DOM and
  // from an open menu button are left to the menu.
  const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const fromPortal = !event.currentTarget.contains(target);
    const closesMenu =
      target.hasAttribute('aria-haspopup') && target.getAttribute('aria-expanded') === 'true';
    if (event.key === 'Escape' && opened && !fromPortal && !closesMenu) close();
  };
  const toggleParent = (label: string) =>
    setOpenedParents((current) =>
      current.includes(label) ? current.filter((value) => value !== label) : [...current, label],
    );

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: rail ? 48 : 256, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="ナビゲーション"
              aria-expanded={opened}
              aria-controls={navbarId}
              onKeyDown={closeOnEscape}
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
            <Text variant="emphasis">サンプル販売管理</Text>
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
      <AppShell.Navbar
        p={rail ? 'xs' : 'sm'}
        mod={{ collapsed: rail }}
        id={navbarId}
        aria-label="メインナビゲーション"
        onKeyDown={closeOnEscape}
      >
        <Navbar
          rail={rail}
          organization={organization}
          onOrganizationChange={setOrganization}
          openedParents={openedParents}
          onToggleParent={toggleParent}
          onNavigate={close}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={1} size="h3">
              ダッシュボード
            </Title>
            <Text size="sm" c="dimmed">
              2026 年 10 月 31 日時点の状況
            </Text>
          </Stack>
          <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
            {STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </SimpleGrid>
          <Grid>
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <SalesCard />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <StockCard />
            </Grid.Col>
          </Grid>
          <OrdersCard />
          <Grid>
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
