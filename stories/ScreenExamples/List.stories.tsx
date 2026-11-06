import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useId, useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  EmptyState,
  Group,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
  useMatches,
  VisuallyHidden,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconArrowsSort,
  IconCalendar,
  IconPlus,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { AppFrame } from './shared/AppFrame';
import { ICON_SIZE } from './shared/constants';
import {
  ATTENTION_COLOR,
  CURRENT_USER,
  isoDate,
  lateDays,
  monthDay,
  NOW,
  ORDER_STATUS,
  ORDERS,
  STAFF,
  yen,
  type Order,
  type OrderStatus,
} from './shared/data';
import { OrderLink } from './shared/OrderLink';
import { OrderMenu } from './shared/OrderMenu';
import { OrderStatusBadge } from './shared/OrderStatusBadge';

const meta = {
  title: '画面例 / 一覧（表）',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // AppShell places the frame with position: fixed, so each story is drawn in an iframe of its own.
      story: { inline: false, height: '900px' },
      description: {
        component:
          '架空の販売管理サービスの受注一覧の画面です。\n\n' +
          '**目的と読み手**　受注と出荷を受け持つ担当者が、毎日何度も開く画面です。電話で問い合わせを受けた受注を探す、今日発送する受注を拾う、という短い用事のたびに開き、目当ての受注の詳細へ移ります。\n\n' +
          '**情報構造**　主は受注で、1 件ごとに顧客（1 社）、明細（1〜3 品目）、担当者、状態、金額、受注日が従います。状態（未発送・入金待ち・発送済み・キャンセル済み）は受注を仕事のまとまりに分ける軸で、明細の中身や配送先・履歴は詳細の画面に任せます。\n\n' +
          '**データパターン**　項目は受注番号・顧客・品目・金額・状態・担当者・受注日の 7 つです。件数は 10 月 14 日〜31 日の 36 件（未発送 5・入金待ち 4・発送済み 24・キャンセル済み 3）で、未発送と入金待ちのほとんどは直近の数日の受注、古い受注はほとんどが発送済みです。未発送のうち 2 件は受注から 2 日以上たっており（2 日と 6 日）、ダッシュボードの「2 件は受注から 2 日以上です」はこの 2 件です。1 社の受注に複数の状態が混ざり、絞り込むと 0〜36 件になります。値の長さは、顧客名が 3〜7 字、品目が「付箋 75mm 角」から「A4 コピー用紙（500 枚） ほか 2 品目」まで、金額が 4〜6 桁です。状態は、読み込み後（story『受注一覧』）、0 件（story『絞り込みに当たる受注が無いとき』）、読み込み中（story『読み込み中』）、取得の失敗（story『読み込みに失敗したとき』）です。\n\n' +
          '**情報の流れ**　開いた担当者は、まず状態ごとの件数で今日の仕事の量（未発送が何件か）を知ります。未発送の中で急ぐものは、状態の Badge の隣の「受注から 6 日」で見分けます。次に状態のタブ・検索・担当者・受注日で対象を絞り、行の状態・顧客・金額を見比べて目当ての受注を決め、受注番号から詳細へ移ります。受注の登録は電話や FAX を受けたときに始まる別の流れです。\n\n' +
          '**主役**　流れの順に、件数付きの状態のタブ、絞り込みの欄、表を上から並べ、詳細への道である受注番号を行の左端のリンクにしました。状態のタブは、どの幅でも 5 つの状態の件数が並んで見える pills にし、スマホの幅では 2 段に折り返します。スマホの幅では、短い用事のたびに最初に使う検索だけを出し、担当者・受注日・並び順は「絞り込み・並べ替え」のボタンから開くようにして、開いた最初の画面に受注が見えるようにしました。ボタンには中でかかっている条件の数を出します。担当者・受注日・並べ替えの欄には見える名前を付け、値を選んだあとも何で絞っているかが読めるようにしました。空の欄は、状態のタブと同じ「すべて」と出します。色は未発送の件数、未発送の状態、受注から 2 日以上たった未発送の日数にだけ使い、最初に目に入るのが対応の要る受注になるようにしています。日数は、ダッシュボードの「2 件は受注から 2 日以上です。」と同じ「受注から」の言葉で、状態の Badge のすぐ隣に枠線の赤い Badge として置きました。スマホの幅でも受注番号と同じ 1 行目に並び、灰色の補足の行に埋もれません。ページ全体の操作である「受注を登録」だけを塗りのボタンにし、見出しの右に置きました。\n\n' +
          '**抑えたもの・使わなかったもの**　絞り込みの条件は欄そのものが見せるので、条件のチップの列は重ねませんでした。「検索と絞り込みを解除」は欄の並びの端に常に置き、消す条件が無いときは無効にしています。条件ができたときに現れると、入力中の検索欄が細くなって並びが動くためです。状態はタブの「すべて」で戻せるので、このボタンは欄の条件だけを消します。見出しの補足には画面の時点を書き、期間は書きません。表示する受注は条件で決まり、期間で絞ったときは受注日の欄がそれを示すためです。受注からの日数は 2 日以上たった未発送にだけ出し、ほかの行には出していません。どの行にも出すと、急ぐ行が日数の列に紛れるためです。並べ替えは列の見出しではなく欄の 1 つにし、行の操作のメニューには詳細を開く項目を置かず、受注番号のリンクに一本化しました。スマホの幅では、横スクロールで状態と金額が隠れないよう表を 1 件ずつの短いまとまりに組み替えています。状態のタブを選択欄に替えると件数と色が開くまで見えず、横スクロールにすると後ろの状態の件数が隠れるので、どちらも使いませんでした。\n\n' +
          '**目的が違えば変わるところ**　件数が数百件を超えるなら、件数の表示とページ送りに加えて CSV の書き出しや表示件数の切り替えを置きます。絞り込みの条件が 5 つを超えるなら、広い画面でも欄をスマホの幅と同じボタンの中に移し、選んだ条件をチップの列で見せます。項目が 3〜4 つと少なく、スマホで使うことが多いなら、表ではなく 1 件ずつのまとまりの並びを全幅で使ってよいです。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type StatusTab = 'all' | OrderStatus;
type SortKey = 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc';
type DateRange = [string | null, string | null];

interface OrderFilters {
  status: StatusTab;
  query: string;
  staff: string | null;
  dates: DateRange;
  sort: SortKey;
  page: number;
}

const DEFAULT_FILTERS: OrderFilters = {
  status: 'all',
  query: '',
  staff: null,
  dates: [null, null],
  sort: 'dateDesc',
  page: 1,
};

// Every state is a tab: the list is where each state is worked through.
const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'すべて' },
  ...(['notShipped', 'paymentPending', 'shipped', 'cancelled'] as const).map((value) => ({
    value,
    label: ORDER_STATUS[value].label,
  })),
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'dateDesc', label: '受注日が新しい順' },
  { value: 'dateAsc', label: '受注日が古い順' },
  { value: 'amountDesc', label: '金額が大きい順' },
  { value: 'amountAsc', label: '金額が小さい順' },
];

