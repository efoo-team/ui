import { useId, type ReactNode } from 'react';
import { Card, Group, Stack, Text, Title, type CardProps } from '@mantine/core';

/*
 * A Card that holds one part of a page under its own heading: an h2 in the h5 size, an optional dimmed line under it,
 * and optional controls at the top right that act on the part (a period switch, a button that adds to it). The Card is
 * a section named by its heading, so a screen reader can list and jump to the parts of the page. Every card on the
 * screens that has a heading is built with it, so the heading is made one way.
 */
export function SectionCard({
  title,
  description,
  actions,
  children,
  ...others
}: Omit<CardProps, 'title'> & {
  title: string;
  /** One line on what the part holds or how it works. Leave it out when the title says enough. */
  description?: string;
  /** Controls for the part, at the right of the heading; they go under it when the card is too narrow. */
  actions?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <Card component="section" aria-labelledby={titleId} {...others}>
      <Group justify="space-between" align="flex-start" mb="md">
        <Stack gap={4}>
          <Title order={2} size="h5" id={titleId}>
            {title}
          </Title>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
        {actions}
      </Group>
      {children}
    </Card>
  );
}
