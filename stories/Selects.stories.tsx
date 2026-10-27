import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultiSelect, Select, Stack } from '@mantine/core';

const options = [
  { value: 'alpha', label: 'サンプル項目 A' },
  { value: 'beta', label: 'サンプル項目 B' },
  { value: 'gamma', label: 'サンプル項目 C' },
];

const meta = {
  title: '入力 / 選択欄',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndStates: Story = {
  render: () => (
    <Stack maw={440} gap="xl">
      <Select label="項目" placeholder="選択してください" data={options} searchable clearable />
      <Select label="塗りつぶし" placeholder="選択してください" data={options} variant="filled" />
      <Select label="小さい入力欄" placeholder="選択してください" data={options} size="xs" />
      <Select label="大きい入力欄" placeholder="選択してください" data={options} size="lg" />
      <Select label="入力エラー" data={options} error="項目を選択してください" />
      <Select label="変更できません" data={options} defaultValue="alpha" disabled />
      <Select label="大きい入力欄" data={options} size="lg" placeholder="選択してください" />
      <MultiSelect
        label="複数選択"
        placeholder="項目を追加"
        data={options}
        defaultValue={['alpha', 'gamma']}
        searchable
        clearable
      />
      <MultiSelect label="塗りつぶし" data={options} variant="filled" placeholder="項目を追加" />
      <MultiSelect label="大きい入力欄" data={options} size="lg" placeholder="項目を追加" />
      <MultiSelect label="入力エラー" data={options} error="項目を選択してください" />
      <MultiSelect label="変更できません" data={options} defaultValue={['beta']} disabled />
    </Stack>
  ),
};
