import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useDisclosure } from '@mantine/hooks';
import {
  Button,
  Drawer,
  Group,
  Menu,
  Modal,
  Popover,
  Select,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';

const meta = {
  title: '動き / 開閉の動き（Transition）',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '開閉の動きは theme が決めます。この画面の部品は `transitionProps` を指定していないので、サービスで theme を使ったときと同じ動きを確認できます。OS の「視差効果を減らす」を有効にすると、動きは止まります。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const tokens = [
  { name: '--efoo-motion-duration-fast', use: 'Button・Tabs・NavLink・入力欄の色の変化' },
  { name: '--efoo-motion-duration-overlay', use: 'Menu・Popover・Select・Modal・Tooltip の開閉' },
  { name: '--efoo-motion-duration-standard', use: 'Drawer の開閉' },
  { name: '--efoo-motion-easing', use: 'すべての動きの緩急' },
  { name: '--efoo-motion-scale', use: '0 にすると動きを止める倍率（視差効果を減らす設定で 0）' },
];

export const MotionTokens: Story = {
  name: '動きの値',
  parameters: {
    docs: {
      description: {
        story: 'theme が出力する動きの CSS 変数を、いま画面に効いている値で表示します。',
      },
    },
  },
  render: function MotionTokensTable() {
    const ref = useRef<HTMLTableElement>(null);
    const [values, setValues] = useState<Record<string, string>>({});

    useEffect(() => {
      const element = ref.current;
      if (!element) return;
      const style = getComputedStyle(element);
      setValues(
        Object.fromEntries(tokens.map(({ name }) => [name, style.getPropertyValue(name).trim()])),
      );
    }, []);

    return (
      <Table ref={ref} withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>CSS 変数</Table.Th>
            <Table.Th>値</Table.Th>
            <Table.Th>使われる場所</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tokens.map(({ name, use }) => (
            <Table.Tr key={name}>
              <Table.Td>
                <code>{name}</code>
              </Table.Td>
              <Table.Td>{values[name] ?? ''}</Table.Td>
              <Table.Td>{use}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  },
};

export const OpenAndClose: Story = {
  name: '開閉を試す',
  parameters: {
    docs: {
      description: {
        story:
          'それぞれの部品を開閉して、縮小から拡大しながら現れる動き（Drawer は横から滑り込む動き）を確認できます。通知の動きは Mantine の内部で固定されており、theme では変えられません。',
      },
    },
  },
  render: function OpenAndCloseDemo() {
    const [modal, modalHandlers] = useDisclosure(false);
    const [drawer, drawerHandlers] = useDisclosure(false);

    return (
      <Stack align="flex-start" gap="lg">
        <Group>
          <Menu width={200}>
            <Menu.Target>
              <Button>メニュー</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>詳細を見る</Menu.Item>
              <Menu.Item>名前を変更</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Popover width={240} withArrow trapFocus returnFocus>
            <Popover.Target>
              <Button variant="outline">補足表示</Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm">補足情報をここに表示します。</Text>
            </Popover.Dropdown>
          </Popover>
          <Tooltip label="補足の説明" withArrow>
            <Button variant="subtle">ツールチップ</Button>
          </Tooltip>
          <Button variant="default" onClick={modalHandlers.open}>
            モーダル
          </Button>
          <Button variant="default" onClick={drawerHandlers.open}>
            側面パネル
          </Button>
        </Group>
        <Select
          label="選択欄"
          placeholder="選択してください"
          data={['サンプル項目 A', 'サンプル項目 B', 'サンプル項目 C']}
          w={240}
        />
        <Modal opened={modal} onClose={modalHandlers.close} title="内容を確認">
          <Text>保存前に入力内容を確認してください。</Text>
        </Modal>
        <Drawer opened={drawer} onClose={drawerHandlers.close} title="項目の詳細" position="right">
          <Text>補足情報や編集フォームを表示します。</Text>
        </Drawer>
      </Stack>
    );
  },
};
