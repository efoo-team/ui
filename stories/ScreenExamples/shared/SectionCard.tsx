import { useId, type ReactNode } from 'react';
import { Card, Stack, Text, Title } from '@mantine/core';

/*
 * A Card that holds one part of a page under its own heading, set like the dashboard's cards: an h2 in the h5 size and
 * an optional dimmed line under it. The Card is a section named by its heading, so a screen reader can list and jump
 * to the parts of the page.
 */
export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  /** One line on what the part holds or how it works. Leave it out when the title says enough. */
  description?: string;
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <Card component="section" aria-labelledby={titleId}>
      <Stack gap={4} mb="md">
        <Title order={2} size="h5" id={titleId}>
          {title}
        </Title>
        {description && (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        )}
      </Stack>
      {children}
    </Card>
  );
}
