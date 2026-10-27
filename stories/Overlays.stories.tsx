import type { Meta, StoryObj } from '@storybook/react-vite';
import { useDisclosure } from '@mantine/hooks';
import { Button, Drawer, Group, Menu, Modal, Popover, Stack, Text } from '@mantine/core';

const meta = {
  title: '表示 / Menu・Popover・Modal・Drawer',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MenuExample: Story = {
  name: 'Menu / 開閉',
  render: () => (
    <Menu shadow="md" width={220}>
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
  name: 'Popover / 開閉',
  render: () => (
    <Popover width={280} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button variant="outline">Popover を開く</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text fw={600}>確認内容</Text>
          <Text size="sm">この領域に補足情報や操作を表示します。</Text>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  ),
};

export const ModalExample: Story = {
  name: 'Modal / 開閉・全画面',
  render: function ModalDemo() {
    const [opened, { open, close }] = useDisclosure(false);
    const [fullScreen, setFullScreen] = useDisclosure(false);

    return (
      <Stack align="flex-start">
        <Group>
          <Button onClick={open}>Modal を開く</Button>
          <Button variant="outline" onClick={setFullScreen.open}>
            全画面 Modal を開く
          </Button>
        </Group>
        <Modal
          opened={opened}
          onClose={close}
          title="内容を確認"
          centered
          transitionProps={{ transition: 'pop', duration: 200 }}
        >
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
        <Modal
          opened={fullScreen}
          onClose={setFullScreen.close}
          fullScreen
          title="全画面表示"
          transitionProps={{ transition: 'fade', duration: 200 }}
        >
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
  name: 'Drawer / 開閉',
  render: function DrawerDemo() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <Stack align="flex-start">
        <Group>
          <Button onClick={open}>Drawer を開く</Button>
        </Group>
        <Drawer
          opened={opened}
          onClose={close}
          title="項目の詳細"
          position="right"
          size="md"
          transitionProps={{ transition: 'pop', duration: 200 }}
        >
          <Stack>
            <Text>補足情報や編集フォームを表示します。</Text>
            <Button onClick={close}>閉じる</Button>
          </Stack>
        </Drawer>
      </Stack>
    );
  },
};
