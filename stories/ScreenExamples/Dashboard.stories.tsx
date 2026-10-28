import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
          '架空の販売管理サービスのダッシュボードです。見た目はすべて theme の既定から来ています。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ICON_SIZE = 18;

// Every name and number below is fictional.

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
  { label: '問い合わせ', icon: IconMessage, count: 14 },
  { label: 'レポート', icon: IconChartBar },
];

interface Stat {
  label: string;
  value: string;
  note: string;
  badge: { label: string; color: string };
}

const STATS: Stat[] = [
  {
    label: '今月の受注額',
    value: '¥4,820,000',
    note: '先月の同じ日までより 8.2% 多い',
    badge: { label: '+8.2%', color: 'green' },
  },
  {
    label: '新規顧客',
    value: '128 社',
    note: '先月の同じ日までより 12 社多い',
    badge: { label: '+12', color: 'green' },
  },
  {
    label: '在庫切れ間近',
    value: '7 品目',
    note: '在庫が発注点を下回っています',
    badge: { label: '要発注', color: 'yellow' },
  },
  {
    label: '未対応の問い合わせ',
    value: '14 件',
    note: 'うち 3 件は受付から 2 日以上',
    badge: { label: '要対応', color: 'red' },
  },
];

interface SalesPoint {
  date: string;
  amount: number;
}

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

// 90 days from August 3 to October 31.
const SALES: SalesPoint[] = (() => {
  const random = seededRandom(20261031);
  return Array.from({ length: 90 }, (_, index) => {
    const day = new Date(2026, 7, 3 + index);
    const trend = 150_000 + index * 650;
    const noise = 1 + (random() - 0.5) * 0.24;
    const amount = Math.round((trend * (WEEKDAY_FACTOR[day.getDay()] ?? 1) * noise) / 100) * 100;
    return { date: `${day.getMonth() + 1}/${day.getDate()}`, amount };
  });
})();

const PERIODS = [
  { value: '7', label: '7 日' },
  { value: '30', label: '30 日' },
  { value: '90', label: '90 日' },
];

const yen = (value: number) => `¥${value.toLocaleString('ja-JP')}`;

interface StockItem {
  name: string;
  remaining: number;
}

const STOCK: StockItem[] = [
  { name: 'A4 コピー用紙（500 枚）', remaining: 12 },
  { name: 'ボールペン 黒（10 本）', remaining: 28 },
  { name: 'クリアファイル（20 枚）', remaining: 46 },
  { name: '付箋 75mm 角', remaining: 63 },
  { name: 'ホチキス針 No.10', remaining: 81 },
];

const stockColor = (remaining: number) =>
  remaining < 20 ? 'red' : remaining < 40 ? 'yellow' : undefined;

type OrderStatus = 'paymentPending' | 'notShipped' | 'shipped' | 'cancelled';

const STATUS: Record<OrderStatus, { label: string; color: string }> = {
  paymentPending: { label: '入金待ち', color: 'gray' },
  notShipped: { label: '未発送', color: 'yellow' },
  shipped: { label: '発送済み', color: 'green' },
  cancelled: { label: 'キャンセル', color: 'red' },
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
  { value: 'paymentPending', label: '入金待ち' },
  { value: 'shipped', label: '発送済み' },
];

const PAGE_SIZE = 8;

const INQUIRIES = [
  { label: '対応済み', value: 62, color: 'green' },
  { label: '対応中', value: 24, color: 'yellow' },
  { label: '未対応', value: 14, color: 'red' },
];

