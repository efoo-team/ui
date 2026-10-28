import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Card, Group, Stack, Table, Text, Title } from '@mantine/core';

const meta = {
  title: '表示 / 表・カード・バッジ（Table, Card, Badge）',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableExample: Story = {
  name: '表の内容と状態',
  parameters: {
    docs: {
      description: {
        story: '表の状態表示、横スクロール、区切り線の有無を確認できます。',
      },
    },
  },
  render: () => (
    <Stack>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>項目</Table.Th>
            <Table.Th>状態</Table.Th>
            <Table.Th>担当</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>サンプル項目 A</Table.Td>
            <Table.Td>
              <Badge>進行中</Badge>
            </Table.Td>
            <Table.Td>担当者 1</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>サンプル項目 B</Table.Td>
            <Table.Td>
              <Badge>完了</Badge>
            </Table.Td>
            <Table.Td>担当者 2</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>サンプル項目 C</Table.Td>
            <Table.Td>
              <Badge color="yellow">要確認</Badge>
            </Table.Td>
            <Table.Td>担当者 3</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Table.ScrollContainer minWidth={480}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>横幅がある表</Table.Th>
              <Table.Th>数値</Table.Th>
              <Table.Th>備考</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>サンプル項目</Table.Td>
              <Table.Td>128</Table.Td>
              <Table.Td>横幅に応じてスクロールできます</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Table withRowBorders={false} horizontalSpacing="xl">
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>区切り線なし</Table.Td>
            <Table.Td>横余白を広げた表示</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>サンプル項目</Table.Td>
            <Table.Td>内容</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  ),
};

export const CardAndBadgeExamples: Story = {
  name: 'カードとバッジ',
  parameters: {
    docs: {
      description: {
        story: 'Badge の表示方法と、情報をまとめる Card の構成を確認できます。',
      },
    },
  },
  render: () => (
    <Stack>
      <Group>
        <Badge variant="filled">塗りつぶし</Badge>
        <Badge variant="light">薄い背景</Badge>
        <Badge variant="outline">枠線</Badge>
        <Badge variant="dot">Dot</Badge>
        <Badge size="lg">大</Badge>
      </Group>
      <Group align="stretch">
        <Card w={300}>
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={4} size="h5">
                サンプルカード
              </Title>
              <Badge>標準</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              カードは関連する情報と操作をひとまとまりに表示します。
            </Text>
            <Group justify="flex-end">
              <Badge variant="outline">詳細</Badge>
            </Group>
          </Stack>
        </Card>
        <Card w={300}>
          <Stack gap="sm">
            <Title order={4} size="h5">
              状態を伝える
            </Title>
            <Text size="sm">タイトル、説明、状態ラベルを組み合わせます。</Text>
            <Badge variant="outline">利用可能</Badge>
          </Stack>
        </Card>
      </Group>
    </Stack>
  ),
};

const statusColors = [
  { color: 'green', label: '完了' },
  { color: 'blue', label: '案内' },
  { color: 'yellow', label: '注意' },
  { color: 'red', label: '要対応' },
] as const;

export const BadgeStatusColors: Story = {
  name: 'バッジの状態色',
  parameters: {
    docs: {
      description: {
        story:
          'Badge の既定は薄い背景です。状態を表す 4 色を、薄い背景と枠線で並べます。塗りつぶし（variant="filled"）は、色を指定しない場合と、削除などの取り消せない操作を表す赤だけに使います。ツールバーでライトとダークを切り替えて、文字が読めることを確認できます。',
      },
    },
  },
  render: () => (
    <Stack>
      <Group>
        <Badge variant="filled">既定</Badge>
        <Badge color="red" variant="filled">
          要対応
        </Badge>
      </Group>
      {(['light', 'outline'] as const).map((variant) => (
        <Group key={variant}>
          {statusColors.map(({ color, label }) => (
            <Badge key={color} color={color} variant={variant}>
              {label}
            </Badge>
          ))}
        </Group>
      ))}
    </Stack>
  ),
};
