import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Group, Stack, Text } from '@mantine/core';

const meta = {
  title: '操作 / ボタン（Button）',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndSizes: Story = {
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text fw={600}>見た目</Text>
        <Group>
          <Button>塗りつぶし</Button>
          <Button variant="light">薄い背景</Button>
          <Button variant="outline">枠線</Button>
          <Button variant="subtle">控えめ</Button>
          <Button variant="transparent">背景なし</Button>
          <Button variant="white">白背景</Button>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Text fw={600}>大きさ</Text>
        <Group align="center">
          <Button size="xs">極小</Button>
          <Button size="sm">小</Button>
          <Button size="md">標準</Button>
          <Button size="lg">大</Button>
          <Button size="xl">極大</Button>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Text fw={600}>状態</Text>
        <Group>
          <Button loading>保存中</Button>
          <Button disabled>操作できません</Button>
          <Button variant="outline" disabled>
            無効な操作
          </Button>
        </Group>
      </Stack>
    </Stack>
  ),
};
