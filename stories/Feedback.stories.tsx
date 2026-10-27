import type { Meta, StoryObj } from '@storybook/react-vite';
import { notifications } from '@mantine/notifications';
import { Button, Group, Notification, Stack, Text } from '@mantine/core';

const meta = {
  title: 'フィードバック / 通知（Notification）',
  component: Notification,
  tags: ['autodocs'],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotificationStates: Story = {
  name: '見た目と状態',
  parameters: {
    docs: {
      description: {
        story: '通知の通常表示、注意、読み込み中、閉じる操作を比べられます。',
      },
    },
  },
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

export const NotificationStatusColors: Story = {
  name: '通知の状態色',
  parameters: {
    docs: {
      description: {
        story:
          '成功・案内・注意・エラーの通知を並べます。ツールバーでライトとダークを切り替えて、タイトルと説明文が読めることを確認できます。',
      },
    },
  },
  render: () => (
    <Stack maw={480}>
      <Notification title="保存しました" color="green">
        変更内容を保存しました。
      </Notification>
      <Notification title="お知らせ" color="blue">
        新しい機能を利用できます。
      </Notification>
      <Notification title="確認してください" color="yellow">
        入力内容に注意が必要です。
      </Notification>
      <Notification title="保存できませんでした" color="red">
        時間をおいてもう一度お試しください。
      </Notification>
    </Stack>
  ),
};

export const InteractiveNotifications: Story = {
  name: '通知を表示',
  parameters: {
    docs: {
      description: {
        story: 'ボタンを押すと成功または注意の通知が画面右上に表示されます。',
      },
    },
  },
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
