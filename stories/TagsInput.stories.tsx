import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagsInput } from '@mantine/core';

const meta = {
  title: '入力 / タグ入力（TagsInput）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tags: Story = {
  name: 'タグ入力（TagsInput）',
  render: () => (
    <TagsInput
      label="タグ"
      placeholder="タグを入力"
      defaultValue={['料理', 'お知らせ']}
      clearable
      maw={400}
    />
  ),
};
