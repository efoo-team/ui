import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  VisuallyHidden,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconLock, IconPencil, IconSearch } from '@tabler/icons-react';
import { AppFrame, ICON_SIZE } from './shared/AppFrame';
import {
  ALL_PRODUCTS,
  ATTENTION_COLOR,
  needsReorder,
  PRODUCT_CATEGORIES,
  STAFF,
  yen,
  type Product,
} from './shared/data';

const meta = {
  title: '画面例 / 権限が無いとき',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // AppShell places the frame with position: fixed, so each story is drawn in an iframe of its own.
      story: { inline: false, height: '900px' },
      description: {
        component:
          '架空の販売管理サービスで、役割が「メンバー」の人が、管理者だけに許された画面や操作に出会ったときの画面です。画面ごと見られないとき（売上のレポート）と、一部の操作だけできないとき（商品一覧）の 2 つを示します。\n\n' +
          '**目的と読み手**　ふだんこのサービスを使っているメンバーが、同僚から共有されたリンクや毎日開く画面で、自分に許されていないものに出会う場面です。読み手が知りたいのは、何ができないのか、なぜか、誰に頼めばできるようになるか、代わりに何ができるかの 4 つです。\n\n' +
          '**情報構造**　どちらも、利用者の役割（メンバー）と、管理者だけに許されたもの（売上のレポートという画面全体、または商品に対する一部の操作）の関係を扱います。売上のレポートでは中身を出せないので、見られないことと頼む相手が主になります。商品一覧では、主は商品とその在庫数です。発注点は在庫数を読む基準（下回ると「要発注」）としてその次に来て、単価・分類・商品コードが従、役割による制限は画面全体に 1 つだけかかる従の情報です。\n\n' +
          '**データパターン**　権限の状態は、画面ごと見られない（story『画面ごと見られないとき』）と、画面は見られるが操作の一部ができない（story『一部の操作だけできないとき』）の 2 つです。前者は、依頼を送ると「閲覧を依頼」のボタンが消え、本文が、依頼した日と相手、許可されるとお知らせが届くこと、許可されたあとに起きることに変わります。後者の商品一覧は 12 品目で、商品名は 9〜17 文字ほど、単価は ¥90〜¥3,200、発注点を下回る品目が 4 つあります。メンバーにとって操作は、できる（在庫数の確認と修正）か、できない（単価の変更、商品の登録・削除）かのどちらかです。検索や分類の絞り込みで 0 件になると、表（スマホの幅では並び）の中に「条件に合う商品はありません。」と出します。読み込み中と取得の失敗は一覧の画面例と同じ扱いになるため、ここでは扱いません。\n\n' +
          '**情報の流れ**　売上のレポートでは、利用者はまずページの名前でどこに来たかを知り、次に見られないことと理由、頼むと何が許されるか（役割はメンバーのまま、このページだけを見られる）と頼む相手を知り、頼むか、ほかの画面へ移るかを決めます。頼んだあとは、許可をどこで知り、待つあいだにどこで何を見られるかを知ります。商品一覧では、商品を探し、在庫数を発注点と見比べ、実物と違えば在庫数を直します。単価を変えたい、商品を登録したいと思ったときに初めて、できないことと頼む相手を知る必要が生まれます。\n\n' +
          '**主役**　売上のレポートでは、見られないことを告げる 1 か所と、その中の塗りの「閲覧を依頼」です。役割が管理者とメンバーの 2 つしかないため、頼むと管理者にされるのかと迷わないよう、ボタンのすぐ上の本文で、ボタンと同じ「閲覧を依頼」の言葉で頼む相手を示し、続く 1 文で、許されるのはこのページだけで役割はメンバーのままであることを示しました。外枠のサイドバーは残し、頼まずにほかの画面へ移る道もその場に残しました。依頼を送るとボタンは消え、フォーカスは残った「ダッシュボードを開く」へ移ります。商品一覧では、商品名のすぐ右に置いた在庫数と、そのすぐ右の修正のボタンです。修正のボタンは行の端のメニューに入れず、在庫数の隣に専用の列を設けて置き、在庫数の数字は見出しの右端に揃えました。スマホの幅では表を 1 品目ずつのまとまりに組み替え、在庫数の下に発注点を添えて、要発注の根拠と修正のボタンを横に動かさずに見られるようにしています。「要発注」の Badge は、この幅では在庫数の左に置き、要発注の品目だけ行が増えないようにしました。\n\n' +
          '**抑えたもの・使わなかったもの**　できない理由は役割という 1 つの原因から来るので、行や操作ごとに繰り返さず、見出しの横（狭い幅では下）の 1 か所に小さく書きました。できることを先に書き、「メンバーの役割では」と役割の側から書いて、本人の役割と、それが一人への扱いではなく役割の決まりであることが読めるようにしています（売上のレポートの「管理者だけが見られます」と同じ言い方です）。そこは管理者なら「商品を登録」のボタンがある場所で、ボタンを探しに来た人の目に入ります。できない操作は、使えないボタンとしても置いていません。毎日開く画面で使えないボタンが行ごとに並ぶと、できることよりできないことが目立つためです。理由を Tooltip だけに書くこともしていません。theme の Tooltip はタップでは開かず、読み上げにも渡らないためです。依頼を送ったときの通知は 1 行の受け付けだけにし、その後のことは画面に残る本文に任せました。\n\n' +
          '**目的が違えば変わるところ**　申請が通れば使える、プランを変えれば使える、のように利用者が使えるようにできる操作は、隠さずに使えない状態で並べ、隣に見える文字で理由と使えるようにする方法を添えます。そのときの Button は `disabled` ではなく `data-disabled` と `aria-disabled` にして onClick で押しても何も起きないようにし、フォーカスが届くようにします。外部の取引先が見る画面のように、権限の無い画面があること自体を知らせたくない場合は、「見つからない」と同じ表示にします。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Every name and number below is fictional. The signed-in user (CURRENT_USER) has the member role; one of the staff
// is the administrator the screens point to.
const ROLE = { admin: '管理者', member: 'メンバー' };
const ADMIN = STAFF[1]!;

function SalesReportPage() {
  const [requested, setRequested] = useState(false);
  const dashboardRef = useRef<HTMLButtonElement>(null);
  /*
   * The pressed button goes away, so focus moves to the button that stays beside it, the way on from here, instead of
   * falling to the page. A real button takes the theme's focus ring only when the keyboard pressed the request.
   */
  useEffect(() => {
    if (requested) dashboardRef.current?.focus();
  }, [requested]);
  /*
   * The card below already says what happens next and stays there, so the notification only acknowledges the press in
   * one line. It is kept because focus moves away from the changed text, and the notification (role="alert") is what a
   * screen reader reads.
   */
  const request = () => {
    setRequested(true);
    notifications.show({ message: `${ADMIN}さんに閲覧を依頼しました。` });
  };

  // The frame stays: the user is signed in and can use the rest of the service, so the sidebar is the way on.
  return (
    <AppFrame parent="レポート" page="売上">
      <Stack gap="lg">
        {/* The page keeps its name and what it holds, so the user can tell whether the request is worth making. */}
        <Stack gap={4}>
          <Title order={1} size="h3">
            売上
          </Title>
          <Text size="sm" c="dimmed">
            期間ごとの受注額と、顧客別・商品別の内訳
          </Text>
        </Stack>
        <Card>
          <EmptyState icon={<IconLock />} withIndicatorBackground>
            {/* The compound Title takes a heading level, so the message sits under the page's h1 in the outline. */}
            <EmptyState.Title order={2}>売上のレポートを見る権限がありません</EmptyState.Title>
            {/*
             * With only two roles, a reader may fear the request makes them an administrator, so the text says it
             * opens this page alone and the role stays, in the words the button repeats (閲覧を依頼). The scope is
             * left to the text so the button stays short enough to sit beside the way on at a phone's width. Once
             * sent, the text says what happens next and where the answer arrives (the notices under ホーム) instead
             * of asking for the request again.
             */}
            <EmptyState.Description>
              {requested
                ? `10 月 31 日に、${ROLE.admin}の${ADMIN}さんへこのページの閲覧を依頼しました。許可されるとお知らせが届き、このページを開けるようになります。今月の受注額の合計は、ダッシュボードで見られます。`
                : `売上のレポートは${ROLE.admin}だけが見られます。${ROLE.admin}の${ADMIN}さんに閲覧を依頼できます。許されるのはこのページだけで、役割は${ROLE.member}のままです。今月の受注額の合計は、ダッシュボードで見られます。`}
            </EmptyState.Description>
            <EmptyState.Actions>
              {!requested && <Button onClick={request}>閲覧を依頼</Button>}
              <Button ref={dashboardRef} variant="default">
                ダッシュボードを開く
              </Button>
            </EmptyState.Actions>
          </EmptyState>
        </Card>
      </Stack>
    </AppFrame>
  );
}

function StockForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (quantity: number) => void;
  onCancel: () => void;
}) {
  const form = useForm<{ quantity: number | string }>({
    mode: 'uncontrolled',
    initialValues: { quantity: product.quantity },
    validate: {
      quantity: (value) =>
        typeof value === 'number' && Number.isInteger(value) && value >= 0
          ? null
          : '0 以上の整数を入力してください。',
    },
  });

  return (
    <form noValidate onSubmit={form.onSubmit((values) => onSave(Number(values.quantity)))}>
      <Stack gap="md">
        <Text size="sm">
          {product.name}（{product.code}）
        </Text>
        <NumberInput
          data-autofocus
          label={`在庫数（${product.unit}）`}
          description={`発注点 ${product.reorderPoint} ${product.unit}`}
          min={0}
          allowDecimal={false}
          allowNegative={false}
          required
          key={form.key('quantity')}
          {...form.getInputProps('quantity')}
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">保存</Button>
        </Group>
      </Stack>
    </form>
  );
}

