/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import { efooTheme, efooCssVariablesResolver } from '../src';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    colorScheme: {
      description: '色の表示モード',
      toolbar: {
        title: '表示モード',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'ライト' },
          { value: 'dark', title: 'ダーク' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: 'light',
  },
  decorators: [
    (Story, context) => {
      const colorScheme = context.globals.colorScheme === 'dark' ? 'dark' : 'light';

      return (
        <MantineProvider
          theme={efooTheme}
          cssVariablesResolver={efooCssVariablesResolver}
          forceColorScheme={colorScheme}
        >
          <Notifications position="top-right" />
          <div className="storybook-canvas">
            <Story />
          </div>
        </MantineProvider>
      );
    },
  ],
  parameters: {
    controls: { expanded: true },
    docs: { toc: true },
  },
};

export default preview;
