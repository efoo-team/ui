import { Badge } from '@mantine/core';
import { ATTENTION_COLOR } from './data';

/*
 * The mark of a product whose stock is below its reorder point, the same on every screen that shows it. The screen
 * decides when it shows (needsReorder, or the reorder point being typed on the product form); the order detail leaves
 * it out, as its description says.
 */
export function ReorderBadge() {
  return <Badge color={ATTENTION_COLOR}>要発注</Badge>;
}
