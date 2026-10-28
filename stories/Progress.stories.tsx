import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress, Stack, Title } from '@mantine/core';

const meta = {
  title: '表示 / 進捗バー（Progress）',
  component: Progress,
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'>;

export const ProgressStates: Story = {
  name: '大きさ・状態・複数区間',
  parameters: {
    docs: {
      description: {
        story:
          '割合を横棒で示します。既定は無彩色で、読み手が気づくべき意味（残りわずか、要対応など）がある区間だけに色を付けます。',
      },
    },
  },
  render: () => (
    <Stack gap="xl" maw={440}>
      <Stack gap="xs">
        <Title order={5}>標準</Title>
        <Progress value={0} aria-label="進捗 0%" />
        <Progress value={40} aria-label="進捗 40%" />
        <Progress value={100} aria-label="進捗 100%" />
      </Stack>
      <Stack gap="xs">
        <Title order={5}>サイズ</Title>
        <Progress value={60} size="xs" aria-label="進捗 60%（極小）" />
        <Progress value={60} size="sm" aria-label="進捗 60%（小）" />
        <Progress value={60} size="md" aria-label="進捗 60%（中）" />
        <Progress value={60} size="lg" aria-label="進捗 60%（大）" />
        <Progress value={60} size="xl" aria-label="進捗 60%（極大）" />
      </Stack>
      <Stack gap="xs">
        <Title order={5}>意味のある色</Title>
        <Progress value={12} color="red" aria-label="在庫の残り 12%" />
      </Stack>
      <Stack gap="xs">
        <Title order={5}>複数区間</Title>
        <Progress.Root size="lg">
          <Progress.Section value={60} aria-label="完了 60%" />
          <Progress.Section value={15} color="red" aria-label="要対応 15%" />
        </Progress.Root>
      </Stack>
    </Stack>
  ),
};
