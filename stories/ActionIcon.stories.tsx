import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionIcon, Group, Stack, Title } from '@mantine/core';
import { IconPlus, IconSearch, IconSettings, IconTrash } from '@tabler/icons-react';

const meta = {
  title: '操作 / アイコンボタン（ActionIcon）',
  component: ActionIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndSizes: Story = {
  name: '見た目・大きさ・状態',
  parameters: {
    docs: {
      description: {
        story:
          '文字のないボタンの見た目、大きさ、読み込み中と操作できない状態を比べられます。文字がないので、読み上げ用の名前を aria-label で必ず付けます。',
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
          <ActionIcon aria-label="追加">
            <IconPlus size={16} />
          </ActionIcon>
          <ActionIcon variant="light" aria-label="追加">
            <IconPlus size={16} />
          </ActionIcon>
          <ActionIcon variant="outline" aria-label="追加">
            <IconPlus size={16} />
          </ActionIcon>
          <ActionIcon variant="default" aria-label="追加">
            <IconPlus size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" aria-label="追加">
            <IconPlus size={16} />
          </ActionIcon>
          <ActionIcon variant="transparent" aria-label="追加">
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          サイズ
        </Title>
        <Group align="center">
          <ActionIcon variant="outline" size="xs" aria-label="検索（極小）">
            <IconSearch size={12} />
          </ActionIcon>
          <ActionIcon variant="outline" size="sm" aria-label="検索（小）">
            <IconSearch size={14} />
          </ActionIcon>
          <ActionIcon variant="outline" size="md" aria-label="検索（中）">
            <IconSearch size={16} />
          </ActionIcon>
          <ActionIcon variant="outline" size="lg" aria-label="検索（大）">
            <IconSearch size={18} />
          </ActionIcon>
          <ActionIcon variant="outline" size="xl" aria-label="検索（極大）">
            <IconSearch size={20} />
          </ActionIcon>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Title order={4} size="h5">
          状態
        </Title>
        <Group align="center">
          <ActionIcon variant="outline" loading aria-label="保存中">
            <IconSettings size={16} />
          </ActionIcon>
          <ActionIcon variant="outline" disabled aria-label="設定（操作できません）">
            <IconSettings size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" disabled aria-label="設定（操作できません）">
            <IconSettings size={16} />
          </ActionIcon>
          <ActionIcon color="red" aria-label="削除">
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Stack>
    </Stack>
  ),
};
