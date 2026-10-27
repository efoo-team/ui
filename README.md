# @efoo-team/ui

efoo のサービスで共有する Mantine theme と、その設定を使った部品の表示例をまとめるリポジトリです。Mantine の部品を使い、共通の色、CSS 変数、部品ごとのスタイルを theme で提供します。

## 使い方

Mantine のスタイルを読み込み、共通 theme と CSS 変数 resolver を `MantineProvider` に渡します。

```tsx
import { MantineProvider } from '@mantine/core';
import { efooTheme, efooCssVariablesResolver } from '@efoo-team/ui';
import '@mantine/core/styles.css';
import '@efoo-team/ui/styles.css';

export function App() {
  return (
    <MantineProvider theme={efooTheme} cssVariablesResolver={efooCssVariablesResolver}>
      {/* アプリケーション */}
    </MantineProvider>
  );
}
```

各サービスは `createTheme` と `mergeThemeOverrides` を使い、必要な値を `efooTheme` に重ねて調整できます。

## 表示例

ライト・ダークの表示切り替えと各部品の stories は [GitHub Pages](https://efoo-team.github.io/ui/) で確認できます。

## 開発

Node.js 22 と pnpm を使います。`pnpm install` で依存関係を入れた後、`pnpm storybook` で開発サーバーを起動します。

## ライセンス

このリポジトリは MIT License で提供します。著作権表記と許諾条件は [LICENSE](./LICENSE) を参照してください。
