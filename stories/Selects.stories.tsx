import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, MultiSelect, Select, Stack } from '@mantine/core';

const options = [
  { value: 'alpha', label: 'サンプル項目 A' },
  { value: 'beta', label: 'サンプル項目 B' },
  { value: 'gamma', label: 'サンプル項目 C' },
];

const meta = {
  title: '入力 / 選択欄（Select, MultiSelect）',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndStates: Story = {
  name: '選択欄の状態',
  parameters: {
    docs: {
      description: {
        story: 'Select と MultiSelect の選択、検索、エラー、無効、大きさを比べられます。',
      },
    },
  },
  render: () => (
    <Stack maw={440} gap="xl">
      <Select
        label="必須の項目"
        placeholder="選択してください"
        data={options}
        searchable
        clearable
        required
        withAsterisk
        description="一覧から 1 つ選びます。"
      />
      <Select label="塗りつぶし" placeholder="選択してください" data={options} variant="filled" />
      <Select label="小さい入力欄" placeholder="選択してください" data={options} size="xs" />
      <Select label="大きい入力欄" placeholder="選択してください" data={options} size="lg" />
      <Select label="入力エラー" data={options} error="項目を選択してください" />
      <Select label="変更できません" data={options} defaultValue="alpha" disabled />
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

export const SelectOpened: Story = {
  name: '候補を開いた状態',
  parameters: {
    docs: {
      description: {
        story: '候補の一覧を開いた状態で、選択中の候補・無効な候補・hover の見た目を確認できます。',
      },
    },
  },
  render: () => (
    <Box pos="relative" maw={440} h={220}>
      <Select
        label="選択欄"
        data={[...options, { value: 'delta', label: '選べない項目', disabled: true }]}
        defaultValue="beta"
        defaultDropdownOpened
        comboboxProps={{
          withinPortal: false,
          hideDetached: false,
          middlewares: { flip: false, shift: false },
        }}
      />
    </Box>
  ),
};
