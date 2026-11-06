import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Anchor,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Pagination,
  Progress,
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
import { AreaChart } from '@mantine/charts';
import '@mantine/charts/styles.layer.css';
import { IconPlus, IconSearch, IconTrendingUp } from '@tabler/icons-react';
import { AppFrame, CONTENT_BREAKPOINTS, ICON_SIZE } from './shared/AppFrame';
import {
  ALL_PRODUCTS,
  ATTENTION_COLOR,
  INQUIRIES,
  isoDate,
  needsReorder,
  NOW,
  ORDER_STATUS,
  ORDERS,
  STAFF,
  sum,
  yen,
  type Order,
  type OrderStatus,
} from './shared/data';
import { OrderLink } from './shared/OrderLink';
import { OrderMenu } from './shared/OrderMenu';
import { OrderStatusBadge } from './shared/OrderStatusBadge';

const meta = {
  title: '画面例 / ダッシュボード',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // The screen needs its own viewport (AppShell, container queries), so the docs page draws it in an iframe.
      story: { inline: false, height: '1000px' },
      description: {
        component:
          '架空の販売管理サービスのダッシュボードです。\n\n' +
          '**目的と読み手**　受注・在庫・問い合わせを扱う社員が、サイドバーの「ホーム」から毎日くり返し開く画面です。今月の実績と、いま対応が要るものを開いてすぐに確かめ、対応する画面へ進むことを目的にしています。\n\n' +
          '**情報構造**　受注・商品（在庫）・問い合わせの 3 つの対象を、それぞれの画面へ入る前の要約として扱います。主は最上段の 4 つの数字（今月の受注額と、対応が要る未発送の受注・発注が必要な品目・未対応の問い合わせの件数）で、受注の推移・品目ごとの在庫・最近の受注・問い合わせの内訳は、その数字の中身を示す従の情報です。受注は顧客と担当者に、商品は在庫数・発注点・適正在庫に結び付きます。\n\n' +
          '**データパターン**　数字は 4 つで、金額は 7 桁、件数は 0〜2 桁です。受注の推移は 1 日 1 点で 7・31・90 日、在庫は全 12 品目（うち 4 品目が発注点割れ）のうち発注点に近い 5 品目、受注は 10 月 14 日〜31 日の 36 件（うち未発送 5 件、そのうち受注から 2 日以上は 2 件。金額は 1 件 ¥495〜¥171,325、顧客名は 3〜7 文字）を 8 件ずつ表示します。対応が要る件数は 0 になることがあり、そのときは「要発送」などの Badge を出さず、補足を「未発送の受注はありません。」のように替えます。状態は story『ダッシュボード』の 1 つにまとめ、その中に、集計中の部分（「今週の売れ筋」の読み込み中の表示）と、検索・絞り込みに当たる受注が無いとき（受注の表で操作すると出る「条件に合う受注はありません」）を含みます。画面全体の読み込み中と取得の失敗、件数が 0 のときの story はありません。\n\n' +
          '**情報の流れ**　利用者はまず最上段の左端で今月の受注額をつかみ、続く 3 枚（未発送の受注、発注が必要な品目、未対応の問い合わせ）の件数から、今日対応が要るものがあるかを判断します。対応が要れば、そのカードのリンクから、受注一覧の未発送・発注が必要な品目・未対応の問い合わせの画面へ進んで対応します。どの品目や受注かをこの画面で先に確かめたいときは、下の在庫の残りと最近の受注を見ます。\n\n' +
          '**主役**　流れの起点で、判断の場でもある最上段の 4 つの数字です。対応が要る 3 つの件数を受注額と同じ段に並べ、件数が 1 以上のものにだけ色の Badge を付けて、数字を見渡した目が対応の要るカードに留まるようにしました。そのカードの下の端に、数字と同じ対象を名前にしたリンク（「未発送の受注を見る」「発注が必要な品目を見る」「未対応の問い合わせを見る」）を置き、判断した場所からそのまま対応へ進めるようにしています。スマホの幅では 4 枚を 1 列に並べたまま数字をラベルの右に上げ、4 つの数字とリンクが最初の 1 画面に収まるようにしました。2 列にすると受注額の 7 桁が数字の大きさのまま入らないためです。\n\n' +
          '**抑えたもの・使わなかったもの**　カード全体はリンクにせず、行き先を名前にしたリンクを置きました。カード全体だと、読み上げでカードの文がすべてリンクの名前になり、行き先が伝わりにくいためです。対応の判断に使わない新規顧客の数は最上段に置かず、増えた受注額は良い知らせでも対応は要らないので枠線だけの Badge にし、どの問い合わせに対応するかを示さない問い合わせの内訳は、未対応の数字の近くに上げず下の段に置いています。最近の受注は要約なので、受注一覧の画面例とは状態のタブ（同じ 5 つの状態と件数、スマホの幅で 2 段に折り返す pills）・受注番号のリンク・行のメニュー・件数の表示の言い方・スマホの幅での 1 件ずつのまとまりだけを揃え、品目の列や並べ替えは持たせていません。タブの件数を一覧と揃えたのは、ここで見た件数が一覧に移っても同じであるためです。\n\n' +
          '**目的が違えば変わるところ**　管理者が月に 1 度、前月と比べるために見る画面なら、対応を促す色とリンクよりも推移のグラフと前月比を主役にします。対応すべきものが受注の発送だけのサービスなら、最上段の数字よりも未発送の受注の一覧を最上段に置きます。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Every name and number below is fictional. Figures that appear twice on the screen are computed from one source.

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

const DAY = 24 * 60 * 60 * 1000;
const NOT_SHIPPED = ORDERS.filter((order) => order.status === 'notShipped');
const NOT_SHIPPED_LATE = NOT_SHIPPED.filter(
  (order) => Date.parse(NOW.date) - Date.parse(isoDate(order.date)) >= 2 * DAY,
).length;

// The count covers every product, as the product list and the stock screen do, not only the ones the card shows.
const REORDER_COUNT = ALL_PRODUCTS.filter(needsReorder).length;
// The card shows the products nearest their reorder point, so every product below it comes first; at least five,
// so a product about to fall below it shows too.
const STOCK_ROWS = [...ALL_PRODUCTS]
  .sort((a, b) => a.quantity / a.reorderPoint - b.quantity / b.reorderPoint)
  .slice(0, Math.max(5, REORDER_COUNT));

interface Stat {
  label: string;
  value: string;
  note: string;
  /** A good or neutral change: outlined, no attention color. */
  trend?: string;
  /** What the user should do, in the attention color. Only set while there is something to act on. */
  attention?: string;
  /** The screen where the user acts on the number. */
  link?: string;
}

// A count the user acts on: the attention badge and the note follow the count, so 0 takes no color.
function actionStat(stat: {
  label: string;
  count: number;
  attention: string;
  note: string;
  noneNote: string;
  link: string;
}): Stat {
  const due = stat.count > 0;
  return {
    label: stat.label,
    value: String(stat.count),
    note: due ? stat.note : stat.noneNote,
    attention: due ? stat.attention : undefined,
    link: stat.link,
  };
}

// The result first, then the three counts that ask for action. Order counts sit above the chart of orders and
// the stock count above the stock card.
const STATS: Stat[] = [
  {
    label: '受注額',
    value: yen(sum(OCTOBER)),
    note: `9 月より ${OCTOBER_GROWTH.toFixed(1)}% 多いです。`,
    trend: `+${OCTOBER_GROWTH.toFixed(1)}%`,
  },
  actionStat({
    label: '未発送の受注',
    count: NOT_SHIPPED.length,
    attention: '要発送',
    note: `${NOT_SHIPPED_LATE} 件は受注から 2 日以上です。`,
    noneNote: '未発送の受注はありません。',
    link: '未発送の受注を見る',
  }),
  actionStat({
    label: '発注が必要な品目',
    count: REORDER_COUNT,
    attention: '要発注',
    note: '発注点を下回っています。',
    noneNote: '発注点を下回る品目はありません。',
    link: '発注が必要な品目を見る',
  }),
  actionStat({
    label: '未対応の問い合わせ',
    count: INQUIRIES.open,
    attention: '要対応',
    note: `${INQUIRIES.overdue} 件は受付から 2 日以上です。`,
    noneNote: '未対応の問い合わせはありません。',
    link: '未対応の問い合わせを見る',
  }),
];

type StatusTab = 'all' | OrderStatus;

// The same states, order and counts as the order list's tabs, so a count read here is the one found there.
const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'すべて' },
  ...(['notShipped', 'paymentPending', 'shipped', 'cancelled'] as const).map((value) => ({
    value,
    label: ORDER_STATUS[value].label,
  })),
];

