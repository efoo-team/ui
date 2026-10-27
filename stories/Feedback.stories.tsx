import type { Meta, StoryObj } from '@storybook/react-vite';
import { notifications } from '@mantine/notifications';
import { Button, Group, Notification, Stack, Text } from '@mantine/core';

const meta = {
  title: 'フィードバック / Notification',
  component: Notification,
  tags: ['autodocs'],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotificationStates: Story = {
  name: '見た目と状態',
  render: () => (
    <Stack maw={480}>
      <Notification title="保存しました">変更内容を保存しました。</Notification>
      <Notification title="確認してください" color="yellow">
        入力内容に注意が必要です。
      </Notification>
      <Notification title="読み込み中" loading>
        データを取得しています。
      </Notification>
      <Notification title="通知を閉じる" withCloseButton>
        閉じるボタン付きの通知です。
      </Notification>
    </Stack>
  ),
};

export const InteractiveNotifications: Story = {
  name: '操作 / 通知を表示',
  render: () => (
    <Stack align="flex-start">
      <Text>ボタンを押して通知の表示を確認します。</Text>
      <Group>
        <Button
          onClick={() =>
            notifications.show({
              title: '保存しました',
              message: '変更内容を保存しました。',
              color: 'green',
            })
          }
        >
          成功を表示
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            notifications.show({
              title: '確認してください',
              message: '入力内容に注意が必要です。',
              color: 'yellow',
            })
          }
        >
          注意を表示
        </Button>
      </Group>
    </Stack>
  ),
};
