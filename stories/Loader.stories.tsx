import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Center, Group, Loader, Stack } from '@mantine/core';

const meta = {
  title: 'フィードバック / 読み込み中（Loader）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  name: '読み込み中（Loader）',
  render: () => (
    <Stack maw={400}>
      <Group>
        <Button loading>保存中</Button>
        <Button loading variant="outline">
          読み込み中
        </Button>
      </Group>
      <Center h={120}>
        <Loader aria-label="読み込み中" />
      </Center>
    </Stack>
  ),
};
