import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
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
  VisuallyHidden,
} from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { AreaChart } from '@mantine/charts';
import '@mantine/charts/styles.layer.css';
import {
  IconBox,
  IconChartBar,
  IconDashboard,
  IconDotsVertical,
  IconLogout,
  IconMessage,
  IconPlus,
  IconReceipt,
  IconSearch,
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

const ICON_SIZE = 18;

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

const PERIODS = [
  { value: '7', label: '7 日' },
  { value: '30', label: '30 日' },
  { value: '90', label: '90 日' },
];

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
    note: '10/1〜10/31 の合計。増減は 1 日平均の 9 月比',
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
}

const NAV_ITEMS: NavItem[] = [
  { label: 'ダッシュボード', icon: IconDashboard },
  { label: '受注', icon: IconReceipt },
  { label: '顧客', icon: IconUsers },
  { label: '在庫', icon: IconBox },
  { label: '問い合わせ', icon: IconMessage, count: INQUIRIES.open },
  { label: 'レポート', icon: IconChartBar },
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
    <Badge color={ATTENTION_COLOR} variant="light">
      {label}
    </Badge>
  ) : (
    <Badge variant="outline">{label}</Badge>
  );
}

function Navbar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <AppShell.Section grow component={ScrollArea}>
        <Stack gap={4}>
          {NAV_ITEMS.map(({ label, icon: ItemIcon, count }, index) => (
            <NavLink
              key={label}
              component="button"
              type="button"
              label={label}
              active={index === 0}
              aria-current={index === 0 ? 'page' : undefined}
              onClick={onNavigate}
              leftSection={<ItemIcon size={ICON_SIZE} />}
              rightSection={
                count ? (
                  <Badge color={ATTENTION_COLOR} variant="light" aria-label={`未対応 ${count} 件`}>
                    {count}
                  </Badge>
                ) : undefined
              }
            />
          ))}
        </Stack>
      </AppShell.Section>
      <AppShell.Section>
        <NavLink
          component="button"
          type="button"
          label="設定"
          onClick={onNavigate}
          leftSection={<IconSettings size={ICON_SIZE} />}
        />
      </AppShell.Section>
    </>
  );
}

function AccountMenu() {
  return (
    <Menu position="bottom-end" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" size="input-sm" aria-label="アカウントのメニュー">
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
            <Badge color={ATTENTION_COLOR} variant="light">
              {stat.badge.label}
            </Badge>
          ) : (
            <Badge variant="outline" leftSection={stat.badge.trend && <IconTrendingUp size={12} />}>
              {stat.badge.label}
            </Badge>
          )}
        </Group>
        <Title order={2} size="h2">
          {stat.value}
        </Title>
        <Text size="sm" c="dimmed">
          {stat.note}
        </Text>
      </Stack>
    </Card>
  );
}

function SalesCard() {
  const [period, setPeriod] = useState('30');
  const data = SALES.slice(-Number(period));
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
                  {reorder && (
                    <Badge color={ATTENTION_COLOR} variant="light">
                      要発注
                    </Badge>
                  )}
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

function OrdersTable({ status }: { status: 'all' | OrderStatus }) {
  const [query, setQuery] = useState('');
  const [staff, setStaff] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setPage(1);
          }}
        />
        <Select
          flex="0 1 180px"
          placeholder="担当者で絞り込み"
          aria-label="担当者で絞り込み"
          data={STAFF}
          value={staff}
          onChange={(value) => {
            setStaff(value);
            setPage(1);
          }}
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
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>
    </>
  );
}

function OrdersCard() {
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
      <Tabs defaultValue="all" keepMounted={false}>
        <Tabs.List>
          {ORDER_TABS.map((item) => (
            <Tabs.Tab key={item.value} value={item.value}>
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {ORDER_TABS.map((item) => (
          <Tabs.Panel key={item.value} value={item.value}>
            <OrdersTable status={item.value} />
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
            <Text size="lg">{row.value} 件</Text>
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
  const navbarId = useId();
  useHotkeys([['Escape', close]]);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
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
            />
            <Title order={5} component="p">
              サンプル販売管理
            </Title>
          </Group>
          <Group gap="sm" wrap="nowrap">
            <TextInput
              visibleFrom="sm"
              w={280}
              leftSection={<IconSearch size={16} />}
              placeholder="受注・顧客・商品を検索"
              aria-label="全体を検索"
            />
            <AccountMenu />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm" id={navbarId} aria-label="メインナビゲーション">
        <Navbar onNavigate={close} />
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
