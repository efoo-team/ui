import type { TextVariant } from '@mantine/core';

/*
 * Text variants for emphasis that is not a heading, styled in styles/text.module.css:
 * metric is a figure such as a dashboard value, emphasis a short label such as a service name.
 */
export type EfooTextVariant = TextVariant | 'metric' | 'emphasis';

// Mantine already accepts any string here; naming the variants makes editors suggest them, and (string & {}) keeps
// the services' own variants valid.
declare module '@mantine/core' {
  export interface TextProps {
    variant?: EfooTextVariant | (string & {});
  }
}
