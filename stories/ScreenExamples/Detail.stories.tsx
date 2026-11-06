import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState, type Ref } from 'react';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
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
  Textarea,
  TextInput,
  Timeline,
  Title,
  VisuallyHidden,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconCash,
  IconCircleCheck,
  IconCircleX,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconFileSearch,
  IconList,
  IconMail,
  IconPrinter,
  IconTruckDelivery,
  IconX,
  type Icon,
} from '@tabler/icons-react';
import { AppFrame, CONTENT_BREAKPOINTS, ICON_SIZE } from './shared/AppFrame';
import { BackLink } from './shared/BackLink';
import {
  ATTENTION_COLOR,
  awaitsShipment,
  CURRENT_USER,
  DEFAULT_ORGANIZATION,
  findOrder,
  fromIsoDate,
  monthDay,
  NOW,
  PAYMENT_METHODS,
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
          '**目的と読み手**　受注の担当者が、一覧やダッシュボードから未発送の受注を開き、中身と届け先を確かめて、発送を記録する、または発送を止めているものに手を打つ画面です。1 日に何度も開くので、毎日くり返し使う画面として、見慣れた配置と少ない色で組んでいます。\n\n' +
          '**情報構造**　主は 1 件の受注（番号・状態）で、明細・届け先・支払い・履歴はその受注に従います。明細は商品（在庫）に、届け先と請求先は顧客につながっていて、この画面では発送の判断に要る在庫と連絡先だけを受注の側に引いて見せます。\n\n' +
          '**データパターン**　明細は 1〜3 行（商品名は 9〜15 文字）、履歴は 1〜3 件、住所は 13〜26 文字で狭い幅では折り返します。希望の着日は無い受注もあり、そのときは「指定なし」と出します。状態は、在庫も支払いも発送を止めない未発送の受注（story『受注の詳細』。「発送を記録」を押すと発送済みに変わります）、銀行振込の入金を待っている受注（story『入金を待っているとき』。「入金を記録」を押すと未発送に変わります）、在庫が足りない明細がある受注（story『在庫が足りないとき』。「遅れを連絡」でメールを送ると履歴に残ります）、読み込み中（story『読み込み中』）、受注が見つからない（story『受注が見つからないとき』）です。\n\n' +
          '**情報の流れ**　担当者は、まずこの受注が何で今どの状態か（番号・状態・顧客）を知り、次に何をいくつ送り在庫が足りるか（明細）、いつまでにどこへ送るか（希望の着日・届け先）、支払いが発送を止めないか（支払い）を確かめ、発送を記録します。発送できないときは、何が止めているかを知り、それに手を打ちます。履歴は、ほかの人が先に手を付けていないかを確かめたいときにだけ見ます。\n\n' +
          '**主役**　流れの最初に知る状態と発送できるかの答え、最後にする操作です。状態の Badge を受注番号の横に、「発送できます／発送できません」と理由の 1 行をそのすぐ下に置き、どの状態でも答えをこの 1 か所で読めて、スマホの幅でもボタンより先に目に入るようにしました。塗りのボタンは受注を止めているものに対する次の一手だけにして見出しの右に置き、入金待ちなら「入金を記録」、在庫が足りなければ、待たせる顧客への「遅れを連絡」（入荷の予定日と、在庫のある分を先に送れることを書いた下書き入り）、どちらも無ければ「発送を記録」です。記録すると押したボタンは状態とともに消えるので、フォーカスは次の一手の塗りのボタンへ、次の一手が無ければ見出しの受注番号へ移し、新しい状態と発送できるかの 1 行をそこから読めるようにしています。\n\n' +
          '**抑えたもの・使わなかったもの**　発送できるかの答えは見出しの下の 1 行だけに置き、明細と支払いの Card には書いていません。答えが 2 か所にあると、状態によって読む場所が変わるためです。色は未発送の Badge と、在庫が足りない明細の印にだけ使います。在庫が発注点を下回っている商品（A4 コピー用紙など）の「要発注」は、ダッシュボードと商品の画面では出しますが、ここでは出しません。発注はこの画面の読み手の仕事ではなく、この受注を出せるかは受注の数量と在庫で決まるので、出せる明細に印を付けると在庫不足の印が埋もれるためです。受注の編集・複製・キャンセルはこの場面ではまれな操作なので「その他の操作」のメニューに収め、納品書の印刷は枠線のボタンにしました。金額は明細の下の合計に 1 か所だけ置き、明細の表は 3 列にして、単価を金額の下に、在庫を商品の下に添え、スマホの幅でも横に送らずに読めるようにしました。\n\n' +
          '**目的が違えば変わるところ**　顧客の了解を待たずに在庫のある品目を先に送る取引なら、在庫が足りないときの主な操作を「足りる分を発送」にし、送る数量を明細ごとに入れる欄を発送の記録に足します。経理の担当者が請求を確かめる画面なら、支払いと金額を主役にして左の列に置きます。明細が数十行になる受注なら、明細を別のタブか別の画面に分け、この画面には品目の数と合計だけを残します。スマホで確かめてから操作するのが主な使い方なら、主な操作を画面の下端に固定します。',
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
// An order waiting for its bank transfer, and the one whose ballpoint pens are short in stock.
const PAYMENT_PENDING_ORDER_ID = 'SO-010239';
const SHORT_STOCK_ORDER_ID = 'SO-010228';

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
  if (value.trim() === '') return '送り状番号を入力してください。';
  return /^[0-9-]+$/.test(value.trim()) ? null : '送り状番号は数字とハイフンで入力してください。';
}

