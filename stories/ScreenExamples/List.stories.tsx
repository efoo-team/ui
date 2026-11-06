import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
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
  VisuallyHidden,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconAlertCircle,
  IconArrowsSort,
  IconCalendar,
  IconPlus,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { AppFrame, ICON_SIZE } from './shared/AppFrame';
import {
  ATTENTION_COLOR,
  isoDate,
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
          '**情報構造**　主は受注で、1 件ごとに顧客（1 社）、明細（1〜3 品目）、担当者、状態、金額、受注日が従います。状態（未発送・入金待ち・発送済み・キャンセル）は受注を仕事のまとまりに分ける軸で、明細の中身や配送先・履歴は詳細の画面に任せます。\n\n' +
          '**データパターン**　項目は受注番号・顧客・品目・金額・状態・担当者・受注日の 7 つです。件数は 36 件で、絞り込むと 0〜36 件になります。値の長さは、顧客名が 3〜7 字、品目が「付箋 75mm 角」から「A4 コピー用紙（500 枚） ほか 2 品目」まで、金額が 4〜6 桁です。状態は、読み込み後（story『受注一覧』）、0 件（story『絞り込みに当たる受注が無いとき』）、読み込み中（story『読み込み中』）、取得の失敗（story『読み込みに失敗したとき』）です。\n\n' +
          '**情報の流れ**　開いた担当者は、まず状態ごとの件数で今日の仕事の量（未発送が何件か）を知ります。次に状態のタブ・検索・担当者・受注日で対象を絞り、行の状態・顧客・金額を見比べて目当ての受注を決め、受注番号から詳細へ移ります。受注の登録は電話や FAX を受けたときに始まる別の流れです。\n\n' +
          '**主役**　流れの順に、件数付きの状態のタブ、絞り込みの欄、表を上から並べ、詳細への道である受注番号を行の左端のリンクにしました。色は未発送の件数と未発送の状態にだけ使い、最初に目に入るのが対応の要る受注になるようにしています。ページ全体の操作である「受注を登録」だけを塗りのボタンにし、見出しの右に置きました。\n\n' +
          '**抑えたもの・使わなかったもの**　絞り込みの条件は欄そのものが見せるので、条件のチップの列は重ねず、条件があるときだけ「絞り込みを解除」を出します。並べ替えは列の見出しではなく欄の 1 つにし、行の操作のメニューには詳細を開く項目を置かず、受注番号のリンクに一本化しました。スマホの幅では、横スクロールで状態と金額が隠れないよう表を 1 件ずつの短いまとまりに組み替え、3 段に折り返す 5 つのタブも状態の選択欄に替えています。\n\n' +
          '**目的が違えば変わるところ**　件数が数百件を超えるなら、件数の表示とページ送りに加えて CSV の書き出しや表示件数の切り替えを置きます。絞り込みの条件が 5 つを超えるなら、欄を折りたたみの中に移し、選んだ条件をチップの列で見せます。項目が 3〜4 つと少なく、スマホで使うことが多いなら、表ではなく 1 件ずつのまとまりの並びを全幅で使ってよいです。',
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

// Every state is a tab here, unlike the dashboard's three: the list is where each state is worked through.
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

const isNarrowed = ({ status, query, staff, dates }: OrderFilters) =>
  status !== 'all' ||
  query.trim() !== '' ||
  staff !== null ||
  dates[0] !== null ||
  dates[1] !== null;

function ariaSort(column: 'date' | 'amount', sort: SortKey) {
  if (column === 'date' && sort.startsWith('date'))
    return sort === 'dateAsc' ? 'ascending' : 'descending';
  if (column === 'amount' && sort.startsWith('amount'))
    return sort === 'amountAsc' ? 'ascending' : 'descending';
  return undefined;
}

function OrdersTable({ orders, sort }: { orders: Order[] | null; sort: SortKey }) {
  return (
    <Table.ScrollContainer minWidth={960} scrollAreaProps={{ type: 'always' }}>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>受注番号</Table.Th>
            <Table.Th>顧客</Table.Th>
            <Table.Th>品目</Table.Th>
            <Table.Th ta="right" aria-sort={ariaSort('amount', sort)}>
              金額
            </Table.Th>
            <Table.Th>状態</Table.Th>
            <Table.Th>担当者</Table.Th>
            <Table.Th aria-sort={ariaSort('date', sort)}>受注日</Table.Th>
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
                  <Table.Td />
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

function FilterBar({
  filters,
  statusOptions,
  disabled,
  onChange,
  onClear,
}: {
  filters: OrderFilters;
  statusOptions: { value: StatusTab; label: string }[];
  disabled: boolean;
  onChange: (next: Partial<OrderFilters>) => void;
  onClear: () => void;
}) {
  return (
    // The bases put the search on its own row on a phone and two short fields side by side under it.
    // On a phone the tabs are hidden, so nothing above needs the gap.
    <Group mt={{ base: 0, sm: 'md' }} mb="md" gap="sm" wrap="wrap">
      <TextInput
        flex="2 1 240px"
        leftSection={<IconSearch size={ICON_SIZE} />}
        placeholder="受注番号・顧客名・商品名で検索"
        aria-label="受注を検索"
        value={filters.query}
        disabled={disabled}
        onChange={(event) => onChange({ query: event.currentTarget.value, page: 1 })}
      />
      {/* Five tabs wrap into three uneven rows on a phone, so the state is chosen here there instead. */}
      <Select
        hiddenFrom="sm"
        flex="1 1 140px"
        aria-label="状態で絞り込み"
        data={statusOptions}
        value={filters.status}
        disabled={disabled}
        onChange={(value) => onChange({ status: (value as StatusTab | null) ?? 'all', page: 1 })}
        allowDeselect={false}
      />
      <Select
        flex="1 1 140px"
        placeholder="担当者で絞り込み"
        aria-label="担当者で絞り込み"
        data={STAFF}
        value={filters.staff}
        disabled={disabled}
        onChange={(value) => onChange({ staff: value, page: 1 })}
        clearable
      />
      <DatePickerInput
        type="range"
        flex="1 1 220px"
        leftSection={<IconCalendar size={ICON_SIZE} />}
        placeholder="受注日で絞り込み"
        aria-label="受注日で絞り込み"
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
        flex="1 1 140px"
        leftSection={<IconArrowsSort size={ICON_SIZE} />}
        aria-label="並べ替え"
        data={SORTS}
        value={filters.sort}
        disabled={disabled}
        onChange={(value) => onChange({ sort: (value as SortKey | null) ?? 'dateDesc', page: 1 })}
        allowDeselect={false}
      />
      {isNarrowed(filters) && (
        <Button variant="subtle" leftSection={<IconX size={ICON_SIZE} />} onClick={onClear}>
          絞り込みを解除
        </Button>
      )}
    </Group>
  );
}

function OrdersCard({
  loading,
  filters,
  onChange,
}: {
  loading: boolean;
  filters: OrderFilters;
  onChange: (next: Partial<OrderFilters>) => void;
}) {
  const clear = () => onChange(DEFAULT_FILTERS);
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
      <Tabs
        value={filters.status}
        onChange={(value) => onChange({ status: (value as StatusTab | null) ?? 'all', page: 1 })}
        keepMounted={false}
      >
        <Tabs.List visibleFrom="sm">
          {STATUS_TABS.map((tab) => {
            const count = countOf(tab.value);
            const attention = tab.value !== 'all' && ORDER_STATUS[tab.value].attention && count > 0;
            return (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                disabled={loading}
                rightSection={
                  // A badge-sized skeleton keeps the tabs at their loaded height.
                  loading ? (
                    <Skeleton height={20} width={24} />
                  ) : (
                    <Badge color={attention ? ATTENTION_COLOR : undefined}>{count}</Badge>
                  )
                }
              >
                {tab.label}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {STATUS_TABS.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value}>
            <FilterBar
              filters={filters}
              statusOptions={STATUS_TABS.map((item) => ({
                value: item.value,
                label: loading ? item.label : `${item.label}（${countOf(item.value)} 件）`,
              }))}
              disabled={loading}
              onChange={onChange}
              onClear={clear}
            />
            {!loading && rows.length === 0 ? (
              // Not the first-run empty state: orders exist, the conditions exclude them, so the way out is to loosen them.
              <EmptyState
                icon={<IconSearch />}
                title="条件に合う受注はありません"
                description="検索の言葉や条件を変えてください。"
                withIndicatorBackground
                py="xl"
              >
                <EmptyState.Actions>
                  <Button variant="default" onClick={clear}>
                    絞り込みを解除
                  </Button>
                </EmptyState.Actions>
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

type ListState = 'ready' | 'loading' | 'error';

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
            <Text size="sm" c="dimmed">
              登録されているすべての受注です（10 月 31 日時点）
            </Text>
          </Stack>
          <Button leftSection={<IconPlus size={ICON_SIZE} />}>受注を登録</Button>
        </Group>
        {state === 'error' ? (
          <Alert title="受注を読み込めませんでした" color="red" icon={<IconAlertCircle />}>
            <Stack gap="sm" align="flex-start">
              <Text size="sm">時間をおいて再読み込みしてください。</Text>
              <Button variant="default" onClick={reload}>
                再読み込み
              </Button>
            </Stack>
          </Alert>
        ) : (
          <OrdersCard loading={state === 'loading'} filters={filters} onChange={updateFilters} />
        )}
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
          '取得の待ち（データパターンの「読み込み中」）です。見出し・タブ・絞り込みの欄・表の見出しは読み込み後と同じ位置に出し、件数・行・ページ送りだけを Skeleton にして、読み込み後に配置が動かないようにしました。欄とタブは押しても結果が無いので無効にしています。',
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
          '0 件（データパターンの「絞り込みの結果が無い」）です。受注そのものはあるので、まだ 1 件も無いときの登録への案内ではなく、条件を緩める道として「絞り込みを解除」を出し、タブの件数でほかの状態には受注があることも見せます。表とページ送りは消しています。',
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
          '取得の失敗（データパターンの「取得の失敗」）です。何が起きて次に何をするかを 1 文ずつ書いた Alert と「再読み込み」を、表のあった場所に置きました。使えないタブと絞り込みの欄は消し、受注の登録は一覧の取得と関係なく使えるので残しています。',
      },
    },
  },
  render: () => <OrderListPage state="error" />,
};
