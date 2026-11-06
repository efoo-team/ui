import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  DataList,
  EmptyState,
  Grid,
  Group,
  Menu,
  Modal,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Timeline,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconFileSearch,
  IconPrinter,
  IconTruckDelivery,
  IconX,
} from '@tabler/icons-react';
import { AppFrame, CONTENT_BREAKPOINTS, ICON_SIZE } from './shared/AppFrame';
import { BackLink } from './shared/BackLink';
import {
  ATTENTION_COLOR,
  CURRENT_USER,
  findOrder,
  isCancellable,
  monthDay,
  NOW,
  TAX_RATE,
  yen,
  type Order,
  type OrderEvent,
} from './shared/data';
import { OrderStatusBadge } from './shared/OrderStatusBadge';
import { SectionCard } from './shared/SectionCard';

const meta = {
  title: '画面例 / 詳細',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // AppShell places the frame with position: fixed, so each story is drawn in an iframe of its own.
      story: { inline: false, height: '900px' },
      description: {
        component:
          '架空の販売管理サービスの、受注 1 件の詳細の画面です。\n\n' +
          '**目的と読み手**　受注の担当者が、一覧やダッシュボードから未発送の受注を開き、中身と届け先を確かめて発送を記録する画面です。1 日に何度も開くので、毎日くり返し使う画面として、見慣れた配置と少ない色で組んでいます。\n\n' +
          '**情報構造**　主は 1 件の受注（番号・状態）で、明細・届け先・支払い・履歴はその受注に従います。明細は商品（在庫）に、届け先と請求先は顧客につながっていて、この画面では発送の判断に要る在庫と連絡先だけを受注の側に引いて見せます。\n\n' +
          '**データパターン**　明細は 1〜3 行（商品名は 9〜15 文字）、履歴は 1〜3 件、住所は 13〜26 文字で狭い幅では折り返します。希望の着日は無い受注もあり、そのときは「指定なし」と出します。状態は、未発送の受注（story『受注の詳細』。「発送を記録」を押すと発送済みに変わります）、在庫が足りない明細（この受注には無く、明細の行に印を出す作りだけを持ちます）、読み込み中（story『読み込み中』）、受注が見つからない（story『受注が見つからないとき』）です。\n\n' +
          '**情報の流れ**　担当者は、まずこの受注が何で今どの状態か（番号・状態・顧客）を知り、次に何をいくつ送り在庫が足りるか（明細）、いつまでにどこへ送るか（希望の着日・届け先）、支払いが発送を止めないか（支払い）を確かめ、発送を記録します。履歴は、ほかの人が先に手を付けていないかを確かめたいときにだけ見ます。\n\n' +
          '**主役**　流れの最初に知る状態と、最後にする操作です。状態の Badge を受注番号の横に置き、未発送の受注では「発送を記録」だけを塗りのボタンにして見出しの右に置きました。記録すると Badge と履歴が変わり、塗りのボタンは消えます。本文は流れの順に、明細を左の広い列に、届け先（希望の着日を先頭）・支払い・履歴を右の列に上から並べ、狭い幅では同じ順で縦に積みます。\n\n' +
          '**抑えたもの・使わなかったもの**　色は未発送の Badge と、在庫が足りない明細の印にだけ使います。編集・複製・キャンセルはこの場面ではまれな操作なので「その他の操作」のメニューに収め、納品書の印刷は枠線のボタンにしました。金額は明細の下の合計に 1 か所だけ置き、見出しにはくり返していません。明細の表は 3 列にして、単価を金額の下に、在庫を商品の下に添え、スマホの幅でも横に送らずに読めるようにしました。\n\n' +
          '**目的が違えば変わるところ**　入金待ちの受注なら、主な操作は「入金を記録」に変わります。経理の担当者が請求を確かめる画面なら、支払いと金額を主役にして左の列に置きます。明細が数十行になる受注なら、明細を別のタブか別の画面に分け、この画面には品目の数と合計だけを残します。スマホで確かめてから操作するのが主な使い方なら、主な操作を画面の下端に固定します。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Every name and number below is fictional. The shared data has no delivery request, carrier or tracking number, so
// they live here.

const ORDER_ID = 'SO-010240';
// Two digits of ORDER_ID swapped: the most common way to land on an order that does not exist.
const MISSING_ORDER_ID = 'SO-010420';

const DELIVERY_REQUESTS: Record<string, string> = { [ORDER_ID]: '11 月 4 日（水）午前中' };

const CARRIERS = ['見本運輸', 'サンプル急便', '自社便'];

const LIST_BREADCRUMBS = ['受注', '受注一覧'];

interface ShipmentValues {
  shippedOn: string | null;
  carrier: string | null;
  trackingNumber: string;
}

const SHIPMENT_FIELDS = ['shippedOn', 'carrier', 'trackingNumber'] as const;

function validateTrackingNumber(value: string) {
  if (value.trim() === '') return '送り状番号を入力してください';
  return /^[0-9-]+$/.test(value.trim()) ? null : '送り状番号は数字とハイフンで入力してください';
}

function ShipmentModal({
  order,
  opened,
  onClose,
  onSubmit,
}: {
  order: Order;
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: ShipmentValues) => void;
}) {
  const form = useForm<ShipmentValues>({
    mode: 'uncontrolled',
    initialValues: { shippedOn: NOW.date, carrier: null, trackingNumber: '' },
    validate: {
      shippedOn: (value) => (value ? null : '発送日を選択してください'),
      carrier: (value) => (value ? null : '配送業者を選択してください'),
      trackingNumber: validateTrackingNumber,
    },
    validateInputOnBlur: true,
  });

  return (
    <Modal opened={opened} onClose={onClose} title="発送を記録">
      <form
        noValidate
        onSubmit={form.onSubmit(onSubmit, (errors) => {
          const first = SHIPMENT_FIELDS.find((field) => errors[field]);
          if (first) form.getInputNode(first)?.focus();
        })}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {order.id}（{order.customer.name}）を発送済みにします。
          </Text>
          <DateInput
            label="発送日"
            required
            key={form.key('shippedOn')}
            {...form.getInputProps('shippedOn')}
          />
          <Select
            label="配送業者"
            placeholder="配送業者を選択"
            data={CARRIERS}
            required
            key={form.key('carrier')}
            {...form.getInputProps('carrier')}
          />
          <TextInput
            label="送り状番号"
            placeholder="0000-0000-0000"
            inputMode="numeric"
            required
            key={form.key('trackingNumber')}
            {...form.getInputProps('trackingNumber')}
          />
          {/* "キャンセル" is the order's own action on this screen, so the dismiss button says 戻る. */}
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose}>
              戻る
            </Button>
            <Button type="submit">発送済みにする</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

function CancelModal({
  order,
  opened,
  onClose,
  onConfirm,
}: {
  order: Order;
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="受注をキャンセル">
      <Stack gap="md">
        <Text size="sm">
          {order.id}（{order.customer.name}、{yen(order.amount)}
          ）をキャンセルします。キャンセルした受注は元に戻せません。
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} data-autofocus>
            戻る
          </Button>
          <Button color={ATTENTION_COLOR} onClick={onConfirm}>
            キャンセルする
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function OrderActions({
  order,
  onShip,
  onCancel,
}: {
  order: Order;
  onShip: () => void;
  onCancel: () => void;
}) {
  return (
    <Group gap="sm" wrap="nowrap">
      <Button variant="outline" leftSection={<IconPrinter size={ICON_SIZE} />}>
        納品書を印刷
      </Button>
      {/* The one filled button is the next step for the order's state; a shipped order has none. */}
      {order.status === 'notShipped' && (
        <Button leftSection={<IconTruckDelivery size={ICON_SIZE} />} onClick={onShip}>
          発送を記録
        </Button>
      )}
      <Menu position="bottom-end" width={200}>
        <Menu.Target>
          <ActionIcon variant="default" size="lg" aria-label="その他の操作">
            <IconDotsVertical size={ICON_SIZE} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconEdit size={ICON_SIZE} />}>受注を編集</Menu.Item>
          <Menu.Item leftSection={<IconCopy size={ICON_SIZE} />}>受注を複製</Menu.Item>
          {isCancellable(order) && (
            <>
              <Menu.Divider />
              <Menu.Item
                color={ATTENTION_COLOR}
                leftSection={<IconX size={ICON_SIZE} />}
                onClick={onCancel}
              >
                受注をキャンセル
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

// Three columns fit a phone without scrolling: the unit price sits under the amount it explains, and the stock under
// the product, where the person checking whether the order can ship looks.
function LinesCard({ order }: { order: Order }) {
  return (
    <SectionCard title="明細" description={`${order.lines.length} 品目`}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>商品</Table.Th>
            <Table.Th ta="right">数量</Table.Th>
            <Table.Th ta="right">金額</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {order.lines.map(({ product, quantity, unitPrice }) => {
            const short = order.status === 'notShipped' && product.quantity < quantity;
            return (
              <Table.Tr key={product.code}>
                <Table.Td>
                  <Stack gap={2}>
                    <Group gap="xs">
                      <Text size="sm">{product.name}</Text>
                      {short && <Badge color={ATTENTION_COLOR}>在庫不足</Badge>}
                    </Group>
                    <Text size="xs" c="dimmed">
                      {product.code}・在庫 {product.quantity} {product.unit}
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td ta="right">
                  {quantity} {product.unit}
                </Table.Td>
                <Table.Td ta="right">
                  <Stack gap={2}>
                    <Text size="sm">{yen(unitPrice * quantity)}</Text>
                    <Text size="xs" c="dimmed">
                      単価 {yen(unitPrice)}
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Th colSpan={2} ta="right" scope="row">
              小計
            </Table.Th>
            <Table.Td ta="right">{yen(order.subtotal)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th colSpan={2} ta="right" scope="row">
              消費税（{TAX_RATE * 100}%）
            </Table.Th>
            <Table.Td ta="right">{yen(order.tax)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th colSpan={2} ta="right" scope="row">
              合計
            </Table.Th>
            <Table.Td ta="right">
              <Text variant="emphasis" size="sm">
                {yen(order.amount)}
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </SectionCard>
  );
}

function ShipToCard({ order }: { order: Order }) {
  const { shipTo, customer } = order;
  const request = DELIVERY_REQUESTS[order.id];
  return (
    <SectionCard title="お届け先">
      {/* The requested date comes first: it decides how soon the order has to leave, before where it goes. */}
      <DataList labelWidth={96}>
        <DataList.Item>
          <DataList.ItemLabel>希望の着日</DataList.ItemLabel>
          <DataList.ItemValue>{request ?? '指定なし'}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>届け先</DataList.ItemLabel>
          <DataList.ItemValue>{shipTo.name}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>受取人</DataList.ItemLabel>
          <DataList.ItemValue>{shipTo.contact} 様</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>住所</DataList.ItemLabel>
          <DataList.ItemValue>
            〒{shipTo.postalCode}
            <br />
            {shipTo.address}
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>電話</DataList.ItemLabel>
          <DataList.ItemValue>
            <Anchor href={`tel:${customer.phone}`} inherit>
              {customer.phone}
            </Anchor>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList>
    </SectionCard>
  );
}

function PaymentCard({ order }: { order: Order }) {
  return (
    <SectionCard title="支払い">
      <DataList labelWidth={96}>
        <DataList.Item>
          <DataList.ItemLabel>支払い方法</DataList.ItemLabel>
          <DataList.ItemValue>{order.payment}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>請求先</DataList.ItemLabel>
          <DataList.ItemValue>
            {order.customer.name}（{order.customer.contact} 様）
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>請求書の送付先</DataList.ItemLabel>
          <DataList.ItemValue>
            <Anchor href={`mailto:${order.customer.email}`} inherit>
              {order.customer.email}
            </Anchor>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList>
    </SectionCard>
  );
}

function HistoryCard({ order }: { order: Order }) {
  return (
    <SectionCard title="履歴">
      <Timeline active={order.history.length - 1}>
        {order.history.map((event) => (
          <Timeline.Item key={`${event.at}-${event.label}`} title={event.label}>
            <Text size="sm" c="dimmed">
              {event.at}・{event.by}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </SectionCard>
  );
}

function OrderDetail({ initialOrder }: { initialOrder: Order }) {
  // The screen keeps its own copy, so recording a shipment or a cancellation changes what it shows.
  const [order, setOrder] = useState(initialOrder);
  const [shipOpened, setShipOpened] = useState(false);
  const [cancelOpened, setCancelOpened] = useState(false);

  const addEvent = (status: Order['status'], event: Omit<OrderEvent, 'at' | 'by'>) =>
    setOrder((current) => ({
      ...current,
      status,
      history: [...current.history, { at: NOW.at, by: CURRENT_USER.name, ...event }],
    }));

  const ship = ({ carrier, trackingNumber }: ShipmentValues) => {
    addEvent('shipped', { label: `発送（${carrier} ${trackingNumber.trim()}）` });
    setShipOpened(false);
    notifications.show({
      title: '発送を記録しました',
      message: `${order.id} を発送済みにしました。`,
    });
  };

  const cancel = () => {
    addEvent('cancelled', { label: 'キャンセル' });
    setCancelOpened(false);
    notifications.show({
      title: '受注をキャンセルしました',
      message: `${order.id} をキャンセルしました。`,
    });
  };

  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <BackLink to="受注一覧" />
        <Group justify="space-between" align="flex-start" gap="md">
          <Stack gap={4}>
            <Group gap="sm" wrap="nowrap">
              <Title order={1} size="h3">
                {order.id}
              </Title>
              <OrderStatusBadge status={order.status} />
            </Group>
            <Text size="sm" c="dimmed">
              {order.customer.name}・{monthDay(order.date)}に受注・担当 {order.staff}
            </Text>
          </Stack>
          <OrderActions
            order={order}
            onShip={() => setShipOpened(true)}
            onCancel={() => setCancelOpened(true)}
          />
        </Group>
      </Stack>
      <Grid type="container" breakpoints={CONTENT_BREAKPOINTS}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <LinesCard order={order} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="md">
            <ShipToCard order={order} />
            <PaymentCard order={order} />
            <HistoryCard order={order} />
          </Stack>
        </Grid.Col>
      </Grid>
      <ShipmentModal
        order={order}
        opened={shipOpened}
        onClose={() => setShipOpened(false)}
        onSubmit={ship}
      />
      <CancelModal
        order={order}
        opened={cancelOpened}
        onClose={() => setCancelOpened(false)}
        onConfirm={cancel}
      />
    </Stack>
  );
}

function SkeletonCard({ title, rows }: { title: string; rows: number }) {
  return (
    <SectionCard title={title}>
      <Stack gap="sm">
        {Array.from({ length: rows }, (_, row) => (
          <Skeleton key={row} height={16} width={row % 2 === 0 ? '80%' : '60%'} />
        ))}
      </Stack>
    </SectionCard>
  );
}

// The order number comes from the address, so it shows while the rest loads; everything else keeps its place.
function LoadingDetail({ id }: { id: string }) {
  return (
    <Stack gap="lg" aria-busy="true">
      <Stack gap="sm">
        <BackLink to="受注一覧" />
        <Group justify="space-between" align="flex-start" gap="md">
          <Stack gap={4}>
            <Group gap="sm" wrap="nowrap">
              <Title order={1} size="h3">
                {id}
              </Title>
              <Skeleton height={20} width={56} />
            </Group>
            <Skeleton height={14} my={3} width={260} maw="100%" />
          </Stack>
          <Group gap="sm" wrap="nowrap">
            <Skeleton height={36} width={136} />
            <Skeleton height={36} width={124} />
            <Skeleton height={36} width={36} />
          </Group>
        </Group>
      </Stack>
      <Grid type="container" breakpoints={CONTENT_BREAKPOINTS}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <SectionCard title="明細">
            <Stack gap="md">
              {[0, 1, 2].map((row) => (
                <Group key={row} justify="space-between" wrap="nowrap" gap="md">
                  <Stack gap={6} flex={1}>
                    <Skeleton height={14} width="60%" />
                    <Skeleton height={12} width="30%" />
                  </Stack>
                  {/* The quantity and the amount, the other two columns of the lines. */}
                  <Skeleton height={14} width={40} />
                  <Skeleton height={14} width={80} />
                </Group>
              ))}
              <Group justify="flex-end">
                <Skeleton height={14} width={160} />
              </Group>
            </Stack>
          </SectionCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="md">
            <SkeletonCard title="お届け先" rows={5} />
            <SkeletonCard title="支払い" rows={3} />
            <SkeletonCard title="履歴" rows={2} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

function NotFoundContent({ id }: { id: string }) {
  return (
    <Card>
      <EmptyState withIndicatorBackground>
        <EmptyState.Indicator>
          <IconFileSearch />
        </EmptyState.Indicator>
        <EmptyState.Title order={1}>{id} の受注は見つかりません</EmptyState.Title>
        <EmptyState.Description>
          受注番号が誤っているか、ほかの組織の受注である可能性があります。受注一覧で探すか、サイドバーの組織名から組織を切り替えてください。
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button leftSection={<IconArrowLeft size={ICON_SIZE} />}>受注一覧に戻る</Button>
        </EmptyState.Actions>
      </EmptyState>
    </Card>
  );
}

function OrderDetailPage({ id, state }: { id: string; state?: 'loading' }) {
  const order = findOrder(id);
  let content;
  if (state === 'loading') content = <LoadingDetail id={id} />;
  else if (order) content = <OrderDetail initialOrder={order} />;
  else content = <NotFoundContent id={id} />;
  return (
    <AppFrame parent="受注" page="受注一覧" breadcrumbs={[...LIST_BREADCRUMBS, id]}>
      {content}
    </AppFrame>
  );
}

export const Detail: Story = {
  name: '受注の詳細',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「未発送の受注」（明細 3 行、希望の着日あり、在庫は足りている）です。「発送を記録」で発送日・配送業者・送り状番号を入れると発送済みに変わり、塗りのボタンが消えて履歴に 1 件増えます。',
      },
    },
  },
  render: () => <OrderDetailPage id={ORDER_ID} />,
};

export const Loading: Story = {
  name: '読み込み中',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「読み込み中」です。受注番号は開いたアドレスから分かるので見出しに出し、状態・顧客・明細・操作のボタンは読み込み後と同じ位置に Skeleton で置きます。Card の見出しも先に出して、どこに何が来るかを読み込み中から分かるようにしています。',
      },
    },
  },
  render: () => <OrderDetailPage id={ORDER_ID} state="loading" />,
};

export const NotFound: Story = {
  name: '受注が見つからないとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「受注が見つからない」です。開いた受注番号を見出しに出して打ち間違いに気づけるようにし、見つからない理由として考えられる 2 つ（番号の誤り、ほかの組織の受注）と、次の行き先を示します。操作は一覧へ戻るボタン 1 つにし、狭い幅でも同じボタンが戻る道になるので、画面上部の戻るリンクは出しません。',
      },
    },
  },
  render: () => <OrderDetailPage id={MISSING_ORDER_ID} />,
};
