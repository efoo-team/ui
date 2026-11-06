import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, EmptyState, SimpleGrid, Stack, Title } from '@mantine/core';
import { IconFolder, IconSearch } from '@tabler/icons-react';

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

export const InCard: Story = {
  name: 'カードの中',
  render: () => (
    <SimpleGrid cols={{ base: 1, md: 2 }} maw={960}>
      {/* Directly in a card, the card's padding is the empty state's side inset. */}
      <Card>
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
      </Card>
      {/*
       * A Card.Section reaches the card's edges, like one that holds a table; when the table has no rows the empty
       * state takes its place there and keeps its own side inset.
       */}
      <Card>
        <Title order={2} size="h4">
          受注
        </Title>
        <Card.Section withBorder mt="md">
          <EmptyState
            icon={<IconSearch />}
            title="条件に合う受注はありません"
            description="検索の言葉や条件を変えてください。"
            withIndicatorBackground
          />
        </Card.Section>
      </Card>
    </SimpleGrid>
  ),
};