// A page fits a working day's orders at this volume, so most days need no paging.
const PAGE_SIZE = 20;

const SKELETON_ROWS = 8;

// People remember an order by what was in it as often as by its number, so the list names the items.
function itemsSummary(order: Order) {
  const [first, ...rest] = order.lines;
  if (!first) return '';
  return rest.length > 0 ? `${first.product.name} ほか ${rest.length} 品目` : first.product.name;
}

/*
 * The dashboard says how many unshipped orders are two days old or more, in the same words as this badge, so those
 * orders are picked out here without working out dates. It sits with the state it qualifies and takes the attention
 * color as an outline: it asks for action like the state, and stays apart from the state's own badge.
 */
function LateBadge({ order }: { order: Order }) {
  const days = lateDays(order);
  return days === undefined ? null : (
    <Badge color={ATTENTION_COLOR} variant="outline">
      受注から {days} 日
    </Badge>
  );
}

function StatusBadges({ order }: { order: Order }) {
  return (
    <Group gap={4} wrap="nowrap">
      <OrderStatusBadge status={order.status} />
      <LateBadge order={order} />
    </Group>
  );
}

const [asOfDay, asOfTime] = NOW.at.split(' ');

function matchesConditions(order: Order, { query, staff, dates }: OrderFilters) {
  const keyword = query.trim().toUpperCase();
  const [from, to] = dates;
  const day = isoDate(order.date);
  return (
    (!staff || order.staff === staff) &&
    (!from || day >= from) &&
    (!to || day <= to) &&
    (keyword === '' ||
      order.id.includes(keyword) ||
      order.customer.name.includes(keyword) ||
      order.lines.some((line) => line.product.name.toUpperCase().includes(keyword)))
  );
}

