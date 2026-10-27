import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Checkbox,
  Group,
  Radio,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';

const meta = {
  title: '入力 / フォーカスの見え方（Button・TextInput・Checkbox・Radio・Switch・Tabs）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const KeyboardFocus: Story = {
  name: 'キーボード操作のフォーカス',
  parameters: {
    docs: {
      description: {
        story:
          '画面を開いた直後は最初の入力欄にフォーカスがあります。Tab キーで順に移動し、部品ごとのフォーカスの輪郭が揃っていること、エラー状態の入力欄でも輪郭が見えることを確認できます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLInputElement>('input')?.focus();
  },
  render: () => (
    <Stack maw={440} gap="lg">
      <Text size="sm" c="dimmed">
        Tab キーで次の部品へ、Shift + Tab で前の部品へ移動します。
      </Text>
      <TextInput label="名前" placeholder="例：山田 太郎" />
      <TextInput label="入力エラー" defaultValue="invalid" error="入力内容を確認してください" />
      <Group>
        <Button>塗りつぶし</Button>
        <Button variant="outline">枠線</Button>
        <Button variant="subtle">控えめ</Button>
      </Group>
      <Group>
        <Checkbox label="チェックボックス" />
        <Switch label="スイッチ" />
      </Group>
      <Radio.Group label="ラジオボタン" defaultValue="a">
        <Group mt="xs">
          <Radio value="a" label="項目 A" />
          <Radio value="b" label="項目 B" />
        </Group>
      </Radio.Group>
      <Tabs defaultValue="first">
        <Tabs.List>
          <Tabs.Tab value="first">概要</Tabs.Tab>
          <Tabs.Tab value="second">履歴</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Stack>
  ),
};
