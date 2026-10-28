import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';

const meta = {
  title: '操作 / ボタン（Button）',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndSizes: Story = {
  name: '見た目・大きさ・状態',
  parameters: {
    docs: {
      description: {
        story: 'ボタンの配色、大きさ、読み込み中と操作できない状態を比べられます。',
      },
    },
  },
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={4} size="h5">
          見た目
        </Title>
        <Group>
          <Button>塗りつぶし</Button>
          <Button variant="light">薄い背景</Button>
          <Button variant="outline">枠線</Button>
          <Button variant="subtle">控えめ</Button>
          <Button variant="transparent">背景なし</Button>
        </Group>
        <Paper bg="dark.9" c="white" p="sm">
          <Group>
            <Text size="sm">濃い背景に置いた白いボタン</Text>
            <Button variant="white">白い面</Button>
          </Group>
        </Paper>
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          サイズ
        </Title>
        <Group align="center">
          <Button size="xs">極小</Button>
          <Button size="sm">小（既定）</Button>
          <Button size="md">中</Button>
          <Button size="lg">大</Button>
          <Button size="xl">極大</Button>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          状態
        </Title>
        <Group align="center">
          <Button loading aria-label="保存中">
            保存
          </Button>
          <Text size="sm" c="dimmed">
            保存しています。
          </Text>
          <Button disabled>操作できません</Button>
          <Button variant="outline" disabled>
            無効な操作
          </Button>
          <Button color="red">削除</Button>
        </Group>
      </Stack>
    </Stack>
  ),
};
