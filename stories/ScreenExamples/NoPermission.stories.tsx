import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
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
          '**情報構造**　どちらも、利用者の役割（メンバー）と、管理者だけに許されたもの（売上のレポートという画面全体、または商品に対する一部の操作）の関係を扱います。売上のレポートでは中身を出せないので、見られないことと頼む相手が主になります。商品一覧では、主は商品とその在庫数で、発注点・単価・分類・商品コードが従、役割による制限は画面全体に 1 つだけかかる従の情報です。\n\n' +
          '**データパターン**　権限の状態は、画面ごと見られない（story『画面ごと見られないとき』）と、画面は見られるが操作の一部ができない（story『一部の操作だけできないとき』）の 2 つです。前者は、依頼を送ると「依頼しました」の 1 行に変わります。後者の商品一覧は 12 品目で、商品名は 9〜17 文字ほど、単価は ¥90〜¥3,200、発注点を下回る品目が 4 つあります。メンバーにとって操作は、できる（在庫数の確認と修正）か、できない（単価の変更、商品の登録・削除）かのどちらかです。検索や分類の絞り込みで 0 件になると、表の中に「条件に合う商品はありません」と出します。読み込み中と取得の失敗は一覧の画面例と同じ扱いになるため、ここでは扱いません。\n\n' +
          '**情報の流れ**　売上のレポートでは、利用者はまずページの名前でどこに来たかを知り、次に見られないことと理由と頼む相手を知り、頼むか、ほかの画面へ移るかを決めます。商品一覧では、商品を探し、在庫数を発注点と見比べ、実物と違えば在庫数を直します。単価を変えたい、商品を登録したいと思ったときに初めて、できないことと頼む相手を知る必要が生まれます。\n\n' +
          '**主役**　売上のレポートでは、見られないことを告げる 1 か所と、その中の塗りの「閲覧を依頼」です。外枠のサイドバーは残し、頼まずにほかの画面へ移る道もその場に残しました。商品一覧では、商品名のすぐ右に置いた在庫数と、その値の横の修正のボタンです。行の端のメニューに入れず値の横に置いたので、スマホの幅でも表を横に動かさずに在庫数を見て直せます。\n\n' +
          '**抑えたもの・使わなかったもの**　できない理由は役割という 1 つの原因から来るので、行や操作ごとに繰り返さず、見出しの横（狭い幅では下）の 1 か所に小さく書きました。そこは管理者なら「商品を登録」のボタンがある場所で、ボタンを探しに来た人の目に入ります。できない操作は、使えないボタンとしても置いていません。毎日開く画面で使えないボタンが行ごとに並ぶと、できることよりできないことが目立つためです。理由を Tooltip だけに書くこともしていません。theme の Tooltip はタップでは開かず、読み上げにも渡らないためです。\n\n' +
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
  const statusRef = useRef<HTMLParagraphElement>(null);
  // The pressed button goes away, so focus moves to the line that replaces it instead of falling to the page.
  useEffect(() => {
    if (requested) statusRef.current?.focus();
  }, [requested]);
  const request = () => {
    setRequested(true);
    notifications.show({
      title: '閲覧を依頼しました',
      message: `${ADMIN}さんが許可すると、このページを開けるようになります。`,
    });
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
          <EmptyState
            icon={<IconLock />}
            withIndicatorBackground
            title="売上のレポートを見る権限がありません"
            description={`売上のレポートは${ROLE.admin}だけが見られます。必要なときは、${ROLE.admin}の${ADMIN}さんに閲覧を依頼してください。今月の受注額の合計は、ダッシュボードで見られます。`}
          >
            <EmptyState.Actions>
              {requested ? (
                <Text ref={statusRef} tabIndex={-1} size="sm" c="dimmed" role="status">
                  10 月 31 日に{ADMIN}さんへ依頼しました
                </Text>
              ) : (
                <Button onClick={request}>閲覧を依頼</Button>
              )}
              <Button variant="default">ダッシュボードを開く</Button>
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
          : '0 以上の整数を入力してください',
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
              quietly: members open this screen daily, and the notice matters only when they look for an action. */}
          <Group gap="xs" wrap="nowrap" align="flex-start" maw={440}>
            <Text component="span" c="dimmed" display="flex" mt={2} aria-hidden>
              <IconLock size={ICON_SIZE} />
            </Text>
            <Text size="sm" c="dimmed">
              {`${ROLE.member}の役割では、単価の変更と商品の登録・削除はできません。必要なときは${ROLE.admin}の${ADMIN}さんに依頼してください。`}
            </Text>
          </Group>
        </Group>
        <Card>
          {/* Stock is what members come for, so it follows the name and stays in view at phone width. */}
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
          <Table.ScrollContainer minWidth={560} scrollAreaProps={{ type: 'always' }}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>商品</Table.Th>
                  <Table.Th ta="right">在庫数</Table.Th>
                  <Table.Th ta="right">発注点</Table.Th>
                  <Table.Th ta="right">単価（税抜）</Table.Th>
                  <Table.Th>分類</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((product) => (
                  <Table.Tr key={product.code}>
                    <Table.Td>
                      {/* The badge sits under the name, so the stock column stays a narrow column of numbers that
                          fits beside the name at phone width. */}
                      <Text size="sm">{product.name}</Text>
                      <Group gap="xs" wrap="nowrap">
                        <Text size="xs" c="dimmed">
                          {product.code}
                        </Text>
                        {needsReorder(product) && <Badge color={ATTENTION_COLOR}>要発注</Badge>}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      {/* Fixing the stock is the one change members make here, so it sits on the value itself,
                          next to the name and in view at phone width, not in a menu at the far end of the row. */}
                      <Group gap={4} justify="flex-end" wrap="nowrap">
                        <Text size="sm">
                          {product.quantity} {product.unit}
                        </Text>
                        <Tooltip label="在庫数を修正">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            aria-label={`${product.name}の在庫数を修正`}
                            onClick={() => setEditing(product)}
                          >
                            <IconPencil size={ICON_SIZE} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
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
                    <Table.Td colSpan={5}>
                      <Text size="sm" c="dimmed" ta="center" py="lg">
                        条件に合う商品はありません
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
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
          'データパターンの「画面ごと見られない」に当たります。レポートの中身は 1 つも出さず、見られないこと・理由・頼む相手を 1 か所にまとめ、外枠とページの名前は残して、頼むかほかの画面へ移るかをその場で選べるようにしています。',
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
          'データパターンの「画面は見られるが操作の一部ができない」に当たります。在庫数は値の横のボタンから修正でき、単価の変更と商品の登録・削除のボタンは置かず、理由と頼む相手を見出しの横に 1 か所だけ書いています。',
      },
    },
  },
  render: () => <ProductListPage />,
};
