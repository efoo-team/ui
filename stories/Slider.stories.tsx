import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangeSlider, Slider, Stack } from '@mantine/core';

const meta = {
  title: '入力 / スライダー（Slider, RangeSlider）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
