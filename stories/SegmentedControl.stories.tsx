import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl, Stack, Title } from '@mantine/core';

const meta = {
  title: '操作 / 切り替え（SegmentedControl）',
  component: SegmentedControl,
  tags: ['autodocs'],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'>;

const periods = [
  { value: 'week', label: '週' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
];

export const SegmentedControlStates: Story = {
  name: '大きさ・向き・状態',
  parameters: {
    docs: {
      description: {
        story:
          '同時に 1 つだけ選べる選択肢を、横一列に並べて切り替えます。大きさ、全幅、縦向き、操作できない状態を比べられます。',
      },
    },
  },
  render: () => (
    <Stack gap="xl" maw={440} align="flex-start">
      <Stack gap="xs">
        <Title order={4} size="h5">
          標準
        </Title>
        <SegmentedControl data={periods} defaultValue="month" aria-label="表示する期間" />
      </Stack>
      <Stack gap="xs" w="100%">
        <Title order={4} size="h5">
          幅いっぱい
        </Title>
        <SegmentedControl data={periods} defaultValue="week" fullWidth aria-label="表示する期間" />
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          サイズ
        </Title>
        <SegmentedControl data={periods} defaultValue="month" size="xs" aria-label="期間（極小）" />
        <SegmentedControl data={periods} defaultValue="month" size="sm" aria-label="期間（小）" />
        <SegmentedControl data={periods} defaultValue="month" size="md" aria-label="期間（中）" />
        <SegmentedControl data={periods} defaultValue="month" size="lg" aria-label="期間（大）" />
        <SegmentedControl data={periods} defaultValue="month" size="xl" aria-label="期間（極大）" />
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          縦向き
        </Title>
        <SegmentedControl
          data={periods}
          defaultValue="month"
          orientation="vertical"
          aria-label="表示する期間"
        />
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          操作できない状態
        </Title>
        <SegmentedControl data={periods} defaultValue="month" disabled aria-label="表示する期間" />
        <SegmentedControl
          data={[
            { value: 'week', label: '週' },
            { value: 'month', label: '月' },
            { value: 'year', label: '年', disabled: true },
          ]}
          defaultValue="week"
          aria-label="表示する期間"
        />
      </Stack>
    </Stack>
  ),
};
