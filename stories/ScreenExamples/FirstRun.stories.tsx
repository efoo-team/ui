import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, EmptyState, FileButton, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBox, IconPlus, IconUpload } from '@tabler/icons-react';
import { AppFrame, ICON_SIZE } from './shared/AppFrame';
import { ORGANIZATIONS } from './shared/data';

const meta = {
  title: '画面例 / 最初の空の状態',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // AppShell places the frame with position: fixed, so each story is drawn in an iframe of its own.
      story: { inline: false, height: '720px' },
      description: {
        component:
          '架空の販売管理サービスで、使い始めたばかりの組織が商品一覧を開いたときの画面です。商品はまだ 1 件もありません。\n\n' +
          '**目的と読み手**　サービスを使い始めた担当者が、最初の数回だけ見る画面です。毎日使う一覧ではなく、初めて訪れて短い時間で「ここで何をするか」を決める画面なので、主役を 1 つにしてほかを置かない構成に寄せました。\n\n' +
          '**情報構造**　主は商品です。受注の明細は商品を選んで作り、在庫と発注点は商品ごとに数えるので、商品が無いうちは受注も在庫の管理も始まりません。この画面は、その起点が空であることと、空を埋める 2 つの道（1 件ずつ登録する、表計算ソフトで管理している商品の一覧を CSV で取り込む）を扱います。\n\n' +
          '**データパターン**　商品は商品コード・商品名・分類・単位・単価・在庫数・発注点を持ち、組織によって数十件から数百件になります。この画面例が描くのは、その組織に商品が 0 件の状態（story『商品がまだ無いとき』）だけです。1 件以上ある状態、絞り込みの結果が 0 件の状態、読み込み中、取得の失敗は、商品の一覧の画面と同じ扱いになるので、一覧（表）の画面例に任せています。\n\n' +
          '**情報の流れ**　利用者は、商品一覧にいることを知り、まだ商品が無く最初に商品を登録すればよいことを知ります。次に、登録すると受注と在庫の何ができるようになるかを知って登録する価値を判断し、手元の商品が少なければ 1 件ずつ登録し、表計算ソフトで商品の一覧を管理していれば CSV で取り込む、と道を選んで押します。\n\n' +
          '**主役**　流れの最後の行動である「商品を登録」です。ページの見出し、次にすることを言う見出し、登録する理由の 1 文、ボタンを上から流れの順に並べ、画面で唯一の塗りのボタンにして、読み終えた位置に押す場所が来るようにしました。見出しの下の説明は理由の 1 文だけに絞り、灰色の文が何行も続いて補足のように読まれないようにしています。\n\n' +
          '**抑えたもの・使わなかったもの**　CSV の取り込みは、表計算ソフトで商品を管理してきた組織には欠かせない道なので残し、枠線のボタンで主役より弱くしました。その案内は理由の文から外してボタンの下に小さな 1 文で置き、1 件ずつ登録する人が読む量を増やさないようにしています。書式のひな形は取り込みの画面に任せています。空の表の枠・検索欄・絞り込みとゼロの並んだ件数は、絞り込む対象も読み取れる数字も無く、主役から目をそらすだけなので出していません。見出しの右に置く「商品を登録」も、中央の主役と重なるので出していません。\n\n' +
          '**目的が違えば変わるところ**　商品がある一覧で絞り込みの結果が 0 件になったときは、利用者は商品を探している途中です。表の枠と検索・絞り込みを残し、表の中に「条件に合う商品はありません」と小さく出して条件を変える道を示し、登録を勧める呼びかけは出しません。登録の権限が無い人が開くサービスなら、ボタンの代わりに、誰が登録すると表示されるかを伝えます。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// The organization on trial (みなと通販) is the one that has just started, so it has no products and nothing to count.
const TRIAL_ORGANIZATION = ORGANIZATIONS.find((organization) => organization.note === 'お試し中')!;

function FirstRunPage() {
  return (
    <AppFrame parent="商品" page="商品一覧" defaultOrganization={TRIAL_ORGANIZATION} counts={{}}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1} size="h3">
            商品一覧
          </Title>
          <Text size="sm" c="dimmed">
            販売する商品と、その在庫を管理します。
          </Text>
        </Stack>
        {/* The empty state takes the place of the table, so it sits in the Card the list would. */}
        <Card>
          <EmptyState icon={<IconBox />} withIndicatorBackground>
            {/* The compound Title takes a heading level, so the message sits under the page's h1 in the outline. */}
            <EmptyState.Title order={2}>最初の商品を登録しましょう</EmptyState.Title>
            {/* Only the reason to register, so it is read as the point and not as fine print under the heading. */}
            <EmptyState.Description>
              登録した商品は受注の明細で選べるようになり、在庫が発注点を下回るとお知らせします。
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button leftSection={<IconPlus size={ICON_SIZE} />}>商品を登録</Button>
              <FileButton
                accept=".csv,text/csv"
                onChange={(file) => {
                  if (!file) return;
                  notifications.show({
                    title: '取り込みを始めました',
                    message: `${file.name} の商品を登録しています。終わると、この一覧に表示されます。`,
                  });
                }}
              >
                {(props) => (
                  <Button
                    {...props}
                    variant="default"
                    leftSection={<IconUpload size={ICON_SIZE} />}
                  >
                    CSV から取り込む
                  </Button>
                )}
              </FileButton>
            </EmptyState.Actions>
            {/* Under the buttons, so it reads as a note on the second way and not as part of the reason above. It starts with
                the button's name, which then stays on one line at phone width. */}
            <Text size="xs" c="dimmed">
              「CSV から取り込む」では、表計算ソフトで管理している商品の一覧をまとめて登録できます。
            </Text>
          </EmptyState>
        </Card>
      </Stack>
    </AppFrame>
  );
}

export const NoProducts: Story = {
  name: '商品がまだ無いとき',
  parameters: {
    docs: {
      description: {
        story:
          '組織に商品が 0 件のデータパターンです。一覧の表・検索・件数を消し、登録を勧める案内を 1 つだけ置きます。説明は登録する理由の 1 文にし、CSV の案内はボタンの下に置いています。「CSV から取り込む」を押すとファイルを選べ、選ぶと取り込みを始めたことを通知します。組織はお試し中の「みなと通販」で、まだ問い合わせも無いので、サイドバーに件数を出していません。',
      },
    },
  },
  render: () => <FirstRunPage />,
};