const shortLines = (order: Order) =>
  awaitsShipment(order) ? order.lines.filter((line) => line.product.quantity < line.quantity) : [];

// When each short product is due in. An order waiting for one is told the day, so the person can tell the customer.
const RESTOCKS: Record<string, string> = { 'P-1002': '11 月 6 日（金）' };

const isDelayNoticeSent = (order: Order) =>
  order.history.some((event) => event.kind === 'delayNotified');

// Why a paid-for or paid-later order does not wait for money, by payment method.
const PAYMENT_CLEARANCE: Record<string, string> = {
  [PAYMENT_METHODS.invoice]: '後払いのため入金を待ちません',
  [PAYMENT_METHODS.bankTransfer]: '入金も確認済みです',
  [PAYMENT_METHODS.card]: 'カードの決済も済んでいます',
};

type Verdict = { icon: Icon; text: string };

/*
 * The one answer to "can this order ship now, and if not, why", put in the same place under the heading in every
 * state. The person no longer compares the stock with the quantities or works out the payment rule, and the reason is
 * read before the button it explains, on a phone too.
 */
function shippingVerdict(order: Order): Verdict {
  if (order.status === 'shipped') {
    const day = order.shippedOn ? `${monthDay(order.shippedOn)}に` : '';
    return { icon: IconTruckDelivery, text: `${day}発送しました。` };
  }
  if (order.status === 'cancelled')
    return { icon: IconCircleX, text: 'キャンセルしたため、発送しません。' };
  const reasons = shortLines(order).map(({ product, quantity }) => {
    const restock = RESTOCKS[product.code];
    const due = restock ? `${restock}に入荷する予定です。` : '入荷の予定はまだありません。';
    return `${product.name}が ${quantity - product.quantity} ${product.unit}足りません。${due}`;
  });
  // The reason names the rule as well as the fact, so the person sees why money stops the shipment.
  if (order.status === 'paymentPending') reasons.push('前払いのため、入金の確認を待っています。');
  if (reasons.length > 0) {
    const notice = isDelayNoticeSent(order) ? '顧客へは遅れを連絡済みです。' : '';
    return { icon: IconAlertCircle, text: `発送できません。${reasons.join('')}${notice}` };
  }
  const stock =
    order.lines.length === 1
      ? '在庫は足りていて'
      : `在庫は ${order.lines.length} 品目とも足りていて`;
  return {
    icon: IconCircleCheck,
    text: `発送できます。${stock}、${PAYMENT_CLEARANCE[order.payment]}。`,
  };
}

