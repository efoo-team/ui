import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Group, Radio, Stack, Switch, Text } from '@mantine/core';

const meta = {
  title: '入力 / チェック・選択・切り替え',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <Stack gap="xl">
      <Stack gap="sm">
        <Text fw={600}>Checkbox</Text>
        <Group>
          <Checkbox label="未選択" />
          <Checkbox label="選択済み" defaultChecked />
          <Checkbox label="一部選択" indeterminate />
          <Checkbox label="変更できません" disabled />
          <Checkbox label="入力エラー" error />
        </Group>
        <Group>
          <Checkbox variant="outline" label="枠線付き" defaultChecked />
          <Checkbox size="xs" label="極小" />
          <Checkbox size="lg" label="大" />
        </Group>
      </Stack>
      <Radio.Group name="sample-radio" label="表示方法" defaultValue="list">
        <Group mt="xs">
          <Radio value="list" label="一覧" />
          <Radio value="grid" label="グリッド" />
          <Radio value="disabled" label="変更できません" disabled />
        </Group>
      </Radio.Group>
      <Radio.Group name="sample-radio-outline" label="枠線付きの表示" defaultValue="one">
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
        </Group>
        <Group>
          <Switch onLabel="入" offLabel="切" label="内側のラベル" defaultChecked />
          <Switch onLabel="YES" offLabel="NO" label="ダークモードでも確認" defaultChecked />
          <Switch label="塗りつぶし" variant="filled" defaultChecked />
        </Group>
      </Stack>
    </Stack>
  ),
};

export const SwitchInnerLabels: Story = {
  name: 'Switch / 内側ラベルの表示',
  render: () => (
    <Stack gap="sm">
      <Switch onLabel="入" offLabel="切" label="有効な状態" defaultChecked />
      <Switch onLabel="可" offLabel="不可" label="利用できる状態" defaultChecked />
      <Text size="sm" c="dimmed">
        ツールバーでダークモードに切り替え、選択時の内側ラベルを確認できます。
      </Text>
    </Stack>
  ),
};
