import { ActionIcon, Menu } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { ICON_SIZE } from './AppFrame';
import { isCancellable, type Order } from './data';

/*
 * The menu at the end of an order's row. It has no item that opens the order: the order number is the link to it
 * (OrderLink). An order that can no longer be cancelled shows the item disabled, so the menu keeps its shape.
 */
export function OrderMenu({ order }: { order: Order }) {
  return (
    <Menu position="bottom-end" width={160}>
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label={`${order.id}の操作`}>
          <IconDotsVertical size={ICON_SIZE} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>納品書を印刷</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" disabled={!isCancellable(order)}>
          キャンセル
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
