/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import { useEffect, useState, type ComponentProps } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import { efooTheme, efooCssVariablesResolver } from '../src';
import './preview.css';

// The docs page is rendered outside the story decorators, so it follows the toolbar through the globals event.
// Docs pages without a story (MDX only) are mounted again after every globals change, so the last value is kept
// outside the component, and the iframe URL (which carries `globals=colorScheme:dark`) gives the value on first load.
let lastColorScheme: string | undefined;

function readColorScheme(context: ComponentProps<typeof DocsContainer>['context']) {
  try {
    return context.getStoryContext(context.storyById()).globals.colorScheme as string | undefined;
  } catch {
    const fromUrl = new URLSearchParams(window.location.search).get('globals');
    return (
      lastColorScheme ??
      fromUrl
        ?.split(';')
        .find((entry) => entry.startsWith('colorScheme:'))
        ?.slice('colorScheme:'.length)
    );
  }
}

function ThemedDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  const { context } = props;
  const [colorScheme, setColorScheme] = useState(() => readColorScheme(context));

  useEffect(() => {
    const onGlobalsUpdated = ({ userGlobals }: { userGlobals?: Record<string, unknown> }) => {
      lastColorScheme = userGlobals?.colorScheme as string | undefined;
      setColorScheme(lastColorScheme);
    };
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context]);

  return <DocsContainer {...props} theme={colorScheme === 'dark' ? themes.dark : themes.light} />;
}

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
    docs: { toc: true, container: ThemedDocsContainer },
    options: {
      storySort: {
        order: [
          'はじめに',
          '構造',
          '操作',
          ['ボタン（Button）', 'タブ（Tabs）'],
          '入力',
          [
            'テキスト入力欄（TextInput, Textarea, NumberInput, PasswordInput）',
            '選択欄（Select, MultiSelect）',
            'チェック・選択・切り替え（Checkbox, Radio, Switch）',
            'フォーカスの見え方（Button, TextInput, Checkbox, Radio, Switch, Tabs）',
          ],
          '表示',
          [
            '表・カード・バッジ（Table, Card, Badge）',
            '読み込み表示とツールチップ（Skeleton, Tooltip）',
          ],
          '重ねて表示',
          'フィードバック',
          '動き',
        ],
      },
    },
  },
};

export default preview;
