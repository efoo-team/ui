import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Group, Skeleton, Stack, Text, Tooltip } from '@mantine/core';

const meta = {
  title: '表示 / Skeleton・Tooltip',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkeletonStates: Story = {
  name: 'Skeleton / 読み込み中',
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
  name: 'Tooltip / 表示',
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