// ORDERS is newest first and breaks ties on the date by the order number, so the date orders keep that sequence.
function sortOrders(orders: Order[], sort: SortKey) {
  switch (sort) {
    case 'dateAsc':
      return [...orders].reverse();
    case 'amountDesc':
      return [...orders].sort((a, b) => b.amount - a.amount);
    case 'amountAsc':
      return [...orders].sort((a, b) => a.amount - b.amount);
    default:
      return orders;
  }
}

// The tab is not counted: it has its own way back ("すべて"), and the button clears only the fields it sits with.
const hasFieldConditions = ({ query, staff, dates }: OrderFilters) =>
  query.trim() !== '' || staff !== null || dates[0] !== null || dates[1] !== null;

const CLEARED_FIELDS: Partial<OrderFilters> = {
  query: '',
  staff: null,
  dates: [null, null],
  page: 1,
};

function ariaSort(column: 'date' | 'amount', sort: SortKey) {
  if (column === 'date' && sort.startsWith('date'))
    return sort === 'dateAsc' ? 'ascending' : 'descending';
  if (column === 'amount' && sort.startsWith('amount'))
    return sort === 'amountAsc' ? 'ascending' : 'descending';
  return undefined;
}

/*
 * The widths are set on the headings and the layout is fixed, so the columns stand where they will be while the
 * skeleton rows wait, and do not move when the orders arrive. The items take what is left.
 */
