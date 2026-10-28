import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, EmptyState, Stack } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';

const meta = {
  title: '表示 / 空の状態（EmptyState）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: '空の状態（EmptyState）',
  render: () => (
    <Stack maw={500}>
      <EmptyState
        icon={<IconFolder />}
        title="項目がありません"
        description="項目を追加すると、ここに表示されます。"
        withIndicatorBackground
      >
        <EmptyState.Actions>
          <Button>項目を追加</Button>
        </EmptyState.Actions>
      </EmptyState>
      <EmptyState title="検索結果がありません" description="検索条件を変更してください。" />
    </Stack>
  ),
};
