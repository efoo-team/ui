import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell, Button, Group, NavLink, Stack, Text, Title } from '@mantine/core';

const meta = {
  title: '構造 / AppShell・NavLink',
  component: AppShell,
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppShellExample: Story = {
  name: 'AppShell / ヘッダーとナビゲーション',
  render: () => (
    <AppShell
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
        <NavLink label="ダッシュボード" active />
        <NavLink label="項目一覧" description="登録済みの項目" />
        <NavLink label="設定" disabled />
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
  name: 'NavLink / 状態',
  render: () => (
    <Stack maw={320}>
      <NavLink label="選択中のページ" active description="現在表示しています" />
      <NavLink label="通常のページ" description="補足情報を表示" />
      <NavLink label="子項目を開く" defaultOpened>
        <NavLink label="子項目 A" />
        <NavLink label="子項目 B" />
      </NavLink>
      <NavLink label="利用できません" disabled />
    </Stack>
  ),
};
