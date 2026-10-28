# @efoo-team/ui

efoo のサービスで共有する Mantine theme と、その theme を使った部品の表示例（Storybook）をまとめるリポジトリです。画面の部品は Mantine を使い、shadcn/ui の見た目に合わせた色、CSS 変数、部品ごとのスタイルを theme で提供します。

表示例は [GitHub Pages](https://efoo-team.github.io/ui/) で確認できます。上部ツールバーの「ライト」「ダーク」で表示モードを切り替えられます。

## 導入

このパッケージは npm レジストリには置かず、GitHub から導入します。導入時に `prepare` が JavaScript、型定義、CSS を build します。

利用側に必要なパッケージは React と React DOM 19、`@mantine/core` と `@mantine/hooks` の 9.7 系です。通知（`@mantine/notifications`）を使う場合だけ追加します。

### pnpm

pnpm 10 以降は、Git 依存の build を許可制にしています。先に利用側の `pnpm-workspace.yaml` へ許可を書きます。

```yaml
allowBuilds:
  '@efoo-team/ui@git+https://github.com/efoo-team/ui.git': true
```

許可がないと `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` で導入が止まります。エラーに追加すべき行が表示されるので、キーが上の行と違う場合は表示された行を使ってください。

```sh
pnpm add github:efoo-team/ui @mantine/core @mantine/hooks react react-dom
pnpm add @mantine/notifications # 通知を使う場合
```

### npm

追加の設定は要りません。

```sh
npm i github:efoo-team/ui @mantine/core @mantine/hooks react react-dom
npm i @mantine/notifications # 通知を使う場合
```

### TypeScript

`moduleResolution` は `Bundler` と `NodeNext` のどちらでも使えます。`@mantine/hooks` の型が使う型を解決するため、`lib` に `ESNext` を含めてください。

## 使い方

### CSS の読み込み

CSS は次の順で読み込みます。

```ts
import '@mantine/core/styles.layer.css'; // Mantine の CSS は layer 版
import '@mantine/notifications/styles.layer.css'; // 通知を使う場合だけ
import '@efoo-team/ui/styles.css';
```

Mantine の CSS は `styles.css` ではなく `styles.layer.css` を読み込みます。パッケージの CSS は `@layer efoo` に入っており、`@layer mantine` の後に宣言されるため、層なしの `@mantine/core/styles.css` と一緒に使うと、パッケージの規則がすべて Mantine に負けて効きません。`styles.css` と `styles.layer.css` を両方読み込むこともしないでください。

パッケージの CSS は読み込み順に関係なく Mantine の CSS に勝ちます。サービス側の指定との優先順位は次のとおりです。

- Mantine の style props（`mt`・`c` など）、`style`、`styles` は、inline style か layer に入らない `<style>` として出力されるため、パッケージの CSS に常に勝ちます。
- サービス側で書く layer に入らない CSS も、パッケージの CSS に勝ちます。詳細度を気にせずに調整できます。ただし Notification の緩急は例外です。パッケージの CSS が `!important` で差し替えているため、layer に入らない CSS や、efoo より後に宣言した layer からは上書きできません。戻すには、サービスの theme で `components.Notifications.classNames.notification` を別の class に差し替えます。
- サービス側で宣言する `@layer`（Tailwind CSS v4 の `theme, base, components, utilities` など）は、パッケージの CSS より先に宣言されるとパッケージの CSS に負けます。layer の順序は最初に宣言された順で決まるためです。サービス側の layer を優先させるには、CSS の先頭で `@layer mantine, efoo, theme, base, components, utilities;` のように順序をまとめて宣言します。
- Mantine の CSS には `!important` の宣言が 20 件あります（Modal の全画面表示の角丸、AppShell の幅を変えている間の transition など）。layer に入った `!important` は layer に入らない `!important` にも勝つため、これらはサービス側の層なしの CSS では上書きできません。層なしの CSS が勝つのは、`!important` の付いていない宣言に対してだけです。

### MantineProvider

`efooTheme` と `efooCssVariablesResolver` は必ず一緒に `MantineProvider` へ渡します。

```tsx
import { MantineProvider } from '@mantine/core';
import { efooTheme, efooCssVariablesResolver } from '@efoo-team/ui';

export function App() {
  return (
    <MantineProvider theme={efooTheme} cssVariablesResolver={efooCssVariablesResolver}>
      {/* アプリケーション */}
    </MantineProvider>
  );
}
```

`efooCssVariablesResolver` を渡さなくても表示は崩れませんが、次の点が shadcn/ui から外れます。

- ダークで primary の zinc が反転せず、暗い塗りに白文字のままになる。
- ダークのエラー色が `red-8`（`#9f0712`）になり読みにくい。
- focus の輪郭が primary の色になる。
- リンク（Anchor）の文字色が本文の色にならず、zinc の灰色になる。
- パッケージの CSS の transition が 0 秒になる。
- ライトの Tabs の pills で、選択していないタブの文字が `gray-6` になり、帯の上で薄くなる。
- ライトの削除用の Button と Menu の赤い項目が `red-7`（`#c10007`）になり、エラー表示の `red-6`（`#e7000b`）と赤が 2 種類になる。
- `yellow` の塗りつぶしがライトで 700 番台、ダークで 800 番台の茶色になり、ダークの `green`・`blue` も 800 番台で沈む。塗りつぶしの文字の白黒も塗りの色と合わなくなる。
- `red`・`yellow`・`green`・`blue` の `variant="light"` の背景が色の 10%（ダークは 20%）の透過にならず、ライトは 100 番台の不透明な面、文字は 900 番台になる。
- ダークで `red`・`yellow`・`green`・`blue` の `variant="light"`（Badge・Alert など）の文字がほぼ白になり、状態の色が文字に出ない。
- ダークの入力欄の枠が白 15% にならず、白 10% のままになる。
- ダークで `gray` の `variant="light"`（Badge など）の面がほぼ黒になり、Card の上で沈む。
- AppShell の navbar の面が page と同じ色になる。
- ダークの `red` の塗りつぶしが `red-8`（`#9f0712`）になり、Card の上で沈む。
- ダークの Tabs の pills で、選択中のタブの面が帯より暗くなる。
- ライトの Skeleton が `gray-3` になり、shadcn/ui より濃くなる。
- ダークの Skeleton が白 10% になり、Card の上ではほとんど見えない。
- 通知（`@mantine/notifications`）の出入りの緩急が `ease` になる。

### サービスごとに調整する

theme の差分は `createTheme` で書き、`mergeThemeOverrides` で `efooTheme` に重ねます。次の例の `primaryColor` と `defaultRadius` は差分の一例なので、サービスで変えたい項目だけを書いてください。

```tsx
import { createTheme, mergeThemeOverrides } from '@mantine/core';
import { efooTheme } from '@efoo-team/ui';

// サービスで変えたい項目だけを書く（以下は一例）
const serviceOverrides = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export const serviceTheme = mergeThemeOverrides(efooTheme, serviceOverrides);
```

`primaryColor` を `zinc` 以外にすると、resolver は `--mantine-primary-color-contrast` を上書きしません。塗りつぶしの文字色は Mantine の既定で決まります。`red`・`yellow`・`green`・`blue` を `primaryColor` にした場合、その色の塗りつぶしは resolver の既定の shade ではなく `primaryShade` に従います。

サービス独自の CSS 変数 resolver を持つ場合は、`efooCssVariablesResolver` の結果に `deepMerge` でサービスの値を重ねて 1 つの resolver にします。

```tsx
import { deepMerge, type CSSVariablesResolver } from '@mantine/core';
import { efooCssVariablesResolver } from '@efoo-team/ui';

const serviceCssVariablesResolver: CSSVariablesResolver = () => ({
  variables: { '--service-header-height': '3rem' },
  light: { '--service-accent': '#18181b' },
  dark: { '--service-accent': '#fafafa' },
});

export const cssVariablesResolver: CSSVariablesResolver = (theme) =>
  deepMerge(efooCssVariablesResolver(theme), serviceCssVariablesResolver(theme));
```

```tsx
<MantineProvider theme={serviceTheme} cssVariablesResolver={cssVariablesResolver}>
```

独自の `variantColorResolver` を持つ場合は、`efooVariantColorResolver(input)` の結果を起点に差分を足します。

Pagination の `getControlProps`・`attributes` と、Select・MultiSelect・TagsInput・Autocomplete の `clearButtonProps` は、theme が日本語の aria-label を入れた既定値を持っており、サービスでこれらの prop を渡すと既定値ごと置き換わるため、aria-label（Pagination の `…` は `aria-hidden`）も含めて渡してください。

### 動き

theme の `respectReducedMotion` が `true` です。OS の「視差効果を減らす」を有効にすると、Mantine の Transition とパッケージの CSS の transition が同時に止まります。

通知（`@mantine/notifications`）は、Mantine が inline style で書く行き過ぎのある緩急を、パッケージの CSS が `!important` で `--efoo-motion-easing` に置き換えます。移動量（通知の幅の分）と時間は Mantine の既定のままです。Mantine の緩急に戻す場合は、サービスの theme で `components.Notifications.classNames.notification` を別の class に差し替えます。

### Popover

Popover の中で操作させる場合は、Escape で閉じられるように `trapFocus` を付けます。theme の既定にしていないのは、Popover を内部で使う Select などの dropdown が入力欄からフォーカスを奪うためです。

```tsx
<Popover trapFocus returnFocus>
  <Popover.Target>
    <Button>開く</Button>
  </Popover.Target>
  <Popover.Dropdown>{/* 内容 */}</Popover.Dropdown>
</Popover>
```

### サイドメニュー

AppShell の navbar に NavLink を並べると、shadcn/ui の sidebar と同じ見た目になります。入れ子は NavLink の `children` に子の NavLink を渡すと、左の線と字下げつきで開閉します。`leftSection` に Avatar を置いた NavLink は組織の切り替えの起点（高さ 48px）になるので、`Menu.Target` で包みます。

アイコンだけの帯（rail）にするときは、`navbar.width` に 48 を渡し、`AppShell.Navbar` に `mod={{ rail }}`（`data-rail` が付く）を渡します。navbar の余白は theme が持つので、`p` は渡しません（渡すと theme の余白より優先され、開閉でアイコンの位置がずれます）。navbar の中は、上から組織の切り替え・リンク・設定を `AppShell.Section` に分け、リンクの Section を `grow component={ScrollArea}` にします。theme は余白をスクロールする領域の内側（各 Section と ScrollArea の中身）に置くので、focus の輪郭が切れません。theme は navbar の幅に合わせて NavLink を帯の中央の 32px のアイコンに畳みます。名前と説明は右端で切れていき、畳み終わると隠れます。chevron や Badge を置いた右の section と子の項目は畳み始めに隠れ、子の項目は畳み終わってから行から抜けるので、下の項目は畳み終わるまで動きません。広げるときは、子の項目の行が最初に戻り、右の section と子の項目は広げ終わると現れます。rail ではアイコンしか見えないので、NavLink には `aria-label` で名前を渡し、Tooltip で名前を示します（Mantine の Tooltip は名前を付けません）。子を持つ項目は、rail では子が見えないので、`Menu` で子を開きます。Tooltip は `Menu.Target` の外側に置きます（内側に置くと Menu の aria 属性が NavLink に届きません）。見出しなど NavLink 以外の文字は、rail のときに描かないようにしてください。

```tsx
const [rail, setRail] = useState(false);

<AppShell navbar={{ width: rail ? 48 : 256, breakpoint: 'sm' }}>
  <AppShell.Navbar mod={{ rail }}>
    <AppShell.Section>
      <Menu position={rail ? 'right-start' : 'bottom-start'}>
        <Menu.Target>
          <NavLink
            component="button"
            label="組織名"
            description="プラン"
            aria-label="組織を切り替える（現在：組織名）"
            leftSection={
              <Avatar radius="md" color="zinc" variant="filled">
                A
              </Avatar>
            }
            rightSection={<IconSelector size={16} />}
          />
        </Menu.Target>
        <Menu.Dropdown>{/* 組織の一覧 */}</Menu.Dropdown>
      </Menu>
    </AppShell.Section>
    <AppShell.Section grow component={ScrollArea}>
      <Tooltip label="ダッシュボード" position="right" disabled={!rail}>
        <NavLink
          label="ダッシュボード"
          aria-label="ダッシュボード"
          leftSection={<IconHome size={16} />}
        />
      </Tooltip>

      {rail ? (
        <Menu position="right-start">
          <Tooltip label="設定" position="right">
            <Menu.Target>
              <NavLink
                component="button"
                label="設定"
                aria-label="設定"
                leftSection={<IconSettings size={16} />}
              />
            </Menu.Target>
          </Tooltip>
          <Menu.Dropdown>
            <Menu.Item>全般</Menu.Item>
            <Menu.Item>通知</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <NavLink label="設定" leftSection={<IconSettings size={16} />} defaultOpened>
          <NavLink label="全般" active />
          <NavLink label="通知" />
        </NavLink>
      )}
    </AppShell.Section>
  </AppShell.Navbar>
</AppShell>;
```

組織の切り替えの起点は Mantine の静的な class（`mantine-Avatar-root`）で見分けるので、MantineProvider の `classNamesPrefix` を変えたり、`withStaticClasses={false}` にしたりすると、48px の行になりません。

### shadcn/ui の variant との対応

| shadcn/ui の variant | Mantine での指定           |
| -------------------- | -------------------------- |
| default              | 既定（`variant="filled"`） |
| outline              | `variant="default"`        |
| secondary            | `variant="light"`          |
| ghost                | `variant="subtle"`         |
| destructive          | `color="red"` の塗りつぶし |

状態を表す色は `red`・`yellow`・`green`・`blue` です（Tailwind CSS v4 の値）。

見出しではないが目立たせたい文字は、Text の variant で選びます。ダッシュボードの数値などは `<Text variant="metric">`（30/36・600・桁をそろえる数字）、サービス名や名前など短く強調する文字は `<Text variant="emphasis">`（その文字の大きさのまま 600）で、どちらも `size` を渡せばその大きさになります。

パッケージは Text の `variant` の型に `metric`・`emphasis` を足しています（`declare module '@mantine/core'` で `TextProps.variant` を広げる形）。サービスでも `TextProps.variant` を独自の型で広げると TypeScript が TS2717 を出すので、独自の variant は文字列のまま渡してください（型は任意の文字列を受け付けます）。

Badge の既定は `variant="light"` です。`color` を指定しない Badge は shadcn/ui の secondary（muted の面に本文の色の文字）、状態色の Badge は色の 10% の面に色の文字になります。塗りつぶしにする場合は `variant="filled"` を指定します。

グラフの系列の色は、CSS 変数 `--efoo-chart-1`〜`--efoo-chart-5` を使います。`--efoo-chart-1` は primary の無彩色（shadcn/ui の dashboard-01 の chart と同じ）で、2〜5 は青の濃淡です（ライトは 500〜800 番台、ダークは 300〜600 番台。どれも背景に対して 3:1 以上）。`@mantine/charts` では `series` の `color` に `var(--efoo-chart-1)` のように渡します。grid・tooltip・曲線の形は theme が既定を持つので、chart 側で指定する必要はありません。

## 表示例

部品ごとの表示例は、Storybook のサイドバーで「日本語名（Mantine の部品名）」から探せます。サイドバーの検索欄に Mantine の部品名（例: `Radio`）を入れても見つかります。

| 部品                                             | サイドバーの場所                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| AppShell・NavLink                                | 構造 / 画面の枠組みとナビゲーション（AppShell, NavLink）                      |
| Button                                           | 操作 / ボタン（Button）                                                       |
| Tabs                                             | 操作 / タブ（Tabs）                                                           |
| ActionIcon                                       | 操作 / アイコンボタン（ActionIcon）                                           |
| SegmentedControl                                 | 操作 / 切り替え（SegmentedControl）                                           |
| Pagination                                       | 操作 / ページ送り（Pagination）                                               |
| TextInput・Textarea・NumberInput・PasswordInput  | 入力 / テキスト入力欄（TextInput, Textarea, NumberInput, PasswordInput）      |
| Select・MultiSelect                              | 入力 / 選択欄（Select, MultiSelect）                                          |
| Checkbox・Radio・Switch                          | 入力 / チェック・選択・切り替え（Checkbox, Radio, Switch）                    |
| Button・TextInput・Checkbox・Radio・Switch・Tabs | 入力 / フォーカスの見え方（Button, TextInput, Checkbox, Radio, Switch, Tabs） |
| Table・Card・Badge                               | 表示 / 表・カード・バッジ（Table, Card, Badge）                               |
| Avatar                                           | 表示 / アバター（Avatar）                                                     |
| Progress                                         | 表示 / 進捗バー（Progress）                                                   |
| Skeleton・Tooltip                                | 表示 / 読み込み表示とツールチップ（Skeleton, Tooltip）                        |
| Menu・Popover・Modal・Drawer                     | 重ねて表示 / メニュー・モーダルほか（Menu, Popover, Modal, Drawer）           |
| Notification                                     | フィードバック / 通知（Notification）                                         |
| 開閉の動き                                       | 動き / 開閉の動き（Transition）                                               |

## 開発

Node.js 22 と pnpm を使います。`pnpm install` で依存関係を入れた後、`pnpm storybook` で開発サーバーを起動します。変更を入れる前に、`pnpm typecheck`・`pnpm lint`・`pnpm format:check`・`pnpm build-storybook` が通ることを確認してください。Mantine を更新したときは、Storybook でライトとダークの表示を確認します。

## ライセンス

このリポジトリは MIT License で提供します。著作権表記と許諾条件は [LICENSE](./LICENSE) を参照してください。

theme の色、CSS 変数の約束、部品ごとのスタイルの一部は、MantineHub の shadcn theme（[RubixCube-Innovations/mantine-theme-builder](https://github.com/RubixCube-Innovations/mantine-theme-builder)、MIT License）を元にしています。出典と許諾条件は [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) を参照してください。
