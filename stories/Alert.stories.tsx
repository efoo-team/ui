import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';

const meta = {
  title: 'フィードバック / 注意・お知らせ（Alert）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
  name: '注意・お知らせ（Alert）',
  render: () => (
    <Stack maw={480}>
      <Alert title="お知らせ" icon={<IconInfoCircle />}>
        設定を確認してください。
      </Alert>
      <Alert title="保存できませんでした" color="red" icon={<IconAlertCircle />}>
        もう一度お試しください。
      </Alert>
    </Stack>
  ),
};
