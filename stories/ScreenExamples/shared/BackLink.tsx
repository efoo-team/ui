import { Anchor, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { ICON_SIZE } from './constants';

/*
 * The header shows the page path only from the sm breakpoint, so below it a screen under a list carries its own way
 * back. It goes first in the page heading, above the title, and names the list it returns to.
 */
export function BackLink({
  to,
}: {
  /** The list the screen came from, e.g. '受注一覧'. */ to: string;
}) {
  return (
    <Anchor href="#" size="sm" hiddenFrom="sm">
      <Group gap={4} wrap="nowrap" component="span">
        <IconArrowLeft size={ICON_SIZE} />
        {to}に戻る
      </Group>
    </Anchor>
  );
}
