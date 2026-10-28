import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  Alert,
  Button,
  Center,
  Chip,
  DataList,
  EmptyState,
  Group,
  Loader,
  RangeSlider,
  Slider,
  Stack,
  TagsInput,
  Text,
  Timeline,
} from '@mantine/core';
import { IconAlertCircle, IconFolder, IconInfoCircle } from '@tabler/icons-react';

const meta = {
  title: '表示 / 汎用コンポーネント',
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

export const Sliders: Story = {
  name: 'スライダー（Slider）',
  render: () => (
    <Stack gap="xl" maw={400}>
      <Slider defaultValue={40} thumbLabel="位置" />
      <RangeSlider
        defaultValue={[20, 70]}
        minRange={5}
        thumbFromLabel="開始位置"
        thumbToLabel="終了位置"
      />
      <Slider defaultValue={50} disabled thumbLabel="位置" />
    </Stack>
  ),
};

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

export const Details: Story = {
  name: '定義の並び（DataList）',
  render: () => (
    <DataList withDivider maw={480}>
      <DataList.Item>
        <DataList.ItemLabel>公開範囲</DataList.ItemLabel>
        <DataList.ItemValue>公開</DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>作成日</DataList.ItemLabel>
        <DataList.ItemValue>2026年10月28日</DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>状態</DataList.ItemLabel>
        <DataList.ItemValue>完了</DataList.ItemValue>
      </DataList.Item>
    </DataList>
  ),
};

export const Alerts: Story = {
  name: '注意・お知らせ（Alert）',
  render: () => (
    <Stack maw={480}>
      <Alert title="お知らせ" icon={<IconInfoCircle />}>
        設定を確認してください。
      </Alert>
      <Alert title="保存できませんでした" color="red" icon={<IconAlertCircle />}>
        もう一度お試しください。
      </Alert>
    </Stack>
  ),
};

export const Chips: Story = {
  name: '選択肢（Chip）',
  render: () => (
    <Chip.Group multiple defaultValue={['a']}>
      <Group>
        <Chip value="a">項目 A</Chip>
        <Chip value="b">項目 B</Chip>
        <Chip value="c" disabled>
          項目 C
        </Chip>
      </Group>
    </Chip.Group>
  ),
};

export const History: Story = {
  name: '履歴（Timeline）',
  render: () => (
    <Timeline active={1} bulletSize={24} maw={400}>
      <Timeline.Item title="作成">
        <Text size="sm" c="dimmed">
          項目を作成しました。
        </Text>
      </Timeline.Item>
      <Timeline.Item title="確認">
        <Text size="sm" c="dimmed">
          内容を確認しています。
        </Text>
      </Timeline.Item>
      <Timeline.Item title="完了">
        <Text size="sm" c="dimmed">
          完了を待っています。
        </Text>
      </Timeline.Item>
    </Timeline>
  ),
};

export const Disclosure: Story = {
  name: '折りたたみ（Accordion）',
  render: () => (
    <Accordion defaultValue="a" maw={480}>
      <Accordion.Item value="a">
        <Accordion.Control>項目 A</Accordion.Control>
        <Accordion.Panel>項目 A の内容です。</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Control>項目 B</Accordion.Control>
        <Accordion.Panel>項目 B の内容です。</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Tags: Story = {
  name: 'タグ入力（TagsInput）',
  render: () => (
    <TagsInput
      label="タグ"
      placeholder="タグを入力"
      defaultValue={['料理', 'お知らせ']}
      clearable
      maw={400}
    />
  ),
};
