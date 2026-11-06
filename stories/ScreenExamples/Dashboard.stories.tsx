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
  Progress,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
  VisuallyHidden,
} from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import '@mantine/charts/styles.layer.css';
import { IconPlus, IconTrendingUp } from '@tabler/icons-react';
import { AppFrame } from './shared/AppFrame';
import { CONTENT_BREAKPOINTS, ICON_SIZE } from './shared/constants';
import {
  ALL_PRODUCTS,
  ATTENTION_COLOR,
  INQUIRIES,
  isoDate,
  LATE_DAYS,
  lateDays,
  monthDay,
  needsReorder,
  ORDERS,
  SALES,
  sum,
  yen,
  type Order,
  type Product,
} from './shared/data';
import { OrderLink } from './shared/OrderLink';
import { OrderMenu } from './shared/OrderMenu';
import { OrderStatusBadge } from './shared/OrderStatusBadge';
import { ReorderBadge } from './shared/ReorderBadge';
import { SectionCard } from './shared/SectionCard';

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
          '**情報構造**　受注・商品（在庫）・問い合わせの 3 つの対象を、それぞれの画面へ入る前の要約として扱います。主は最上段の 4 つの数字（今月の受注額と、対応が要る未発送の受注・発注が必要な品目・未対応の問い合わせの件数）で、受注の推移・品目ごとの在庫・最近の受注・問い合わせの内訳は、その数字の中身を示す従の情報です。最近の受注は前に開いてから入った受注の要約で、受注を探すことは受注一覧の画面に任せます。受注は顧客と担当者に、商品は在庫数・発注点・適正在庫に結び付きます。\n\n' +
          '**データパターン**　数字は 4 つで、金額は 7 桁、件数は 0〜2 桁です。受注の推移は 1 日 1 点で 7・31・90 日、在庫は全 12 品目（うち 4 品目が発注点割れ）のうち発注点に近い 5 品目で、品目ごとに在庫数・発注点・適正在庫（2〜3 桁）を持ちます。受注は 10 月 14 日〜31 日の 36 件（うち未発送 5 件、そのうち受注から 2 日以上は 2 件。金額は 1 件 ¥495〜¥171,325、顧客名は 3〜7 文字）のうち、受注日が新しい 5 件を表示します。今週の売れ筋は、10 月 26 日からの受注（キャンセル済みを除く）で受注額が多い 3 品目です。対応が要る件数は 0 になることがあり、そのときは「要発送」などの Badge を出さず、補足を「未発送の受注はありません。」のように替えます。状態は story『ダッシュボード』の 1 つにまとめ、その中に集計中の部分（「今週の売れ筋」の読み込み中の表示）を含みます。画面全体の読み込み中と取得の失敗、件数が 0 のときの story はありません。\n\n' +
          '**情報の流れ**　利用者はまず最上段の左端で今月の受注額をつかみ、続く 3 枚（未発送の受注、発注が必要な品目、未対応の問い合わせ）の件数から、今日対応が要るものがあるかを判断します。対応が要れば、そのカードのリンクから、受注一覧の未発送・発注が必要な品目・未対応の問い合わせの画面へ進んで対応します。どの品目かをこの画面で先に確かめたいときは下の在庫の残りを、前に開いてから入った受注は最近の受注を見て、受注を探すときは最近の受注の下のリンクから受注一覧へ移ります。\n\n' +
          '**主役**　流れの起点で、判断の場でもある最上段の 4 つの数字です。対応が要る 3 つの件数を受注額と同じ段に並べ、件数が 1 以上のものにだけ色の Badge を付けて、数字を見渡した目が対応の要るカードに留まるようにしました。そのカードの下の端に、数字と同じ対象を名前にしたリンク（「未発送の受注を見る」「発注が必要な品目を見る」「未対応の問い合わせを見る」）を置き、判断した場所からそのまま対応へ進めるようにしています。スマホの幅では 4 枚を 1 列に並べたまま数字をラベルの右に上げ、4 つの数字とリンクが最初の 1 画面に収まるようにしました。2 列にすると受注額の 7 桁が数字の大きさのまま入らないためです。ラベルと Badge の右に収まらない狭い幅では、数字を Badge に重ねず、広い幅と同じくラベルの下の行に下ろします。\n\n' +
          '**抑えたもの・使わなかったもの**　カード全体はリンクにせず、行き先を名前にしたリンクを置きました。カード全体だと、読み上げでカードの文がすべてリンクの名前になり、行き先が伝わりにくいためです。対応の判断に使わない新規顧客の数は最上段に置かず、増えた受注額は良い知らせでも対応は要らないので枠線だけの Badge にし、どの問い合わせに対応するかを示さない問い合わせの内訳は、未対応の数字の近くに上げず下の段に置いています。最近の受注は新しい 5 件に絞り、状態のタブ・検索・絞り込み・ページ送りを持たせず、末尾に「受注一覧を見る」を置きました。ここで受注を探し始めると画面が受注一覧と同じ長さに伸び、下のカードが遠くなるうえ、対応が要る受注への入口は最上段のカードが既に担っているためです。受注一覧の画面例とは、受注番号のリンク・状態の Badge・行のメニュー・スマホの幅での 1 件ずつのまとまりを揃えています。在庫の残りは、棒を赤くする基準の発注点と、棒がいっぱいになる適正在庫を品目ごとに棒の下へ書き、補足には母数（全 12 品目）を書きました。問い合わせの対応状況の帯は対応済み・対応中・未対応の 3 区間に分け、色は未対応の区間と、その名前の前の点にだけ付けました。最上段とサイドバーで赤く示す同じ 14 件を、ここでも対応が要るものとして扱うためです。\n\n' +
          '**目的が違えば変わるところ**　管理者が月に 1 度、前月と比べるために見る画面なら、対応を促す色とリンクよりも推移のグラフと前月比を主役にします。対応すべきものが受注の発送だけのサービスなら、最上段の数字よりも未発送の受注の一覧を最上段に置きます。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Every name and number below is fictional. The figures are derived from the shared data (the daily SALES, ORDERS,
