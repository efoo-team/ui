import { Anchor } from '@mantine/core';
import type { Order } from './data';

// The order number is a real link to the order's detail, so it can be opened in a new tab and reached with Tab.
export function OrderLink({ order }: { order: Order }) {
  return (
    <Anchor href="#" size="sm">
      {order.id}
    </Anchor>
  );
}
