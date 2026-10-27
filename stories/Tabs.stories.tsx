import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Tabs, Text } from '@mantine/core';

const meta = {
  title: '操作 / タブ（Tabs）',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndOrientation: Story = {
  name: '表示方法・向き・操作',
  parameters: {
    docs: {
      description: {
        story: '下線型、選択中を塗り分ける表示、縦向きのタブとキーボード操作を確認できます。',
      },
    },
  },
  render: () => (
    <Stack gap="xl">
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">概要</Tabs.Tab>
          <Tabs.Tab value="activity">履歴</Tabs.Tab>
          <Tabs.Tab value="settings" disabled>
            設定
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview" pt="md">
          概要の内容を表示します。
        </Tabs.Panel>
        <Tabs.Panel value="activity" pt="md">
          履歴の内容を表示します。
        </Tabs.Panel>
      </Tabs>
      <Tabs defaultValue="first" variant="pills">
        <Tabs.List>
          <Tabs.Tab value="first">すべて</Tabs.Tab>
          <Tabs.Tab value="second">未対応</Tabs.Tab>
          <Tabs.Tab value="third">完了</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Tabs defaultValue="left" orientation="vertical" variant="outline" h={150}>
        <Tabs.List>
          <Tabs.Tab value="left">左のタブ</Tabs.Tab>
          <Tabs.Tab value="right">右のタブ</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="left" p="md">
          <Text>縦向きのタブです。</Text>
        </Tabs.Panel>
        <Tabs.Panel value="right" p="md">
          <Text>別の内容です。</Text>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  ),
};
