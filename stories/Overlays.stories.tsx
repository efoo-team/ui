import type { Meta, StoryObj } from '@storybook/react-vite';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Button,
  Drawer,
  Group,
  Menu,
  Modal,
  Paper,
  Popover,
  Stack,
  Text,
  Title,
} from '@mantine/core';

const meta = {
  title: '重ねて表示 / メニュー・モーダルほか（Menu, Popover, Modal, Drawer）',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '押して開くメニュー、補足表示（Popover）、モーダル、側面パネルの開閉例です。開いた状態の見た目は「開いた〜」の story で確認できます。開閉の動きは theme の既定値で、story では指定していません。',
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'>;

export const MenuExample: Story = {
  name: 'メニューの開閉',
  parameters: {
    docs: {
      description: {
        story: 'ボタンでメニューを開き、項目を選択できます。',
      },
    },
  },
  render: () => (
    <Menu width={220}>
      <Menu.Target>
        <Button>メニューを開く</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>操作</Menu.Label>
        <Menu.Item>詳細を見る</Menu.Item>
        <Menu.Item>名前を変更</Menu.Item>
        <Menu.Item disabled>利用できません</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red">削除</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ),
};

export const PopoverExample: Story = {
  name: '補足表示の開閉',
  parameters: {
    docs: {
      description: {
        story:
          'ボタンで開く補足表示の位置と矢印を確認できます。内側にフォーカスが移るので、Escape で閉じて、フォーカスがボタンに戻ります。',
      },
    },
  },
  render: () => (
    <Popover width={280} position="bottom" withArrow trapFocus returnFocus>
      <Popover.Target>
        <Button variant="outline">補足表示を開く</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Title order={5}>確認内容</Title>
          <Text size="sm">この領域に補足情報や操作を表示します。</Text>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  ),
};

export const ModalExample: Story = {
  name: 'モーダルの開閉',
  parameters: {
    docs: {
      description: {
        story: '通常のモーダルと全画面表示をボタンで開閉できます。',
      },
    },
  },
  render: function ModalDemo() {
    const [opened, { open, close }] = useDisclosure(false);
    const [fullScreen, setFullScreen] = useDisclosure(false);

    return (
      <Stack align="flex-start">
        <Group>
          <Button onClick={open}>モーダルを開く</Button>
          <Button variant="outline" onClick={setFullScreen.open}>
            全画面のモーダルを開く
          </Button>
        </Group>
        <Modal opened={opened} onClose={close} title="内容を確認" centered>
          <Stack>
            <Text>保存前に入力内容を確認してください。</Text>
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>
                戻る
              </Button>
              <Button onClick={close}>確認しました</Button>
            </Group>
          </Stack>
        </Modal>
        <Modal opened={fullScreen} onClose={setFullScreen.close} fullScreen title="全画面表示">
          <Stack>
            <Text>全画面で表示したときの余白と境界線を確認できます。</Text>
            <Button onClick={setFullScreen.close}>閉じる</Button>
          </Stack>
        </Modal>
      </Stack>
    );
  },
};

export const DrawerExample: Story = {
  name: '側面パネルの開閉',
  parameters: {
    docs: {
      description: {
        story: '右側から開く詳細パネルを確認できます。',
      },
    },
  },
  render: function DrawerDemo() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <Stack align="flex-start">
        <Group>
          <Button onClick={open}>側面パネルを開く</Button>
        </Group>
        <Drawer opened={opened} onClose={close} title="項目の詳細" position="right">
          <Stack>
            <Text>補足情報や編集フォームを表示します。</Text>
            <Button onClick={close}>閉じる</Button>
          </Stack>
        </Drawer>
      </Stack>
    );
  },
};

export const MenuOpenedPreview: Story = {
  name: '開いたメニュー',
  parameters: {
    docs: {
      description: {
        story: 'メニューを開いた状態で、項目の hover・無効・削除の見た目を確認できます。',
      },
    },
  },
  render: () => (
    <Box pos="relative" h={260}>
      <Menu
        defaultOpened
        withinPortal={false}
        position="bottom-start"
        hideDetached={false}
        middlewares={{ flip: false, shift: false }}
        width={220}
      >
        <Menu.Target>
          <Button>メニュー</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>操作</Menu.Label>
          <Menu.Item>詳細を見る</Menu.Item>
          <Menu.Item>名前を変更</Menu.Item>
          <Menu.Item disabled>利用できません</Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red">削除</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  ),
};

export const PopoverOpenedPreview: Story = {
  name: '開いた補足表示',
  parameters: {
    docs: {
      description: {
        story: '補足表示を開いた状態で、面・矢印・文字の見た目を確認できます。',
      },
    },
  },
  render: () => (
    <Box pos="relative" h={200}>
      <Popover
        defaultOpened
        withinPortal={false}
        width={280}
        position="bottom-start"
        hideDetached={false}
        middlewares={{ flip: false, shift: false }}
        withArrow
      >
        <Popover.Target>
          <Button variant="outline">補足表示</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="xs">
            <Title order={5}>確認内容</Title>
            <Text size="sm">この領域に補足情報や操作を表示します。</Text>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Box>
  ),
};

export const ModalOpenedPreview: Story = {
  name: '開いたモーダル',
  parameters: {
    docs: {
      description: {
        story:
          '枠内に、モーダルを開いた状態の面・タイトル・余白を表示します（背景の overlay は出しません）。',
      },
    },
  },
  render: () => (
    <Paper withBorder pos="relative" h={280} style={{ overflow: 'hidden' }}>
      <Modal
        opened
        onClose={() => undefined}
        title="内容を確認"
        centered
        withinPortal={false}
        withOverlay={false}
        trapFocus={false}
        returnFocus={false}
        styles={{
          root: { position: 'absolute', inset: 0, zIndex: 0 },
          inner: { position: 'absolute', inset: 0, padding: 0 },
        }}
      >
        <Stack>
          <Text>保存前に入力内容を確認してください。</Text>
          <Group justify="flex-end">
            <Button variant="default">戻る</Button>
            <Button>確認しました</Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  ),
};

export const DrawerOpenedPreview: Story = {
  name: '開いた側面パネル',
  parameters: {
    docs: {
      description: {
        story:
          '枠内に、右側の側面パネルを開いた状態の面・タイトル・境界線を表示します（背景の overlay は出しません）。',
      },
    },
  },
  render: () => (
    <Paper withBorder pos="relative" h={280} style={{ overflow: 'hidden' }}>
      <Drawer
        opened
        onClose={() => undefined}
        title="項目の詳細"
        position="right"
        withinPortal={false}
        withOverlay={false}
        trapFocus={false}
        returnFocus={false}
        styles={{
          root: { position: 'absolute', inset: 0, zIndex: 0 },
          inner: { position: 'absolute', inset: 0, padding: 0 },
        }}
      >
        <Stack>
          <Text>補足情報や編集フォームを表示します。</Text>
          <Button>閉じる</Button>
        </Stack>
      </Drawer>
    </Paper>
  ),
};