// the products), so a figure that appears twice on the screen comes from one source.

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

const NOT_SHIPPED = ORDERS.filter((order) => order.status === 'notShipped');
const NOT_SHIPPED_LATE = NOT_SHIPPED.filter((order) => lateDays(order) !== undefined).length;

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
    note: `${NOT_SHIPPED_LATE} 件は受注から ${LATE_DAYS} 日以上です。`,
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

// ORDERS is newest first.
const RECENT_ORDERS = ORDERS.slice(0, 5);

// This week runs from Monday, October 26, to the day the screens show. Cancelled orders sold nothing.
const WEEK_START = '10/26';
const BEST_SELLER_COUNT = 3;
const BEST_SELLERS = (() => {
  const totals = new Map<string, { product: Product; quantity: number; amount: number }>();
  for (const order of ORDERS) {
    if (order.status === 'cancelled' || isoDate(order.date) < isoDate(WEEK_START)) continue;
    for (const line of order.lines) {
      const total = totals.get(line.product.code) ?? {
        product: line.product,
        quantity: 0,
        amount: 0,
      };
      total.quantity += line.quantity;
      total.amount += line.unitPrice * line.quantity;
      totals.set(line.product.code, total);
    }
  }
  // Products count in different units, so the amount sold ranks them.
  return [...totals.values()].sort((a, b) => b.amount - a.amount).slice(0, BEST_SELLER_COUNT);
})();

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
        <Group>
          <Anchor href="#" size="sm">
            {stat.link}
          </Anchor>
        </Group>
      )}
    </Stack>
  );

  return (
    <Card>
      {/*
       * On a phone the four cards stack in one column, so the figure moves up beside its label and the four fit on the
       * first screen. Two columns would not hold the amount at the metric size. The row wraps, so where the figure does
       * not fit beside the label and the badge, it goes to the next line under them, as on a wider screen, instead of
       * running over the badge.
       */}
      <Stack gap="xs" hiddenFrom="xs">
        <Group justify="space-between" gap="xs">
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
    <SectionCard
      h="100%"
      title="受注の推移"
      description={`${first}〜${last} の合計 ${yen(sum(data.map((point) => point.amount)))}`}
      actions={
        <SegmentedControl
          data={PERIODS}
          value={period}
          onChange={setPeriod}
          aria-label="表示する期間"
        />
      }
    >
      {/* As tall as the stock card beside it, whose rows name the reorder point and the target stock. */}
      <AreaChart
        h={300}
        data={data}
        dataKey="date"
        series={[{ name: 'amount', label: '受注額', color: 'var(--efoo-chart-1)' }]}
        valueFormatter={yen}
        yAxisProps={{ width: 80 }}
        // Equal steps between the dates, so the last label does not jump closer than the others on a narrow chart.
        xAxisProps={{ minTickGap: 24, interval: 'equidistantPreserveStart' }}
      />
    </SectionCard>
  );
}

