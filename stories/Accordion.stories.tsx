import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '@mantine/core';

const meta = {
  title: '操作 / 折りたたみ（Accordion）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