function Navbar() {
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
              leftSection={<ItemIcon size={ICON_SIZE} />}
              rightSection={
                count ? (
                  <Badge color="red" variant="light">
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
          <Badge color={stat.badge.color} variant="light">
            {stat.badge.label}
          </Badge>
        </Group>
        <Title order={3} component="p">
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
  const total = data.reduce((sum, point) => sum + point.amount, 0);

  return (
    <Card h="100%">
      <Group justify="space-between" align="flex-start" mb="md">
        <Stack gap={4}>
          <Title order={4} component="h2">
            受注の推移
          </Title>
          <Text size="sm" c="dimmed">
            過去 {period} 日の合計 {yen(total)}
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
        curveType="monotone"
        withDots={false}
        withGradient
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
        <Title order={4} component="h2">
          在庫の残り
        </Title>
        <Text size="sm" c="dimmed">
          発注点に対する現在の在庫
        </Text>
      </Stack>
      <Stack gap="md">
        {STOCK.map((item) => (
          <Stack key={item.name} gap={6}>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm">{item.name}</Text>
              <Text size="sm" c="dimmed">
                {item.remaining}%
              </Text>
            </Group>
            <Progress
              value={item.remaining}
              color={stockColor(item.remaining)}
              aria-label={`${item.name}の在庫`}
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

function OrdersCard() {
  const [tab, setTab] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [staff, setStaff] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = ORDERS.filter(
    (order) =>
      (tab === 'all' || order.status === tab) &&
      (!staff || order.staff === staff) &&
      (query === '' || order.id.includes(query) || order.customer.includes(query)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage = () => setPage(1);

  return (
    <Card>
      <Group justify="space-between" mb="md">
        <Title order={4} component="h2">
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
          resetPage();
        }}
      >
        <ScrollArea type="never">
          <Tabs.List>
            {ORDER_TABS.map((item) => (
              <Tabs.Tab key={item.value} value={item.value}>
                {item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </ScrollArea>
      </Tabs>
      <Group my="md" gap="sm" wrap="wrap">
        <TextInput
          flex="1 1 240px"
          leftSection={<IconSearch size={16} />}
          placeholder="受注番号・顧客名で検索"
          aria-label="受注を検索"
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            resetPage();
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
            resetPage();
          }}
          clearable
        />
      </Group>
      <Table.ScrollContainer minWidth={760}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>受注番号</Table.Th>
              <Table.Th>顧客</Table.Th>
              <Table.Th ta="right">金額</Table.Th>
              <Table.Th>状態</Table.Th>
              <Table.Th>担当者</Table.Th>
              <Table.Th>受注日</Table.Th>
              <Table.Th w={48} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>{order.id}</Table.Td>
                <Table.Td>{order.customer}</Table.Td>
                <Table.Td ta="right">{yen(order.amount)}</Table.Td>
                <Table.Td>
                  <Badge color={STATUS[order.status].color} variant="light">
                    {STATUS[order.status].label}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    <Avatar size="sm">{order.staff.charAt(0)}</Avatar>
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
    </Card>
  );
}

function InquiriesCard() {
  return (
    <Card h="100%">
      <Stack gap={4} mb="md">
        <Title order={4} component="h2">
          問い合わせの対応状況
        </Title>
        <Text size="sm" c="dimmed">
          今月受け付けた 100 件の内訳
        </Text>
      </Stack>
      <Progress.Root size="lg" mb="md">
        {INQUIRIES.map((item) => (
          <Progress.Section
            key={item.label}
            value={item.value}
            color={item.color}
            aria-label={item.label}
          />
        ))}
      </Progress.Root>
      <Group gap="lg">
        {INQUIRIES.map((item) => (
          <Group key={item.label} gap={6}>
            <Badge color={item.color} variant="dot">
              {item.label}
            </Badge>
            <Text size="sm">{item.value} 件</Text>
          </Group>
        ))}
      </Group>
    </Card>
  );
}

function BestSellersCard() {
  return (
    <Card h="100%" aria-busy="true">
      <Stack gap={4} mb="md">
        <Title order={4} component="h2">
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
  const [opened, { toggle }] = useDisclosure(false);

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
              aria-label="メニューを開閉"
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
      <AppShell.Navbar p="sm">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={1} size="h2">
              ダッシュボード
            </Title>
            <Text c="dimmed">2026 年 10 月 31 日時点の状況</Text>
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