function ShippingVerdict({ order }: { order: Order }) {
  const { icon: VerdictIcon, text } = shippingVerdict(order);
  return (
    <Group gap="xs" wrap="nowrap" align="flex-start">
      {/* 2px down puts the 16px icon on the middle of the first 20px line when the sentence wraps. */}
      <Box mt={2} display="flex">
        <VerdictIcon size={ICON_SIZE} aria-hidden />
      </Box>
      <Text size="sm">{text}</Text>
    </Group>
  );
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
      shippedOn: (value) => (value ? null : '発送日を選択してください。'),
      carrier: (value) => (value ? null : '配送業者を選択してください。'),
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
          {/* "受注をキャンセル" is the order's own action on this screen, so the dismiss button says 戻る. */}
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

interface PaymentValues {
  paidOn: string | null;
}

function PaymentModal({
  order,
  opened,
  onClose,
  onSubmit,
}: {
  order: Order;
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: PaymentValues) => void;
}) {
  const form = useForm<PaymentValues>({
    mode: 'uncontrolled',
    initialValues: { paidOn: NOW.date },
    validate: { paidOn: (value) => (value ? null : '入金日を選択してください。') },
    validateInputOnBlur: true,
  });

  return (
    <Modal opened={opened} onClose={onClose} title="入金を記録">
      <form
        noValidate
        onSubmit={form.onSubmit(onSubmit, () => form.getInputNode('paidOn')?.focus())}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {order.id}（{order.customer.name}）の {yen(order.amount)}{' '}
            の振込を記録します。記録すると発送できるようになります。
          </Text>
          <DateInput
            label="入金日"
            required
            key={form.key('paidOn')}
            {...form.getInputProps('paidOn')}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose}>
              戻る
            </Button>
            <Button type="submit">入金済みにする</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

interface DelayNoticeValues {
  subject: string;
  body: string;
}

// The draft names what is short and when it comes in, so the person only reads it over before sending.
function delayNoticeDraft(order: Order): DelayNoticeValues {
  const { customer } = order;
  const short = shortLines(order);
  const products = short.map(({ product }) => product.name).join('、');
  const dates = short.map(({ product }) => RESTOCKS[product.code]).filter(Boolean);
  const due =
    dates.length === short.length
      ? `${dates.join('、')}に入荷する予定で、入荷しだい、ほかの商品とあわせて発送いたします。`
      : '入荷の予定が決まりしだい、あらためてご連絡いたします。';
  return {
    subject: `${order.id} の発送が遅れるお知らせ`,
    body:
      `${customer.name}\n${customer.contact} 様\n\n` +
      `いつもお世話になっております。${monthDay(order.date)}にご注文いただいた ${order.id} のうち、${products}の在庫が足りず、発送が遅れます。${due}\n\n` +
      '在庫のある商品だけを先にお送りすることもできます。ご希望の場合は、このメールにご返信ください。\n\n' +
      `${DEFAULT_ORGANIZATION.name} ${CURRENT_USER.name}`,
  };
}

function DelayNoticeModal({
  order,
  opened,
  onClose,
  onSubmit,
}: {
  order: Order;
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: DelayNoticeValues) => void;
}) {
  const form = useForm<DelayNoticeValues>({
    mode: 'uncontrolled',
    initialValues: delayNoticeDraft(order),
    validate: {
      subject: (value) => (value.trim() ? null : '件名を入力してください。'),
      body: (value) => (value.trim() ? null : '本文を入力してください。'),
    },
    validateInputOnBlur: true,
  });

  return (
    <Modal opened={opened} onClose={onClose} title="発送の遅れを連絡" size="lg">
      <form
        noValidate
        onSubmit={form.onSubmit(onSubmit, (errors) => {
          const first = (['subject', 'body'] as const).find((field) => errors[field]);
          if (first) form.getInputNode(first)?.focus();
        })}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {order.customer.email} にメールで送り、送ったことを受注の履歴に残します。
          </Text>
          <TextInput
            label="件名"
            required
            key={form.key('subject')}
            {...form.getInputProps('subject')}
          />
          <Textarea
            label="本文"
            required
            autosize
            minRows={8}
            key={form.key('body')}
            {...form.getInputProps('body')}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose}>
              戻る
            </Button>
            <Button type="submit">送信</Button>
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
            受注をキャンセル
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function OrderActions({
  order,
  nextStepRef,
  onShip,
  onRecordPayment,
  onNotifyDelay,
  onCancel,
}: {
  order: Order;
  /** The filled button, whichever it is, so focus can move to it after a step is recorded. */
  nextStepRef: Ref<HTMLButtonElement>;
  onShip: () => void;
  onRecordPayment: () => void;
  onNotifyDelay: () => void;
  onCancel: () => void;
}) {
  const short = shortLines(order).length > 0;
  return (
    <Group gap="sm" wrap="nowrap">
      <Button variant="outline" leftSection={<IconPrinter size={ICON_SIZE} />}>
        納品書を印刷
      </Button>
      {/*
       * The one filled button is the next step for what holds the order: the payment first, since the customer owes
       * it; then the stock, which leaves the customer waiting, so they are told; then the shipment. A shipped order
       * has none. Once the customer has been told, the notice stays at hand for a second one, unfilled.
       */}
      {order.status === 'paymentPending' && (
        <Button
          ref={nextStepRef}
          leftSection={<IconCash size={ICON_SIZE} />}
          onClick={onRecordPayment}
        >
          入金を記録
        </Button>
      )}
      {order.status === 'notShipped' && short && (
        <Button
          ref={nextStepRef}
          variant={isDelayNoticeSent(order) ? 'default' : undefined}
          leftSection={<IconMail size={ICON_SIZE} />}
          onClick={onNotifyDelay}
        >
          遅れを連絡
        </Button>
      )}
      {order.status === 'notShipped' && !short && (
        <Button
          ref={nextStepRef}
          leftSection={<IconTruckDelivery size={ICON_SIZE} />}
          onClick={onShip}
        >
          発送を記録
        </Button>
      )}
      <Menu position="bottom-end" width={200}>
        {/* The default size is a Button's height, so the row of actions lines up. */}
        <Menu.Target>
          <ActionIcon variant="default" aria-label="その他の操作">
            <IconDotsVertical size={ICON_SIZE} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconEdit size={ICON_SIZE} />}>受注を編集</Menu.Item>
          <Menu.Item leftSection={<IconCopy size={ICON_SIZE} />}>受注を複製</Menu.Item>
          {awaitsShipment(order) && (
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
    <SectionCard title="明細">
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
            const short = awaitsShipment(order) && product.quantity < quantity;
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
                {/* A no-break space keeps a figure with its unit when a narrow column wraps. */}
                <Table.Td ta="right">{`${quantity}\u00a0${product.unit}`}</Table.Td>
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
          <Timeline.Item key={event.id} title={event.label}>
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
  const [paymentOpened, setPaymentOpened] = useState(false);
  const [delayOpened, setDelayOpened] = useState(false);
  const [cancelOpened, setCancelOpened] = useState(false);

  /*
   * A recorded step changes the state, and the button that started it goes away with the old state (入金を記録,
   * 発送を記録, the menu's 受注をキャンセル), so the dialog would hand focus back to nothing and leave it on the page.
   * Focus moves to the next step's filled button instead, or to the heading when the state has none, where the new
   * state and the line on whether the order can ship are read next.
   */
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextStepRef = useRef<HTMLButtonElement>(null);
  const stepRecorded = useRef(false);
  useEffect(() => {
    if (!stepRecorded.current) return;
    stepRecorded.current = false;
    (nextStepRef.current ?? headingRef.current)?.focus();
  }, [order]);

  /*
   * The history records when the step was recorded (NOW); what the step was about, such as the day the order left,
   * is kept apart from it. A service gets the new event's id back from the server; the story makes one up, so the
   * same step taken twice (a second delay notice) still makes two events.
   */
  const addEvent = (
    status: Order['status'],
    event: Omit<OrderEvent, 'id' | 'at' | 'by'>,
    changes: Partial<Order> = {},
  ) => {
    stepRecorded.current = true;
    setOrder((current) => ({
      ...current,
      ...changes,
      status,
      history: [
        ...current.history,
        { id: crypto.randomUUID(), at: NOW.at, by: CURRENT_USER.name, ...event },
      ],
    }));
  };

  const ship = ({ shippedOn, carrier, trackingNumber }: ShipmentValues) => {
    addEvent(
      'shipped',
      { kind: 'shipped', label: `発送（${carrier} ${trackingNumber.trim()}）` },
      { shippedOn: fromIsoDate(shippedOn ?? NOW.date) },
    );
    setShipOpened(false);
    notifications.show({
      title: '発送を記録しました',
      message: `${order.id} を発送済みにしました。`,
    });
  };

  const recordPayment = ({ paidOn }: PaymentValues) => {
    addEvent('notShipped', {
      kind: 'paymentConfirmed',
      label: `入金を確認（${monthDay(fromIsoDate(paidOn ?? NOW.date))}の振込）`,
    });
    setPaymentOpened(false);
    notifications.show({
      title: '入金を記録しました',
      message: `${order.id} を発送できるようになりました。`,
    });
  };

  const notifyDelay = () => {
    addEvent(order.status, { kind: 'delayNotified', label: '発送の遅れを顧客へ連絡（メール）' });
    setDelayOpened(false);
    notifications.show({
      title: '発送の遅れを連絡しました',
      message: `${order.customer.email} にメールを送りました。`,
    });
  };

  const cancel = () => {
    addEvent('cancelled', { kind: 'cancelled', label: '受注をキャンセル' });
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
              <Title ref={headingRef} tabIndex={-1} order={1} size="h3">
                {order.id}
              </Title>
              <OrderStatusBadge status={order.status} />
            </Group>
            <Text size="sm" c="dimmed">
              {order.customer.name}・{monthDay(order.date)}に受注・担当 {order.staff}
            </Text>
            <ShippingVerdict order={order} />
          </Stack>
          <OrderActions
            order={order}
            nextStepRef={nextStepRef}
            onShip={() => setShipOpened(true)}
            onRecordPayment={() => setPaymentOpened(true)}
            onNotifyDelay={() => setDelayOpened(true)}
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
      <PaymentModal
        order={order}
        opened={paymentOpened}
        onClose={() => setPaymentOpened(false)}
        onSubmit={recordPayment}
      />
      <DelayNoticeModal
        order={order}
        opened={delayOpened}
        onClose={() => setDelayOpened(false)}
        onSubmit={notifyDelay}
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
            {/* The line on whether the order can ship. */}
            <Skeleton height={14} my={3} width={340} maw="100%" />
          </Stack>
          {/* The sizes of 納品書を印刷, 発送を記録 and その他の操作, so the buttons do not move when they arrive. */}
          <Group gap="sm" wrap="nowrap">
            <Skeleton height={32} width={118} />
            <Skeleton height={32} width={105} />
            <Skeleton height={32} width={32} />
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

/*
 * The heading keeps the number that was opened, so a mistyped number shows; the card says once what happened, where
 * the screen looked, and the two ways on: the button for a mistyped number, the switcher for another organization's. The switcher sits at the top of the sidebar at every width (behind the menu
 * button on a phone), so the card can name the place.
 */
function NotFoundContent({ id }: { id: string }) {
  return (
    <Stack gap="lg">
      <Title order={1} size="h3">
        {id}
      </Title>
      <Card>
        <EmptyState icon={<IconFileSearch />} withIndicatorBackground>
          <EmptyState.Title order={2}>受注が見つかりません</EmptyState.Title>
          <EmptyState.Description>
            {DEFAULT_ORGANIZATION.name}
            の受注に、この受注番号はありません。見出しの番号に打ち間違いが無いか確かめてください。ほかの組織の受注なら、サイドバーのいちばん上で組織を切り替えてから開き直してください。
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button leftSection={<IconList size={ICON_SIZE} />}>受注一覧で探す</Button>
          </EmptyState.Actions>
        </EmptyState>
      </Card>
    </Stack>
  );
}

function OrderDetailPage({ id, state }: { id: string; state?: 'loading' }) {
  const order = findOrder(id);
  let content;
  if (state === 'loading') content = <LoadingDetail id={id} />;
  else if (order) content = <OrderDetail initialOrder={order} />;
  else content = <NotFoundContent id={id} />;
  return (
    <AppFrame
      parent="受注"
      page="受注一覧"
      breadcrumbs={[...LIST_BREADCRUMBS, id]}
      // The organization whose orders the screen looked in, named by the card when the order is not found.
      defaultOrganization={DEFAULT_ORGANIZATION}
    >
      {/*
       * Said only to a screen reader, as the skeletons say nothing to it. The line stays in place empty once the order
       * is shown, and sits outside the loading part, which is aria-busy meanwhile.
       */}
      <VisuallyHidden role="status">
        {state === 'loading' ? '受注を読み込んでいます' : ''}
      </VisuallyHidden>
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
          'データパターンの「未発送の受注」（明細 3 行、希望の着日あり、在庫は足りている）です。見出しの下の 1 行が、在庫も支払いも発送を止めないことを答えます。「発送を記録」で発送日・配送業者・送り状番号を入れると発送済みに変わり、1 行は発送した日に替わって、塗りのボタンが消え、履歴に 1 件増えます。',
      },
    },
  },
  render: () => <OrderDetailPage id={ORDER_ID} />,
};

export const PaymentPending: Story = {
  name: '入金を待っているとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「入金待ち」（銀行振込の前払い、明細 2 行、希望の着日なし）です。見出しの下の 1 行が、発送できないことと、前払いのため入金の確認を待っているという理由を答え、塗りのボタンは「発送を記録」の代わりに「入金を記録」になります。入金日を入れて記録すると未発送に変わり、1 行は発送できるという答えに、ボタンは「発送を記録」に替わります。',
      },
    },
  },
  render: () => <OrderDetailPage id={PAYMENT_PENDING_ORDER_ID} />,
};

