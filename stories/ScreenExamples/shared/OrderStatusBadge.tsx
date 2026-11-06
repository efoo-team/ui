import { Badge } from '@mantine/core';
import { ATTENTION_COLOR } from './constants';
import { ORDER_STATUS, type OrderStatus } from './data';

// Only a state that asks the user to act takes the attention color; the others are outlined.
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, attention } = ORDER_STATUS[status];
  return attention ? (
    <Badge color={ATTENTION_COLOR}>{label}</Badge>
  ) : (
    <Badge variant="outline">{label}</Badge>
  );
}
