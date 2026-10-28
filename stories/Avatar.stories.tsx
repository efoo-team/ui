import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Group, Stack, Title } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

const meta = {
  title: '表示 / アバター（Avatar）',
  component: Avatar,
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AvatarStates: Story = {
  name: '大きさ・見た目・グループ',
  parameters: {
    docs: {
      description: {
        story:
          '画像のない人を、頭文字またはアイコンで表します。大きさ、見た目、複数人を重ねたグループを比べられます。',
      },
    },
  },
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={4} size="h5">
          サイズ
        </Title>
        <Group align="center">
          <Avatar size="xs">青</Avatar>
          <Avatar size="sm">青</Avatar>
          <Avatar size="md">青</Avatar>
          <Avatar size="lg">青</Avatar>
          <Avatar size="xl">青</Avatar>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          見た目
        </Title>
        <Group align="center">
          <Avatar>青</Avatar>
          <Avatar variant="filled">青</Avatar>
          <Avatar variant="outline">青</Avatar>
          <Avatar variant="default">青</Avatar>
          <Avatar variant="transparent">青</Avatar>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          頭文字とアイコン
        </Title>
        <Group align="center">
          <Avatar name="Sample User" />
          <Avatar>
            <IconUser size={18} />
          </Avatar>
          <Avatar />
        </Group>
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          グループ
        </Title>
        <Avatar.Group>
          <Avatar>青</Avatar>
          <Avatar>赤</Avatar>
          <Avatar>白</Avatar>
          <Avatar>+5</Avatar>
        </Avatar.Group>
      </Stack>
    </Stack>
  ),
};