// Fixing the stock is the one change members make here, so the button sits beside the value, not in a row menu.
function EditStockButton({ product, onEdit }: { product: Product; onEdit: () => void }) {
  return (
    <Tooltip label="在庫数を修正">
      <ActionIcon variant="subtle" aria-label={`${product.name}の在庫数を修正`} onClick={onEdit}>
        <IconPencil size={ICON_SIZE} />
      </ActionIcon>
    </Tooltip>
  );
}

function ReorderBadge({ product }: { product: Product }) {
  return needsReorder(product) ? <Badge color={ATTENTION_COLOR}>要発注</Badge> : null;
}

const NO_MATCHES = '条件に合う商品はありません。';

/*
 * The edit button has a column of its own right after the stock, so the stock lines up with its heading and the
 * button stays next to the value it changes.
 */
function ProductsTable({ rows, onEdit }: { rows: Product[]; onEdit: (product: Product) => void }) {
  return (
    <Table.ScrollContainer minWidth={600} scrollAreaProps={{ type: 'always' }}>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>商品</Table.Th>
            <Table.Th ta="right">在庫数</Table.Th>
            <Table.Th w={48}>
              <VisuallyHidden>操作</VisuallyHidden>
            </Table.Th>
            <Table.Th ta="right">発注点</Table.Th>
            <Table.Th ta="right">単価（税抜）</Table.Th>
            <Table.Th>分類</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((product) => (
            <Table.Tr key={product.code}>
              <Table.Td>
                <Stack gap={2}>
                  {/* The badge follows the name, as on the dashboard and the order detail. */}
                  <Group gap="xs">
                    <Text size="sm">{product.name}</Text>
                    <ReorderBadge product={product} />
                  </Group>
                  <Text size="xs" c="dimmed">
                    {product.code}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td ta="right">
                {product.quantity} {product.unit}
              </Table.Td>
              <Table.Td>
                <EditStockButton product={product} onEdit={() => onEdit(product)} />
              </Table.Td>
              <Table.Td ta="right">
                {product.reorderPoint} {product.unit}
              </Table.Td>
              <Table.Td ta="right">{yen(product.price)}</Table.Td>
              <Table.Td>{product.category}</Table.Td>
            </Table.Tr>
          ))}
          {rows.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text size="sm" c="dimmed" ta="center" py="lg">
                  {NO_MATCHES}
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

/*
 * On a phone the table would leave the reorder point, which says why a product needs reordering, behind a horizontal
 * scroll. Each product becomes a short block instead: what it is on the left, the stock with its reorder point and the
 * edit button on the right, so the two numbers a member compares sit together. The badge sits before the stock it
 * judges, right above the reorder point that explains it: after the name it would take a line of its own on this
 * width, and the rows that need reordering would be the only ones of three lines.
 */
function ProductsStack({ rows, onEdit }: { rows: Product[]; onEdit: (product: Product) => void }) {
  if (rows.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="lg">
        {NO_MATCHES}
      </Text>
    );
  }
  return (
    <Stack gap={0} role="list" aria-label="商品">
      {rows.map((product, index) => (
        <Stack key={product.code} gap={0} role="listitem">
          {index > 0 && <Divider />}
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm" py="sm">
            <Stack gap={2} miw={0}>
              <Text size="sm">{product.name}</Text>
              <Text size="xs" c="dimmed">
                {product.code}・{product.category}・単価 {yen(product.price)}
              </Text>
            </Stack>
            {/* The numbers keep their line; the name on the left wraps instead. */}
            <Group gap={4} wrap="nowrap" align="flex-start" flex="none">
              <Stack gap={2} align="flex-end">
                <Group gap="xs" wrap="nowrap">
                  <ReorderBadge product={product} />
                  <Text size="sm">
                    {product.quantity} {product.unit}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  発注点 {product.reorderPoint} {product.unit}
                </Text>
              </Stack>
              <EditStockButton product={product} onEdit={() => onEdit(product)} />
            </Group>
          </Group>
        </Stack>
      ))}
    </Stack>
  );
}

function ProductListPage() {
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  const rows = products.filter(
    (product) =>
      (!category || product.category === category) &&
      (query === '' || product.name.includes(query) || product.code.includes(query)),
  );

  const saveQuantity = (product: Product, quantity: number) => {
    setProducts((current) =>
      current.map((item) => (item.code === product.code ? { ...item, quantity } : item)),
    );
    setEditing(null);
    notifications.show({
      title: '在庫数を修正しました',
      message: `${product.name}：${product.quantity} ${product.unit} → ${quantity} ${product.unit}`,
    });
  };

  return (
    <AppFrame parent="商品" page="商品一覧">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" gap="md">
          <Stack gap={4}>
            <Title order={1} size="h3">
              商品一覧
            </Title>
            <Text size="sm" c="dimmed">
              {products.length} 品目（10 月 31 日時点の在庫）
            </Text>
          </Stack>
          {/* 商品を登録 would sit here. Members never register products, so instead of a disabled button that would
              be the first thing they see, the one reason for every missing action (the role) sits in its place,
              quietly: members open this screen daily, and the notice matters only when they look for an action.
              It starts with what the reader can do, and speaks from the role, as the sales report speaks from the
              page, so it reads as a rule of the service rather than a remark about one person. */}
          <Group gap="xs" wrap="nowrap" align="flex-start" maw={520}>
            <Text component="span" c="dimmed" display="flex" mt={2} aria-hidden>
              <IconLock size={ICON_SIZE} />
            </Text>
            <Text size="sm" c="dimmed">
              {`${ROLE.member}の役割では、在庫数の確認と修正ができます。単価の変更と商品の登録・削除は、${ROLE.admin}の${ADMIN}さんに依頼してください。`}
            </Text>
          </Group>
        </Group>
        <Card>
          <Group mb="md" gap="sm" wrap="wrap">
            <TextInput
              flex="1 1 240px"
              leftSection={<IconSearch size={ICON_SIZE} />}
              placeholder="商品名・商品コードで検索"
              aria-label="商品を検索"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
            <Select
              flex="0 1 180px"
              placeholder="分類で絞り込み"
              aria-label="分類で絞り込み"
              data={PRODUCT_CATEGORIES}
              value={category}
              onChange={setCategory}
              clearable
            />
          </Group>
          {/* Stock is what members come for, so it follows the name at every width. */}
          <Stack visibleFrom="sm" gap={0}>
            <ProductsTable rows={rows} onEdit={setEditing} />
          </Stack>
          <Stack hiddenFrom="sm" gap={0}>
            <ProductsStack rows={rows} onEdit={setEditing} />
          </Stack>
          <Text size="sm" c="dimmed" mt="md">
            {products.length} 件中 {rows.length} 件を表示
          </Text>
        </Card>
      </Stack>
      <Modal opened={editing !== null} onClose={() => setEditing(null)} title="在庫数を修正">
        {editing && (
          <StockForm
            product={editing}
            onSave={(quantity) => saveQuantity(editing, quantity)}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </AppFrame>
  );
}

export const PageNotAllowed: Story = {
  name: '画面ごと見られないとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「画面ごと見られない」に当たります。レポートの中身は 1 つも出さず、見られないこと・理由・頼むと許されること（このページだけ）・頼む相手を 1 か所にまとめ、外枠とページの名前は残して、頼むかほかの画面へ移るかをその場で選べるようにしています。「閲覧を依頼」を押すとボタンが消え、1 行の通知が出て、本文が、許可されるとお知らせが届くことと代わりに見られる場所に変わります。',
      },
    },
  },
  render: () => <SalesReportPage />,
};

export const SomeActionsNotAllowed: Story = {
  name: '一部の操作だけできないとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「画面は見られるが操作の一部ができない」に当たります。在庫数は値のすぐ右のボタンから修正でき、単価の変更と商品の登録・削除のボタンは置かず、できること・本人の役割・頼む相手を見出しの横に 1 か所だけ書いています。スマホの幅では、表を 1 品目ずつのまとまりに替え、在庫数と発注点を並べ、「要発注」の Badge を在庫数の左に置きます。',
      },
    },
  },
  render: () => <ProductListPage />,
};
