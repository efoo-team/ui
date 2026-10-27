import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Group, Radio, Stack, Switch, Text } from '@mantine/core';

const meta = {
  title: '入力 / チェック・選択・切り替え（Checkbox・Radio・Switch）',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  name: '状態の一覧',
  parameters: {
    docs: {
      description: {
        story: 'Checkbox、Radio、Switch の未選択・選択中・無効・エラー状態を比べられます。',
      },
    },
  },
  render: () => (
    <Stack gap="xl">
      <Stack gap="sm">
        <Text fw={600}>Checkbox</Text>
        <Group align="flex-start">
          <Checkbox label="未選択" />
          <Checkbox label="選択済み" defaultChecked />
          <Checkbox label="一部選択" indeterminate />
          <Checkbox label="変更できません" disabled />
          <Checkbox label="入力エラー" error="選択してください" />
        </Group>
        <Group>
          <Checkbox variant="outline" label="枠線付き" defaultChecked />
          <Checkbox size="xs" label="極小" />
          <Checkbox size="lg" label="大" />
        </Group>
      </Stack>
      <Radio.Group label="表示方法" defaultValue="list">
        <Group mt="xs">
          <Radio value="list" label="一覧" />
          <Radio value="grid" label="グリッド" />
          <Radio value="disabled" label="変更できません" disabled />
        </Group>
      </Radio.Group>
      <Radio.Group label="入力エラー" error="いずれかを選択してください">
        <Group mt="xs">
          <Radio value="a" label="項目 A" />
          <Radio value="b" label="項目 B" />
        </Group>
      </Radio.Group>
      <Radio.Group label="枠線付きの表示" defaultValue="one">
        <Group mt="xs">
          <Radio variant="outline" value="one" label="選択済み" />
          <Radio variant="outline" value="two" label="未選択" />
          <Radio size="lg" value="large" label="大" />
        </Group>
      </Radio.Group>
      <Stack gap="sm">
        <Text fw={600}>Switch</Text>
        <Group>
          <Switch label="オフ" />
          <Switch label="オン" defaultChecked />
          <Switch label="変更できません" disabled />
          <Switch label="大きい表示" size="lg" defaultChecked />
          <Switch label="オンで変更できません" disabled defaultChecked />
        </Group>
      </Stack>
    </Stack>
  ),
};

export const SwitchInnerLabels: Story = {
  name: '内側ラベルの見え方',
  parameters: {
    docs: {
      description: {
        story:
          'Switch の内側に文字を出す Mantine 固有の表示です（shadcn/ui の Switch にはありません）。文字は 10px 以上で、オンとオフの両方を確認できます。',
      },
    },
  },
  render: () => (
    <Stack gap="sm">
      <Switch size="sm" onLabel="入" offLabel="切" label="機能の利用状態" defaultChecked />
      <Switch size="lg" onLabel="有効" offLabel="無効" label="操作できる状態" />
    </Stack>
  ),
};
