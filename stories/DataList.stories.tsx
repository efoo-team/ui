import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataList } from '@mantine/core';

const meta = {
  title: '表示 / 定義の並び（DataList）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