export const ShortStock: Story = {
  name: '在庫が足りないとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「在庫が足りない明細がある」（明細 3 行のうち 1 行、後払い）です。見出しの下の 1 行に何がいくつ足りず、いつ入荷するかを書き、足りない行に在庫不足の印を出します。塗りのボタンは「発送を記録」の代わりに「遅れを連絡」になり、下書きを確かめて送ると履歴に 1 件増え、1 行に連絡済みと出て、ボタンは枠のボタンに替わります。',
      },
    },
  },
  render: () => <OrderDetailPage id={SHORT_STOCK_ORDER_ID} />,
};

export const Loading: Story = {
  name: '読み込み中',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「読み込み中」です。受注番号は開いたアドレスから分かるので見出しに出し、状態・顧客・発送できるかの 1 行・明細・操作のボタンは読み込み後と同じ位置に Skeleton で置きます。Card の見出しも先に出して、どこに何が来るかを読み込み中から分かるようにしています。Skeleton はスクリーンリーダーに何も伝えないので、読み上げだけに届く「受注を読み込んでいます」の行（role="status"）を添えています。',
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
          'データパターンの「受注が見つからない」です。見出しには開いた受注番号だけを出して打ち間違いに気づけるようにし、Card で、探した組織に無いこと、見出しの番号に打ち間違いが無いかを確かめること、ほかの組織の受注なら組織を切り替えて開き直すことを 1 度ずつ書きます。組織の切り替えはどの幅でもサイドバーのいちばん上にある（スマホではメニューのボタンで開く）ので場所を名指しし、「受注一覧で探す」が狭い幅でも戻る道になるので、画面上部の戻るリンクは出しません。',
      },
    },
  },
  render: () => <OrderDetailPage id={MISSING_ORDER_ID} />,
};