function StockCard() {
  return (
    <SectionCard
      h="100%"
      title="在庫の残り"
      description={`全 ${ALL_PRODUCTS.length} 品目のうち発注点に近い ${STOCK_ROWS.length} 品目です。`}
    >
      <Stack gap="sm">
        {STOCK_ROWS.map((item) => {
          const reorder = needsReorder(item);
          return (
            <Stack key={item.name} gap={6}>
              <Group justify="space-between" wrap="nowrap" gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <Text size="sm">{item.name}</Text>
                  {reorder && <ReorderBadge />}
                </Group>
                <Text size="sm">
                  {item.quantity} {item.unit}
                </Text>
              </Group>
              <Progress
                value={Math.min(100, (item.quantity / item.target) * 100)}
                color={reorder ? ATTENTION_COLOR : undefined}
                aria-label={`${item.name}の在庫 ${item.quantity} ${item.unit}（適正在庫 ${item.target} ${item.unit}、発注点 ${item.reorderPoint} ${item.unit}）`}
              />
              {/*
               * The reorder point is what turns a bar red, and the bar is full at the target stock, so both are named
               * under it. A row of their own keeps the name, the badge and the stock on one line on a phone.
               */}
              <Text size="xs" c="dimmed">
                発注点 {item.reorderPoint} {item.unit}・適正在庫 {item.target} {item.unit}
              </Text>
            </Stack>
          );
        })}
      </Stack>
    </SectionCard>
  );
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

/*
 * The newest few orders, to see what came in since the last look. Finding an order is the order list's work, so the
 * card has no search, filter or paging and ends in the link to that list; the stat cards above lead to the orders
 * that need action.
 */
function OrdersCard() {
  return (
    <SectionCard
      title="最近の受注"
      description={`受注日が新しい ${RECENT_ORDERS.length} 件です。`}
      actions={
        <Button variant="outline" leftSection={<IconPlus size={ICON_SIZE} />}>
          受注を登録
        </Button>
      }
    >
      <Stack visibleFrom="sm" gap={0}>
        <OrdersTable orders={RECENT_ORDERS} />
      </Stack>
      <Stack hiddenFrom="sm" gap={0}>
        <OrdersStack orders={RECENT_ORDERS} />
      </Stack>
      {/* A group, so the link is as wide as its name and not the whole card. */}
      <Group mt="md">
        <Anchor href="#" size="sm">
          受注一覧を見る
        </Anchor>
      </Group>
    </SectionCard>
  );
}

/*
 * One bar in three parts, so the share still open shows beside what is done and what is under way. Only the open part
 * asks for action, so only it takes the attention color, as the same 14 does at the top and in the sidebar. The labels
 * carry the colors of their parts as dots, so the parts are read by name and not only by their place. The part under
 * way takes the theme's secondary text color, the one neutral that stands apart from the primary in both schemes.
 */
function InquiriesCard() {
  const rows = [
    { label: '対応済み', value: INQUIRIES.done, color: undefined },
    { label: '対応中', value: INQUIRIES.inProgress, color: 'var(--mantine-color-dimmed)' },
    { label: '未対応', value: INQUIRIES.open, color: ATTENTION_COLOR },
  ];

  return (
    <SectionCard
      h="100%"
      title="問い合わせの対応状況"
      description={`10 月に受け付けた ${INQUIRIES.total} 件の対応状況です。`}
    >
      <Progress.Root mb="md">
        {rows.map((row) => (
          <Progress.Section
            key={row.label}
            value={(row.value / INQUIRIES.total) * 100}
            color={row.color}
            aria-label={`${row.label} ${row.value} 件 / ${INQUIRIES.total} 件`}
          />
        ))}
      </Progress.Root>
      <SimpleGrid cols={3}>
        {rows.map((row) => (
          <Stack key={row.label} gap={4} align="flex-start">
            <Badge variant="dot" color={row.color}>
              {row.label}
            </Badge>
            <Text variant="metric">{row.value}</Text>
          </Stack>
        ))}
      </SimpleGrid>
    </SectionCard>
  );
}

/*
 * Waiting is said the same way on every screen: the skeletons hold the place for the eye, and a status line that only a
 * screen reader reads says what is on its way, since the skeletons say nothing to it. The line stays in place empty
 * once the products are shown, so a screen reader reads it when the card starts waiting again, and sits outside the
 * aria-busy part, where a screen reader may hold back what changes until the wait is over.
 */
function BestSellersCard({ loading }: { loading: boolean }) {
  return (
    <SectionCard
      h="100%"
      title="今週の売れ筋"
      description={`${monthDay(WEEK_START)}からの受注額が多い ${BEST_SELLER_COUNT} 品目です。`}
    >
      <VisuallyHidden role="status">{loading ? '今週の売れ筋を集計しています' : ''}</VisuallyHidden>
      {loading ? (
        <Stack gap="sm" aria-busy="true">
          {Array.from({ length: BEST_SELLER_COUNT }, (_, row) => (
            <Stack key={row} gap={6}>
              <Group justify="space-between" wrap="nowrap" gap="xs">
                <Skeleton height={12} width="60%" />
                <Skeleton height={12} width={64} />
              </Group>
              <Skeleton height={12} width="30%" />
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack gap="sm" role="list" aria-label="今週の売れ筋">
          {BEST_SELLERS.map((item) => (
            <Stack key={item.product.code} gap={6} role="listitem">
              <Group justify="space-between" wrap="nowrap" gap="xs">
                <Text size="sm">{item.product.name}</Text>
                <Text size="sm">{yen(item.amount)}</Text>
              </Group>
              <Text size="xs" c="dimmed">
                {item.quantity} {item.product.unit}
              </Text>
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
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
        <SimpleGrid
          type="container"
          cols={{ base: 1, [CONTENT_BREAKPOINTS.xs]: 2, [CONTENT_BREAKPOINTS.lg]: 4 }}
        >
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
            {/* The week's totals are still being counted when the screen opens; the other cards do not wait. */}
            <BestSellersCard loading />
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
          'データパターンのうち、10 月 31 日時点で読み込みが済み、対応が要る 3 つの件数がどれも 1 以上の状態です。集計の終わっていない「今週の売れ筋」だけを読み込み中の表示（Skeleton）にして、ほかのカードは待たせずに見せています。Skeleton はスクリーンリーダーに何も伝えないので、読み上げだけに届く「今週の売れ筋を集計しています」の行（role="status"）を添え、集計が終わって品目を出した後も、次に集計を始めたときに読み上げられるよう空のまま残します。読み込み中の表し方は、ほかの画面例と同じです。',
      },
    },
  },
  render: () => <DashboardPage />,
};
