import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, Timeline } from '@mantine/core';

const meta = {
  title: '表示 / 履歴（Timeline）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const History: Story = {
  name: '履歴（Timeline）',
  render: () => (
    <Timeline active={1} maw={400}>
      <Timeline.Item title="作成">
        <Text size="sm" c="dimmed">
          項目を作成しました。
        </Text>
      </Timeline.Item>
      <Timeline.Item title="確認">
        <Text size="sm" c="dimmed">
          内容を確認しています。
        </Text>
      </Timeline.Item>
      <Timeline.Item title="完了">
        <Text size="sm" c="dimmed">
          完了を待っています。
        </Text>
      </Timeline.Item>
    </Timeline>
  ),
};
