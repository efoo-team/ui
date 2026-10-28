import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, Group } from '@mantine/core';

const meta = {
  title: '入力 / チップによる選択（Chip）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chips: Story = {
  name: 'チップによる選択（Chip）',
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
