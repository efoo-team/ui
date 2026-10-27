import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell, Button, Group, NavLink, Stack, Text, Title } from '@mantine/core';

const meta = {
  title: '構造 / 画面の枠組みとナビゲーション（AppShell・NavLink）',
  component: AppShell,
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppShellExample: Story = {
  name: 'ヘッダーとナビゲーション',
  parameters: {
    docs: {
      description: {
        story: 'ヘッダー、ナビゲーション、ページ本文を枠内に配置した例です。',
      },
    },
  },
  render: () => (
    <AppShell
      mode="static"
      header={{ height: 60 }}
      navbar={{ width: 220, breakpoint: 'sm' }}
      padding="md"
      h={520}
      withBorder
    >
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between">
          <Text fw={600}>サンプル管理画面</Text>
          <Button size="xs" variant="outline">
            ヘルプ
          </Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <NavLink component="button" type="button" label="ダッシュボード" active />
        <NavLink component="button" type="button" label="項目一覧" description="登録済みの項目" />
        <NavLink component="button" type="button" label="設定" disabled />
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack>
          <Title order={2}>ページの見出し</Title>
          <Text c="dimmed">本文やページ固有の部品をここに配置します。</Text>
        </Stack>
      </AppShell.Main>
    </AppShell>
  ),
};

export const NavLinkStates: Story = {
  name: 'ナビゲーションの状態',
  parameters: {
    docs: {
      description: {
        story: '現在のページ、通常の項目、開いた子項目、操作できない項目を確認できます。',
      },
    },
  },
  render: () => (
    <Stack maw={320} gap={4}>
      <NavLink
        component="button"
        type="button"
        label="選択中のページ"
        active
        description="現在表示しています"
      />
      <NavLink component="button" type="button" label="通常のページ" description="補足情報を表示" />
      <NavLink component="button" type="button" label="子項目を開く" defaultOpened>
        <NavLink component="button" type="button" label="子項目 A" />
        <NavLink component="button" type="button" label="子項目 B" />
      </NavLink>
      <NavLink component="button" type="button" label="利用できません" disabled />
    </Stack>
  ),
};
