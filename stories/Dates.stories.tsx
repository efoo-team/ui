import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mantine/core';
import { DateInput, DatePicker, DateTimePicker, TimeInput } from '@mantine/dates';

const meta = {
  title: '入力 / 日付と時刻（DateInput, DateTimePicker, TimeInput）',
  component: DateInput,
  tags: ['autodocs'],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inputs: Story = {
  name: '日付と時刻',
  render: () => (
    <Stack maw={360} gap="md">
      <DateInput label="日付" placeholder="日付を選択" clearable />
      <DateTimePicker label="日時" placeholder="日時を選択" clearable />
      <TimeInput label="時刻" />
    </Stack>
  ),
};

export const Calendar: Story = {
  name: 'カレンダー',
  render: () => <DatePicker defaultValue="2026-10-15" defaultDate="2026-10-01" />,
};