function OrdersTable({ orders, sort }: { orders: Order[] | null; sort: SortKey }) {
  return (
    <Table.ScrollContainer minWidth={960} scrollAreaProps={{ type: 'always' }}>
      <Table highlightOnHover layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={120}>受注番号</Table.Th>
            <Table.Th w={140}>顧客</Table.Th>
            <Table.Th>品目</Table.Th>
            <Table.Th w={110} ta="right" aria-sort={ariaSort('amount', sort)}>
              金額
            </Table.Th>
            <Table.Th w={180}>状態</Table.Th>
            <Table.Th w={130}>担当者</Table.Th>
            <Table.Th w={90} aria-sort={ariaSort('date', sort)}>
              受注日
            </Table.Th>
            <Table.Th w={48}>
              <VisuallyHidden>操作</VisuallyHidden>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders
            ? orders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>
                    <OrderLink order={order} />
                  </Table.Td>
                  <Table.Td>{order.customer.name}</Table.Td>
                  <Table.Td>{itemsSummary(order)}</Table.Td>
                  <Table.Td ta="right">{yen(order.amount)}</Table.Td>
                  <Table.Td>
                    <StatusBadges order={order} />
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
              ))
            : Array.from({ length: SKELETON_ROWS }, (_, row) => (
                <Table.Tr key={row}>
                  <Table.Td>
                    <Skeleton height={12} width={72} />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={12} width={96} />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={12} width={row % 2 ? 160 : 220} />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={12} width={64} ml="auto" />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={20} width={56} />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={12} width={80} />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={12} width={40} />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={28} width={28} />
                  </Table.Td>
                </Table.Tr>
              ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

/*
 * On a phone the eight columns would leave the state and the amount behind a horizontal scroll, and those are what a
 * phone lookup is for. Each order becomes a short block with the same facts in the order they are read.
 */
function OrdersStack({ orders }: { orders: Order[] | null }) {
  const items = orders ?? Array.from({ length: SKELETON_ROWS }, () => null);
  return (
    <Stack gap={0} role="list" aria-label="受注">
      {items.map((order, index) => (
        <Stack key={order?.id ?? index} gap={0} role="listitem">
          {index > 0 && <Divider />}
          {order ? (
            <Stack gap={4} py="sm">
              <Group justify="space-between" wrap="nowrap" gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <OrderLink order={order} />
                  <StatusBadges order={order} />
                </Group>
                <OrderMenu order={order} />
              </Group>
              <Group justify="space-between" wrap="nowrap" gap="sm">
                <Text size="sm" truncate>
                  {order.customer.name}
                </Text>
                <Text size="sm">{yen(order.amount)}</Text>
              </Group>
              {/* The items get a line of their own, so a long name wraps whole instead of breaking after the date. */}
              <Text size="sm" c="dimmed">
                {itemsSummary(order)}
              </Text>
              <Text size="sm" c="dimmed">
                {order.date}・{order.staff}
              </Text>
            </Stack>
          ) : (
            <Stack gap={8} py="sm">
              <Group justify="space-between">
                <Skeleton height={20} width={140} />
                <Skeleton height={12} width={24} />
              </Group>
              <Group justify="space-between">
                <Skeleton height={12} width={110} />
                <Skeleton height={12} width={64} />
              </Group>
              <Skeleton height={12} width="80%" />
              <Skeleton height={12} width={96} />
            </Stack>
          )}
        </Stack>
      ))}
    </Stack>
  );
}

// On a phone the staff, the dates and the order sit behind one button, so the button counts the ones that differ from
// the default; the search stays in view and shows itself.
const tuckedConditionCount = ({ staff, dates, sort }: OrderFilters) =>
  [staff !== null, dates[0] !== null || dates[1] !== null, sort !== DEFAULT_FILTERS.sort].filter(
    Boolean,
  ).length;

function FilterBar({
  filters,
  disabled,
  onChange,
}: {
  filters: OrderFilters;
  disabled: boolean;
  onChange: (next: Partial<OrderFilters>) => void;
}) {
  // The same breakpoint as the switch from the table to the phone blocks below.
  const wide = useMatches({ base: false, sm: true }, { getInitialValueInEffect: false });
  const [opened, setOpened] = useState(false);
  const fieldsId = useId();
  // Flex bases share one row on a wide screen; stacked on a phone, each field takes the full width.
  const flex = (value: string) => (wide ? value : undefined);

  const search = (
    <TextInput
      flex={flex('2 1 240px')}
      leftSection={<IconSearch size={ICON_SIZE} />}
      placeholder="受注番号・顧客名・商品名で検索"
      aria-label="受注を検索"
      value={filters.query}
      disabled={disabled}
      onChange={(event) => onChange({ query: event.currentTarget.value, page: 1 })}
    />
  );
  const fields = (
    <>
      <Select
        flex={flex('1 1 140px')}
        label="担当者"
        placeholder="すべて"
        data={STAFF}
        value={filters.staff}
        disabled={disabled}
        onChange={(value) => onChange({ staff: value, page: 1 })}
        clearable
      />
      <DatePickerInput
        type="range"
        flex={flex('1 1 220px')}
        leftSection={<IconCalendar size={ICON_SIZE} />}
        label="受注日"
        placeholder="すべて"
        // The screen is as of October 31, 2026, so the calendar opens on that month whatever today is.
        defaultDate="2026-10-01"
        maxDate={NOW.date}
        allowSingleDateInRange
        value={filters.dates}
        disabled={disabled}
        onChange={(value) => onChange({ dates: value, page: 1 })}
        clearable
      />
      <Select
        // Never narrower than its longest choice, 受注日が新しい順, which would otherwise be cut short.
        flex={flex('1 0 180px')}
        leftSection={<IconArrowsSort size={ICON_SIZE} />}
        label="並べ替え"
        data={SORTS}
        value={filters.sort}
        disabled={disabled}
        onChange={(value) => onChange({ sort: (value as SortKey | null) ?? 'dateDesc', page: 1 })}
        allowDeselect={false}
      />
    </>
  );
  // Always in place and disabled while there is nothing to clear: appearing on the first typed letter would narrow
  // the field being typed in and shift the row.
  const clear = (
    <Button
      variant="subtle"
      leftSection={<IconX size={ICON_SIZE} />}
      disabled={disabled || !hasFieldConditions(filters)}
      onClick={() => onChange(CLEARED_FIELDS)}
    >
      検索と絞り込みを解除
    </Button>
  );

  /*
   * The fields name themselves above, so what each one narrows by stays in view after a value is chosen; an empty one
   * says すべて, as the first tab does. The search names itself by its placeholder and icon, so its box lines up with
   * the others along their bottom edge.
   */
  if (wide) {
    return (
      <Group my="md" gap="sm" wrap="wrap" align="flex-end">
        {search}
        {fields}
        {clear}
      </Group>
    );
  }

  /*
   * Stacked on a phone, the four fields pushed the first order below the middle of the screen on every visit. The
   * search, the most common way in, stays; the rest open from one button that counts the conditions behind it.
   */
  const tucked = tuckedConditionCount(filters);
  return (
    <Stack my="md" gap="sm">
      {search}
      <Group>
        <Button
          variant="default"
          leftSection={<IconAdjustmentsHorizontal size={ICON_SIZE} />}
          rightSection={tucked > 0 ? <Badge>{tucked}</Badge> : undefined}
          aria-expanded={opened}
          aria-controls={fieldsId}
          disabled={disabled}
          onClick={() => setOpened((current) => !current)}
        >
          絞り込み・並べ替え
        </Button>
      </Group>
      <Collapse expanded={opened} id={fieldsId}>
        <Stack gap="sm">
          {fields}
          <Group>{clear}</Group>
        </Stack>
      </Collapse>
    </Stack>
  );
}

type ListState = 'ready' | 'loading' | 'error';

function OrdersCard({
  state,
  filters,
  onChange,
  onReload,
}: {
  state: ListState;
  filters: OrderFilters;
  onChange: (next: Partial<OrderFilters>) => void;
  onReload: () => void;
}) {
  const loading = state === 'loading';
  // The tab counts follow the search and the other filters, so they tell in which state the matches are.
  const matching = ORDERS.filter((order) => matchesConditions(order, filters));
  const countOf = (status: StatusTab) =>
    status === 'all' ? matching.length : matching.filter((order) => order.status === status).length;
  const filtered = sortOrders(
    matching.filter((order) => filters.status === 'all' || order.status === filters.status),
    filters.sort,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = first + rows.length - 1;

  return (
    <Card aria-busy={loading || undefined}>
      {/*
       * Pills wrap into two even rows on a phone, so every state keeps its count there, the red one included; the
       * underlined tabs took three rows, and a scrolling row would hide the later states' counts.
       */}
      <Tabs
        variant="pills"
        value={filters.status}
        onChange={(value) => onChange({ status: (value as StatusTab | null) ?? 'all', page: 1 })}
        keepMounted={false}
      >
        <Tabs.List>
          {STATUS_TABS.map((tab) => {
            const count = countOf(tab.value);
            const attention = tab.value !== 'all' && ORDER_STATUS[tab.value].attention && count > 0;
            return (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                disabled={state !== 'ready'}
                rightSection={
                  /*
                   * While loading, a skeleton holds the count's place, so the tabs keep the width they take once the
                   * counts arrive. After a failure no count is coming, so none is shown.
                   */
                  state === 'ready' ? (
                    <Badge color={attention ? ATTENTION_COLOR : undefined}>{count}</Badge>
                  ) : loading ? (
                    <Skeleton height={22} width={28} />
                  ) : undefined
                }
              >
                {tab.label}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {/*
         * The fields narrow every state alike, so they sit between the tabs and the panel, not in it: switching the
         * tab keeps them, and keeps the phone's 絞り込み・並べ替え open or closed as it was.
         */}
        <FilterBar filters={filters} disabled={state !== 'ready'} onChange={onChange} />
        {STATUS_TABS.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value}>
            {state === 'error' ? (
              // The conditions stay above, so after the reload the same orders come back without retyping them.
              <Alert title="受注を読み込めませんでした" color="red" icon={<IconAlertCircle />}>
                <Stack gap="sm" align="flex-start">
                  <Text size="sm">
                    再読み込みしても読み込めないときは時間をおいてもう一度試し、それでも続くときは情報システムの担当者に連絡してください。
                  </Text>
                  <Button variant="default" onClick={onReload}>
                    再読み込み
                  </Button>
                </Stack>
              </Alert>
            ) : !loading && rows.length === 0 ? (
              // Not the first-run empty state: orders exist, the conditions exclude them, so the way out is to loosen them.
              <EmptyState icon={<IconSearch />} withIndicatorBackground>
                {/* The compound Title takes a heading level, so the message sits under the page's h1 in the outline. */}
                <EmptyState.Title order={2}>条件に合う受注はありません</EmptyState.Title>
                {/* When other states hold matches, the way out is the tab; otherwise it is the fields above. */}
                <EmptyState.Description>
                  {filters.status !== 'all' && matching.length > 0
                    ? `ほかの状態に ${matching.length} 件あります。`
                    : '検索の言葉や条件を変えてください。'}
                </EmptyState.Description>
                {filters.status !== 'all' && matching.length > 0 && (
                  <EmptyState.Actions>
                    <Button variant="default" onClick={() => onChange({ status: 'all', page: 1 })}>
                      すべての状態で探す
                    </Button>
                  </EmptyState.Actions>
                )}
              </EmptyState>
            ) : (
              <>
                <Stack visibleFrom="sm" gap={0}>
                  <OrdersTable orders={loading ? null : rows} sort={filters.sort} />
                </Stack>
                <Stack hiddenFrom="sm" gap={0}>
                  <OrdersStack orders={loading ? null : rows} />
                </Stack>
                <Group justify="space-between" mt="md" gap="sm">
                  {loading ? (
                    <Skeleton height={12} width={160} />
                  ) : (
                    // A status region, so a screen reader hears the new count after each change of the conditions.
                    <Text size="sm" c="dimmed" role="status">
                      {filtered.length} 件中 {first}〜{last} 件を表示
                    </Text>
                  )}
                  {/* The number of pages is unknown until the orders arrive, so no page numbers are shown meanwhile. */}
                  {loading ? (
                    <Skeleton height={32} width={120} />
                  ) : (
                    <Pagination
                      total={totalPages}
                      value={page}
                      onChange={(next) => onChange({ page: next })}
                    />
                  )}
                </Group>
              </>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Card>
  );
}

function OrderListPage({
  state: initialState = 'ready',
  initialFilters,
}: {
  state?: ListState;
  initialFilters?: Partial<OrderFilters>;
}) {
  const [state, setState] = useState<ListState>(initialState);
  const [retrying, setRetrying] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const updateFilters = (next: Partial<OrderFilters>) =>
    setFilters((current) => ({ ...current, ...next }));

  // The retry pretends the second request succeeds, so the error story shows the way back to the list.
  useEffect(() => {
    if (!retrying) return;
    const timer = window.setTimeout(() => {
      setState('ready');
      setRetrying(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [retrying]);

  const reload = () => {
    setState('loading');
    setRetrying(true);
  };

  return (
    <AppFrame parent="受注" page="受注一覧">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={1} size="h3">
              受注一覧
            </Title>
            {/*
             * The moment the list stands at, not a period: the orders shown are set by the conditions, and the date
             * field says when it narrows them. The moment comes with the orders, so it waits as a skeleton while
             * they load, and is left out when they could not be read.
             */}
            {state === 'ready' && (
              <Text size="sm" c="dimmed">
                {monthDay(asOfDay ?? '')} {asOfTime} 時点の受注です。
              </Text>
            )}
            {state === 'loading' && <Skeleton height={12} width={200} my={4} />}
          </Stack>
          <Button leftSection={<IconPlus size={ICON_SIZE} />}>受注を登録</Button>
        </Group>
        {/*
         * Said only to a screen reader, as the skeletons say nothing to it. The line stays in place empty while the
         * orders are shown, so it is read when a reload starts, and sits outside the card, which is aria-busy meanwhile.
         */}
        <VisuallyHidden role="status">
          {state === 'loading' ? '受注を読み込んでいます' : ''}
        </VisuallyHidden>
        <OrdersCard state={state} filters={filters} onChange={updateFilters} onReload={reload} />
      </Stack>
    </AppFrame>
  );
}

export const OrderList: Story = {
  name: '受注一覧',
  render: () => <OrderListPage />,
};

export const Loading: Story = {
  name: '読み込み中',
  parameters: {
    docs: {
      description: {
        story:
          '取得の待ち（データパターンの「読み込み中」）です。見出し・タブの名前・絞り込みの欄・表の見出しは読み込み後と同じ位置に出し、受注と一緒に届く見出しの補足（時点）、タブの件数、行、件数の表示、ページ送りを Skeleton にしました。表の列幅は読み込み後と同じ定義にし、行末のメニューの列にも Skeleton を置いて、受注が届いても列とタブの幅が動かないようにしています。欄とタブは押しても結果が無いので無効にしています。Skeleton はスクリーンリーダーに何も伝えないので、読み上げだけに届く「受注を読み込んでいます」の行（role="status"）を Card の外に置き、再読み込みを始めたときにも読み上げられるよう、読み込み後も空のまま残しています。',
      },
    },
  },
  render: () => <OrderListPage state="loading" />,
};

export const NoMatches: Story = {
  name: '絞り込みに当たる受注が無いとき',
  parameters: {
    docs: {
      description: {
        story:
          '0 件（データパターンの「絞り込みの結果が無い」）です。電話で問い合わせを受けたテスト物産の受注を未発送のタブで探し、当たらなかった場面です。受注そのものはあるので、登録への案内ではなく、ほかの状態に当たる件数と「すべての状態で探す」を出し、検索の言葉を残したまま状態だけを広げられるようにしました。どの状態に何件あるかはタブの件数でも分かり、欄の条件ごと消すときは有効になった「検索と絞り込みを解除」を使えます。表とページ送りは消しています。',
      },
    },
  },
  render: () => <OrderListPage initialFilters={{ status: 'notShipped', query: 'テスト物産' }} />,
};

export const LoadFailed: Story = {
  name: '読み込みに失敗したとき',
  parameters: {
    docs: {
      description: {
        story:
          '取得の失敗（データパターンの「取得の失敗」）です。自分の担当の未発送を開いたときに失敗した場面で、何が起きたかを見出しに、まず再読み込みし、直らなければ時間をおき、それでも続けば情報システムの担当者に連絡することを 1 文にした Alert を、表のあった場所に置きました。タブと絞り込みの欄は選んだ条件を見せたまま無効にし、再読み込みで同じ条件の受注が戻るようにしています。見出しの補足の時点・タブの件数・件数の表示・表・ページ送りは、読み込めていないので消し、受注の登録は一覧の取得と関係なく使えるので残しています。',
      },
    },
  },
  render: () => (
    <OrderListPage
      state="error"
      initialFilters={{ status: 'notShipped', staff: CURRENT_USER.name }}
    />
  ),
};
