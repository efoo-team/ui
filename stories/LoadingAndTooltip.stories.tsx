import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Button, Group, Skeleton, Stack, Text, Tooltip } from '@mantine/core';

const meta = {
  title: '表示 / 読み込み表示とツールチップ（Skeleton, Tooltip）',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkeletonStates: Story = {
  name: '読み込み中の表示',
  parameters: {
    docs: {
      description: {
        story: 'データの読み込み中に使う文章、画像、カードのプレースホルダーです。',
      },
    },
  },
  render: () => (
    <Stack maw={420}>
      <Skeleton height={12} radius="xl" />
      <Skeleton height={12} radius="xl" width="80%" />
      <Group align="flex-start" wrap="nowrap">
        <Skeleton circle height={48} />
        <Stack gap="xs" style={{ flex: 1 }}>
          <Skeleton height={12} radius="xl" />
          <Skeleton height={12} radius="xl" width="70%" />
        </Stack>
      </Group>
      <Skeleton height={120} radius="md" />
      <Skeleton height={72} radius="md" animate={false} />
      <Text size="sm" c="dimmed">
        読み込み中に表示するプレースホルダーです。
      </Text>
    </Stack>
  ),
};

export const TooltipStates: Story = {
  name: '補足説明の表示',
  parameters: {
    docs: {
      description: {
        story: '操作の補足を表示する Tooltip と、表示位置・表示までの時間を確認できます。',
      },
    },
  },
  render: () => (
    <Group>
      <Tooltip label="補足の説明" withArrow>
        <Button>ホバーまたはフォーカス</Button>
      </Tooltip>
      <Tooltip label="操作できません" withArrow>
        <Button variant="outline" disabled>
          無効なボタン
        </Button>
      </Tooltip>
      <Tooltip label="遅れて表示" openDelay={600} position="bottom">
        <Button variant="subtle">表示位置と遅延</Button>
      </Tooltip>
    </Group>
  ),
};

export const TooltipOpened: Story = {
  name: '表示中の補足説明',
  parameters: {
    docs: {
      description: {
        story: '補足説明を表示した状態で、面・文字・矢印の見た目を確認できます。',
      },
    },
  },
  render: () => (
    <Box pos="relative" h={80}>
      <Tooltip opened withinPortal={false} label="補足の説明" withArrow position="bottom">
        <Button variant="outline">対象のボタン</Button>
      </Tooltip>
    </Box>
  ),
};