const PAGE_SIZE = 8;

/*
 * The card itself is not a link: a whole-card link reads every line as its name and hides where it goes. A link
 * named after its destination is one Tab stop that says what pressing it does.
 */
function StatCard({ stat }: { stat: Stat }) {
  const label = (
    <Text size="sm" c="dimmed">
      {stat.label}
    </Text>
  );
  const badge = stat.attention ? (
    <Badge color={ATTENTION_COLOR}>{stat.attention}</Badge>
  ) : stat.trend ? (
    <Badge variant="outline" leftSection={<IconTrendingUp size={12} />}>
      {stat.trend}
    </Badge>
  ) : null;
  const value = <Text variant="metric">{stat.value}</Text>;
  const details = (
    <Stack gap="xs">
      <Text size="sm" c="dimmed">
        {stat.note}
      </Text>
      {stat.link && (
        <Anchor href="#" size="sm">
          {stat.link}
        </Anchor>
      )}
    </Stack>
  );

  return (
    <Card>
      {/*
       * On a phone the four cards stack in one column, so the figure moves up beside its label and the four fit on the
       * first screen. Two columns would not hold the amount at the metric size.
       */}
      <Stack gap="xs" hiddenFrom="xs">
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <Group gap="xs" wrap="nowrap">
            {label}
            {badge}
          </Group>
          {value}
        </Group>
        {details}
      </Stack>
      <Stack gap="lg" visibleFrom="xs">
        <Stack gap="xs">
          <Group justify="space-between" wrap="nowrap">
            {label}
            {badge}
          </Group>
          {value}
        </Stack>
        {details}
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
        // Equal steps between the dates, so the last label does not jump closer than the others on a narrow chart.
        xAxisProps={{ minTickGap: 24, interval: 'equidistantPreserveStart' }}
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
          発注点に近い {STOCK_ROWS.length} 品目の在庫数と適正在庫です。
        </Text>
      </Stack>
      <Stack gap="md">
        {STOCK_ROWS.map((item) => {
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

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
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
          {orders.map((order) => (
            <Table.Tr key={order.id}>
              <Table.Td>
                <OrderLink order={order} />
              </Table.Td>
              <Table.Td>{order.customer.name}</Table.Td>
              <Table.Td ta="right">{yen(order.amount)}</Table.Td>
              <Table.Td>
                <OrderStatusBadge status={order.status} />
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
                <OrderMenu order={order} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

/*
 * On a phone the table would leave the state, the red "未発送", behind a horizontal scroll. Each order becomes a
 * short block, as on the order list, with the number and the state on the first line.
 */
function OrdersStack({ orders }: { orders: Order[] }) {
  return (
    <Stack gap={0} role="list" aria-label="最近の受注">
      {orders.map((order, index) => (
        <Stack key={order.id} gap={0} role="listitem">
          {index > 0 && <Divider />}
          <Stack gap={4} py="sm">
            <Group justify="space-between" wrap="nowrap" gap="xs">
              <Group gap="xs" wrap="nowrap">
                <OrderLink order={order} />
                <OrderStatusBadge status={order.status} />
              </Group>
              <OrderMenu order={order} />
            </Group>
            <Group justify="space-between" wrap="nowrap" gap="sm">
              <Text size="sm" truncate>
                {order.customer.name}
              </Text>
              <Text size="sm">{yen(order.amount)}</Text>
            </Group>
            <Text size="sm" c="dimmed">
              {order.date}・{order.staff}
            </Text>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

const matchesConditions = (order: Order, { query, staff }: OrderFilters) => {
  const keyword = query.trim().toUpperCase();
  return (
    (!staff || order.staff === staff) &&
    (keyword === '' || order.id.includes(keyword) || order.customer.name.includes(keyword))
  );
};

function OrdersPanel({
  orders,
  filters,
  onChange,
}: {
  orders: Order[];
  filters: OrderFilters;
  onChange: (next: Partial<OrderFilters>) => void;
}) {
  const { staff, page } = filters;
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const rows = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = first + rows.length - 1;

  return (
    <>
      <Group my="md" gap="sm" wrap="wrap">
        <TextInput
          flex="1 1 240px"
          leftSection={<IconSearch size={ICON_SIZE} />}
          placeholder="受注番号・顧客名で検索"
          aria-label="受注を検索"
          value={filters.query}
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
      {rows.length === 0 ? (
        // A status region, so a screen reader hears that the conditions left nothing.
        <Text size="sm" c="dimmed" ta="center" py="lg" role="status">
          条件に合う受注はありません。
        </Text>
      ) : (
        <>
          <Stack visibleFrom="sm" gap={0}>
            <OrdersTable orders={rows} />
          </Stack>
          <Stack hiddenFrom="sm" gap={0}>
            <OrdersStack orders={rows} />
          </Stack>
          <Group justify="space-between" mt="md" gap="sm">
            {/* A status region, so a screen reader hears the new count after each change of the conditions. */}
            <Text size="sm" c="dimmed" role="status">
              {orders.length} 件中 {first}〜{last} 件を表示
            </Text>
            <Pagination
              total={totalPages}
              value={page}
              onChange={(next) => onChange({ page: next })}
            />
          </Group>
        </>
      )}
    </>
  );
}

function OrdersCard() {
  // The search and staff filter live outside the tabs so switching tabs keeps them.
  const [tab, setTab] = useState<StatusTab>('all');
  const [filters, setFilters] = useState<OrderFilters>({ query: '', staff: null, page: 1 });
  const updateFilters = (next: Partial<OrderFilters>) =>
    setFilters((current) => ({ ...current, ...next }));
  // The tab counts follow the search and the staff filter, as on the order list.
  const matching = ORDERS.filter((order) => matchesConditions(order, filters));
  const ordersOf = (status: StatusTab) =>
    status === 'all' ? matching : matching.filter((order) => order.status === status);

  return (
    <Card>
      <Group justify="space-between" mb="md">
        <Title order={2} size="h5">
          最近の受注
        </Title>
        <Button variant="outline" leftSection={<IconPlus size={ICON_SIZE} />}>
          受注を登録
        </Button>
      </Group>
      {/* Pills, as on the order list: on a phone they wrap into two rows and every count stays in view. */}
      <Tabs
        variant="pills"
        value={tab}
        onChange={(value) => {
          setTab((value as StatusTab | null) ?? 'all');
          updateFilters({ page: 1 });
        }}
        keepMounted={false}
      >
        <Tabs.List>
          {STATUS_TABS.map((item) => {
            const count = ordersOf(item.value).length;
            const attention =
              item.value !== 'all' && ORDER_STATUS[item.value].attention && count > 0;
            return (
              <Tabs.Tab
                key={item.value}
                value={item.value}
                rightSection={
                  <Badge color={attention ? ATTENTION_COLOR : undefined}>{count}</Badge>
                }
              >
                {item.label}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {STATUS_TABS.map((item) => (
          <Tabs.Panel key={item.value} value={item.value}>
            <OrdersPanel orders={ordersOf(item.value)} filters={filters} onChange={updateFilters} />
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
          10 月に受け付けた {INQUIRIES.total} 件の対応状況です。
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
          集計しています。
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
  return (
    <AppFrame parent="ホーム" page="ダッシュボード">
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
        {/* The breakdown shows the month's progress, not which inquiry to answer, so it stays with the results. */}
        <Grid type="container" breakpoints={CONTENT_BREAKPOINTS}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <InquiriesCard />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <BestSellersCard />
          </Grid.Col>
        </Grid>
      </Stack>
    </AppFrame>
  );
}

export const Dashboard: Story = {
  name: 'ダッシュボード',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、10 月 31 日時点で読み込みが済み、対応が要る 3 つの件数がどれも 1 以上の状態です。集計の終わっていない「今週の売れ筋」だけを読み込み中の表示（Skeleton）にしてほかのカードは待たせずに見せ、最近の受注は検索・絞り込みに当たる受注が無くなると、表と件数の表示に替えてその旨を出します。',
      },
    },
  },
  render: () => <DashboardPage />,
};
