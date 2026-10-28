import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, Stack, Title } from '@mantine/core';

const meta = {
  title: '操作 / ページ送り（Pagination）',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'>;

export const PaginationStates: Story = {
  name: '大きさ・端のボタン・状態',
  parameters: {
    docs: {
      description: {
        story:
          '一覧のページ送りです。ページ数が多いときの省略表示、先頭・末尾へ移動するボタン、大きさ、操作できない状態を比べられます。',
      },
    },
  },
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={4} size="h5">
          標準
        </Title>
        <Pagination total={5} defaultValue={2} />
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          ページ数が多い場合
        </Title>
        <Pagination total={24} defaultValue={10} />
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          先頭・末尾へ移動するボタン付き
        </Title>
        <Pagination total={24} defaultValue={10} withEdges />
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          サイズ
        </Title>
        <Pagination total={5} defaultValue={1} size="xs" />
        <Pagination total={5} defaultValue={1} size="sm" />
        <Pagination total={5} defaultValue={1} size="md" />
        <Pagination total={5} defaultValue={1} size="lg" />
        <Pagination total={5} defaultValue={1} size="xl" />
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          操作できない状態
        </Title>
        <Pagination total={5} defaultValue={2} disabled />
      </Stack>
    </Stack>
  ),
};
