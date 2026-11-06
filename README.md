# @efoo/ui

efoo-team/ui は、どの操作者が AI エージェントに指示しても、efoo のサービスの画面が最初から質が高く、その品質が保たれるための土台です。theme と表示例は良い既定値であり、サービスの目的に合わせて上書きしてよいものです。上書きの方法は[「サービスごとに調整する」](#サービスごとに調整する)を見てください。

efoo のサービスで共有する Mantine theme と、その theme を使った部品の表示例（Storybook）をまとめるリポジトリです。画面の部品は Mantine を使い、shadcn/ui の見た目に合わせた色、CSS 変数、部品ごとのスタイルを theme で提供します。

表示例は [GitHub Pages](https://efoo-team.github.io/ui/) で確認できます。上部ツールバーの「ライト」「ダーク」で表示モードを切り替えられます。

## 導入

React 19 と Mantine 9.7 系を使います。各 Mantine パッケージは同じバージョンにしてください。

### pnpm

```sh
pnpm add @efoo/ui @mantine/core@9.7.4 @mantine/hooks@9.7.4 react@19 react-dom@19
pnpm add @mantine/notifications@9.7.4 # 通知を使う場合
pnpm add @mantine/dates@9.7.4 dayjs # 日付・時刻を使う場合
pnpm add @mantine/dropzone@9.7.4 # ファイルの選択を使う場合
```

### npm

```sh
npm i @efoo/ui @mantine/core@9.7.4 @mantine/hooks@9.7.4 react@19 react-dom@19
npm i @mantine/notifications@9.7.4 # 通知を使う場合
npm i @mantine/dates@9.7.4 dayjs # 日付・時刻を使う場合
npm i @mantine/dropzone@9.7.4 # ファイルの選択を使う場合
```

### TypeScript

`moduleResolution` は `Bundler` と `NodeNext` のどちらでも使えます。`@mantine/hooks` の型が使う型を解決するため、`lib` に `ESNext` を含めてください。

## 使い方

### CSS の読み込み

CSS は次の順で読み込みます。

```ts
import '@mantine/core/styles.layer.css'; // Mantine の CSS は layer 版
import '@mantine/notifications/styles.layer.css'; // 通知を使う場合だけ
import '@mantine/dates/styles.layer.css'; // 日付・時刻を使う場合だけ
import '@mantine/dropzone/styles.layer.css'; // ファイルの選択を使う場合だけ
import '@efoo/ui/styles.css';
```

Mantine の CSS は `styles.css` ではなく `styles.layer.css` を読み込みます。パッケージの CSS は `@layer efoo` に入っており、`@layer mantine` の後に宣言されるため、層なしの `@mantine/core/styles.css` と一緒に使うと、パッケージの規則がすべて Mantine に負けて効きません。`styles.css` と `styles.layer.css` を両方読み込むこともしないでください。

パッケージの CSS は読み込み順に関係なく Mantine の CSS に勝ちます。ただし、日本語の折り返し（`:root` と `th`・`td` の `word-break`・`overflow-wrap`）と、`tabindex="-1"` の要素の focus の輪郭は、Mantine の layer の中の下位の層（`@layer mantine.efoo-base`）に入っているため、Mantine の規則より弱く、Mantine が同じ property を指定した要素では Mantine の値になります。サービス側の指定との優先順位は次のとおりです。

- Mantine の style props（`mt`・`c` など）、`style`、`styles` は、inline style か layer に入らない `<style>` として出力されるため、通常はパッケージの CSS に勝ちます。日付の前後ボタンのアイコン寸法は、Mantine の inline style に対して `!important` を使っています。
- サービス側で書く layer に入らない CSS も、パッケージの CSS に勝ちます。詳細度を気にせずに調整できます。ただし Notification の緩急は例外です。パッケージの CSS が `!important` で差し替えているため、layer に入らない CSS や、efoo より後に宣言した layer からは上書きできません。戻すには、サービスの theme で `components.Notifications.classNames.notification` を別の class に差し替えます。
- サービス側で宣言する `@layer`（Tailwind CSS v4 の `theme, base, components, utilities` など）は、パッケージの CSS より先に宣言されるとパッケージの CSS に負けます。layer の順序は最初に宣言された順で決まるためです。サービス側の layer を優先させるには、CSS の先頭で `@layer mantine, efoo, theme, base, components, utilities;` のように順序をまとめて宣言します。
- Mantine の CSS には `!important` の宣言が 20 件あります（Modal の全画面表示の角丸、AppShell の幅を変えている間の transition など）。layer に入った `!important` は layer に入らない `!important` にも勝つため、これらはサービス側の層なしの CSS では上書きできません。層なしの CSS が勝つのは、`!important` の付いていない宣言に対してだけです。

### MantineProvider

`efooTheme` と `efooCssVariablesResolver` は必ず一緒に `MantineProvider` へ渡します。

```tsx
import { MantineProvider } from '@mantine/core';
import { efooTheme, efooCssVariablesResolver } from '@efoo/ui';

export function App() {
  return (
    <MantineProvider theme={efooTheme} cssVariablesResolver={efooCssVariablesResolver}>
      {/* アプリケーション */}
    </MantineProvider>
  );
}
```

`efooCssVariablesResolver` を渡さないと、次のとおり表示が崩れたり、shadcn/ui から外れたりします。

- Tooltip の背景と文字の色が定義されず、背景が透明になる。
- グラフの系列の色に使う `--efoo-chart-1`〜`--efoo-chart-5` が定義されず、それを `series` の `color` に渡した系列に色が付かない。
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
- 入力欄・Checkbox・Radio・Chip と outline の Button の枠が、背景に対して 3:1 に届かない薄い線（ライトは `zinc-200`、ダークは白 10%）になる。
- ダークで `gray` の `variant="light"`（Badge など）の面がほぼ黒になり、Card の上で沈む。
- AppShell の navbar の面が page と同じ色になる。
- ダークの `red` の塗りつぶしが `red-8`（`#9f0712`）になり、Card の上で沈む。
- ダークの Tabs の pills で、選択中のタブの面が帯より暗くなる。
- ライトの Skeleton が `gray-3` になり、shadcn/ui より濃くなる。
- ダークの Skeleton が白 10% になり、Card の上ではほとんど見えない。
- 通知（`@mantine/notifications`）の出入りの緩急が `ease` になる。

### ライトとダークの決め方

`MantineProvider` の `defaultColorScheme` は `'light'` が既定です。何も渡さないと、保存された値が無い限りライトで表示され、ダークは使われません。サービスごとに次の 3 点を決めて、`MantineProvider` に渡します。

- ダークを持つか。持つ場合は、利用者の OS の設定に従う `'auto'` を出発点にします。ダークを持たないサービスは、何も渡さずライトのままにします。
- 利用者に切り替えさせて保存するか。切り替えさせない場合は、`forceColorScheme` に `'light'` か `'dark'` を渡して固定します。このとき保存された値、`defaultColorScheme`、`setColorScheme` は無視されます。切り替えさせる場合は、画面に `useMantineColorScheme()` の `setColorScheme`・`toggleColorScheme`・`clearColorScheme` を呼ぶ操作を置きます。`useMantineColorScheme()` の `colorScheme` は `'auto'` を含み、実際に表示している `'light'` か `'dark'` は `useComputedColorScheme('light')` で得られます。
- 保存先を localStorage にするか、cookie にするか。サーバー側で描画（SSR）し、初回の HTML から正しい色にしたい場合は cookie にします。

どれを選んだかで、efoo-team/skills の screen-design skill の撮影 tool（`shoot.mjs`）がライトとダークを切り替える経路が変わります。`'auto'` なら color scheme のエミュレーションが、localStorage に保存する場合は localStorage の `mantine-color-scheme-value` が効きます。cookie に保存する場合は、`--init-script` で cookie を書く JavaScript を渡す必要があります。

localStorage に保存する場合は、`MantineProvider` に `defaultColorScheme` を渡します。保存先は localStorage の `mantine-color-scheme-value` で、`localStorageColorSchemeManager({ key })` で変えられます（Mantine の公式ドキュメントは既定のキーを `mantine-color-scheme` と書いていますが、実装の既定値は `mantine-color-scheme-value` です）。キーを変えたときは、`ColorSchemeScript` の `localStorageKey` も同じ値にします。

Next.js の App Router では、`<html>` に `mantineHtmlProps` を展開し、`<head>` に `ColorSchemeScript` を置きます。`ColorSchemeScript` は hydration の前に `<html data-mantine-color-scheme>` を書き、初回の描画のちらつきを防ぎます（[Mantine の Next.js ガイド](https://mantine.dev/guides/next/)）。`ColorSchemeScript` にも `MantineProvider` と同じ `defaultColorScheme` を渡します。

```tsx
// app/layout.tsx
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { efooTheme, efooCssVariablesResolver } from '@efoo/ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider
          theme={efooTheme}
          cssVariablesResolver={efooCssVariablesResolver}
          defaultColorScheme="auto"
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
```

ブラウザだけで描画する SPA（Vite など）では、`ColorSchemeScript` は要りません。`MantineProvider` が最初のクライアント側の描画で保存された値（無ければ `defaultColorScheme`）を読み、`<html data-mantine-color-scheme>` を描画前に書くためです。Mantine の公式ドキュメントも、`ColorSchemeScript` は SSR で誤った配色が一瞬出るのを避けるためのものとし、Vite のような client-only の構成では hydration が無いと書いています。Mantine の Vite テンプレート（`mantinedev/vite-template`）も `ColorSchemeScript` を使っていません。

cookie などに保存する場合は、`MantineColorSchemeManager`（`get(defaultValue)`・`set(value)`・`subscribe(onUpdate)`・`unsubscribe()`・`clear()`）を実装し、`colorSchemeManager` に渡します。`get` は、サーバー側（`window` が無い環境）では `defaultValue` を返します。

```tsx
import { MantineProvider, type MantineColorSchemeManager } from '@mantine/core';
import { efooTheme, efooCssVariablesResolver } from '@efoo/ui';

const COOKIE_NAME = 'color-scheme';

const cookieColorSchemeManager: MantineColorSchemeManager = {
  get: (defaultValue) => {
    if (typeof document === 'undefined') return defaultValue;
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=(light|dark|auto)`));
    return (match?.[1] as 'light' | 'dark' | 'auto' | undefined) ?? defaultValue;
  },
  set: (value) => {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; samesite=lax`;
  },
  subscribe: () => {},
  unsubscribe: () => {},
  clear: () => {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  },
};

export function App() {
  return (
    <MantineProvider
      theme={efooTheme}
      cssVariablesResolver={efooCssVariablesResolver}
      defaultColorScheme="auto"
      colorSchemeManager={cookieColorSchemeManager}
    >
      {/* アプリケーション */}
    </MantineProvider>
  );
}
```

`ColorSchemeScript` は localStorage だけを読み、cookie は読みません。SSR で初回の HTML から正しい色にするには、サーバーで cookie の値を読み、`<html data-mantine-color-scheme>` にその値を出力します（Mantine の実装からの推論で、公式の手順ではありません。`'auto'` はそのまま出力せず、`'light'` か `'dark'` を出力してください）。この手順を入れた構成は、サービスごとに表示を確かめてください。

### 日付・時刻の日本語設定

日付・時刻を使う場合は、アプリケーションで日本語ロケールを読み込みます。

```ts
import 'dayjs/locale/ja';
```

DateInput の既定の `YYYY/MM/DD` は `efooDateParser` が厳密に解析します。`valueFormat` を変更する場合は、それに対応する `dateParser` も指定してください。

### 日本語の折り返し

パッケージの CSS は、ページの根元（`:root`）に `word-break: auto-phrase` と `overflow-wrap: break-word` を指定し、すべての要素に継承させています。見出し・ボタン・ラベル・説明文の日本語は、「まとめ／て」「くださ／い」のような語の途中ではなく、文節の切れ目で次の行へ送られます。

表のセル（`th`・`td`）では、両方をブラウザーの既定（`normal`）に戻し、セルの中の要素にも継承させています。表の列の幅は、金額やコードのように途中で折り返さない値に合わせて決まり、セルの日本語は文節に関係なく行の端で折り返します。

この指定は、ブラウザーが内容の言語を日本語と分かるときにだけ働きます。`<html lang="ja">` を必ず書いてください。`lang` が無いか `en` のままだと、語の途中で折り返します。対応しているのは Chrome と Edge（119 以降）で、Safari と Firefox は指定を無視し、文字の単位で折り返します。

文節の切れ目は Chrome が機械学習で判定するため、意図と違う位置で折り返すことがあります。折り返してよい位置を足すには `<wbr>` を、折り返させない位置には U+2060（WORD JOINER）を置きます。数字と単位の間の半角スペース（`7 日`）は常に折り返せる位置になるため、数字と単位を離したくないときは `&nbsp;` にします。`overflow-wrap: break-word` も継承させているので、1 つの文節が 1 行より長いときは、文節の中で折り返します。英字の長い語や URL も同じです。

幅を中身から決める場所（Group などのフレックスの行、`align="flex-start"` の Stack、grid の `auto` の列）では、要素の幅は、その要素で最も長い文節の幅より狭くなりません。カタカナの長い社名のように、1 つの文節がその要素に使える幅より長くなりうる要素では、はみ出します（`wrap="nowrap"` でない Group でも、その要素が 1 行を占めて足りなければはみ出します）。そういう要素には、サービスが `overflow-wrap: anywhere` を指定してください。行の幅が足りないとき、その要素は文節の中で折り返して縮みます。theme が `anywhere` を既定にしないのは、隣の長い文と一緒に短いラベルや金額まで 1 文字の幅まで縮み、行に余裕があっても途中で折れるためです。`word-break` と `overflow-wrap` は継承されるので、その要素にも、その要素を囲む入れ物にも指定できます。入れ物に指定すると、中のすべての要素に効きます。ただし、Mantine は入力欄のラベル・説明・エラーに `overflow-wrap: break-word` を直接指定しているので、入れ物の指定はそれらには届きません。それらには、その要素に指定します。

### サービスごとに調整する

部品に Mantine をそのまま使うと、状態・フォーカス・キーボード操作・読み上げの品質を、Mantine の部品から得られます。見た目の上書きをサービスの `createTheme` の 1 か所にまとめると、サービスの中の統一が保たれます。theme で表せない表現（LP のヒーローの構図など）は、サービス側に置いてかまいません。

theme の差分は `createTheme` で書き、`mergeThemeOverrides` で `efooTheme` に重ねます。次の例の `primaryColor` と `defaultRadius` は差分の一例なので、サービスで変えたい項目だけを書いてください。

```tsx
import { createTheme, mergeThemeOverrides } from '@mantine/core';
import { efooTheme } from '@efoo/ui';

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
import { efooCssVariablesResolver } from '@efoo/ui';

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

theme は、次の prop に日本語の aria-label を入れた既定値を持っています。サービスでこれらの prop を渡すと既定値ごと置き換わるため、aria-label（Pagination の `…` は `aria-hidden`）も含めて渡してください。

- Pagination の `getControlProps`・`attributes`。
- Select・MultiSelect・TagsInput・Autocomplete・DateInput・DatePickerInput・MonthPickerInput・YearPickerInput・DateTimePicker の `clearButtonProps`。
- DateTimePicker の `submitButtonProps`。
- PasswordInput の `visibilityToggleButtonProps`。
- 日付・時刻の部品（Calendar・DatePicker・DateInput など）の `ariaLabels` と `getDayAriaLabel`。
- TimePicker の `hoursInputLabel`・`minutesInputLabel`・`secondsInputLabel`。

theme は、次の Mantine の静的な class に頼って部品を見分けています。MantineProvider の `classNamesPrefix` を変えたり、`withStaticClasses={false}` にしたりすると、これらの class が付かず、theme の指定が効きません。

- `mantine-Avatar-root`: `leftSection` に Avatar を置いた NavLink を、組織の切り替えの行（高さ 48px、rail で Avatar が 32px のアイコンの列に収まる）にします。
- `mantine-ScrollArea-viewport`・`mantine-ScrollArea-content`・`mantine-ScrollArea-scrollbar`: navbar の余白を、スクロールする領域の内側に置き、rail の縦のスクロールバーを 6px にします。
- `mantine-Card-root`: `sticky-actions` の Affix の中の Card の padding を `md` にします。
- `mantine-Anchor-root`: `sticky-actions` の Affix の中のリンクの押せる高さを確保します。

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

AppShell の navbar に NavLink を並べると、shadcn/ui の sidebar と同じ見た目になります。コード例は `stories/ScreenExamples/shared/AppFrame.tsx` です（`@efoo/ui` を入れたリポジトリでは `node_modules/@efoo/ui/stories/ScreenExamples/shared/AppFrame.tsx`）。サービスが守る規則は次のとおりで、AppFrame.tsx の実装とコメントに基づきます。

構造:

- 入れ子は NavLink の `children` に子の NavLink を渡します。左の線と字下げつきで開閉します。
- 組織の切り替えの起点は、`leftSection` に Avatar を置いた NavLink にします（高さ 48px になります）。
- 組織の切り替えの NavLink は `Menu.Target` で包み、選択肢は `Menu.RadioGroup` と `Menu.RadioItem` で組みます。
- 組織の切り替えの NavLink の `aria-label` には「組織を切り替える（現在：組織名）」のように、操作と現在の組織を入れます。
- 画面を移る項目は `component="a"` のリンクにし、サービスでは router の Link を `component` に渡します。
- 子を開くだけの項目は `component="button"` にします。
- 今いる画面の項目には `active` と `aria-current="page"` を渡します。
- navbar の中は、上から組織の切り替え・リンク・設定を `AppShell.Section` に分け、リンクの Section を `grow component={ScrollArea}` にします。
- navbar に `p` を渡しません（渡すと theme の余白より優先され、開閉でアイコンの位置がずれます）。
- 見出しなど NavLink 以外の文字は、rail のときに描きません。

アイコンだけの帯（rail）:

- rail にするときは、`navbar.width` に 48 を渡し、`AppShell.Navbar` に `mod={{ rail }}`（`data-rail` が付く）を渡します。
- 開いた帯と rail で、同じ NavLink を使い続けます（作り直すと畳む最初のフレームで子の行が消えます）。
- rail ではアイコンしか見えないので、NavLink に `aria-label` で名前を渡し、Tooltip で名前を示します（Mantine の Tooltip は名前を付けません）。
- 件数の Badge は rail で theme が隠すので、件数は `aria-label` と Tooltip の文に「受注（未対応 3 件）」のように含め、Badge には `aria-hidden` を付けます。
- 子を持つ NavLink の開閉は `opened` と `onChange` で持ちます（クリック・Enter・Space のどれも `onChange` に届きます）。
- rail のときの `onChange` は、サイドバーを広げてその項目の子を開く処理に置き換えます（shadcn/ui の sidebar-07 と同じ）。
- 子を持つ NavLink の `aria-expanded` は、rail のとき false にします（rail では子が見えません）。
- rail のときは、今いる画面を子に持つ項目に `active` を渡して現在地を示します。
- Menu を開く項目（組織の切り替え）は、`Menu` の中に `Tooltip`、その中に `Menu.Target` と NavLink を置きます（Tooltip を `Menu.Target` の内側に置くと aria 属性が Tooltip に付き、`target` で別に置くと focus で Tooltip が出ません）。
- Menu の開閉を `opened` で持ち、開いている間は Tooltip を `disabled` にします。
- 子を持つ NavLink は `Menu.Target` にしません（子の開閉と Menu の開閉が 1 つのボタンで干渉します）。

狭い幅（Drawer）:

- 狭い幅では、広い幅と同じ navbar の中身を Drawer に入れて開き、AppShell の navbar は `collapsed: { mobile: true }` で隠します。
- Drawer には `variant="sidebar"` を渡します（theme が navbar と同じ面の色 `--efoo-color-sidebar`、内側の余白 8px、shadcn/ui のモバイルのサイドバーと同じ幅 18rem を付けます）。
- Drawer の `padding` と `size` は、渡すと theme の値より優先されます。
- navbar の部品（組織の切り替え・項目・設定）は `Drawer.Body` の直下に置きます（theme が navbar の Section どうしと同じ 16px の間隔で縦に並べます）。
- Drawer の中の navbar の上段には、組織の切り替えと並べて `Drawer.CloseButton` を置き、`aria-label` に「サイドバーを閉じる」を渡します。
- Drawer を開く Burger には、`aria-haspopup="dialog"` と `aria-expanded` を渡します。
- Drawer は、リンクを押した時点ではなく、location が変わった時点（`useLocation`）で閉じます（移動を止められたときに開いたままにするためです）。
- 保存していない変更がある画面からの移動は、リンクの click handler で止めず、画面が router の blocker（React Router の `useBlocker`。data router か framework mode が要ります）で止めます。
- blocker の確認は `blocker.state` が `"blocked"` の間に出し、「移動」が選ばれたら `blocker.proceed()`、「残る」が選ばれたら `blocker.reset()` を呼びます（AppFrame の `onBeforeNavigate` は、リンクがどこにも移らない Storybook でこの blocker の代わりを務める prop で、サービスは写しません）。
- 確認の Modal と Drawer は、Escape で両方とも閉じます（それぞれが window の Escape を聞くためです。1 つの `Modal.Stack` の中の Modal どうし、1 つの `Drawer.Stack` の中の Drawer どうしだけが 1 回の Escape を共有し、Modal と Drawer は同じ stack に入りません）。
- Drawer と Modal に `overlayProps` の一部（`backgroundOpacity` など）だけを渡すと、theme の `overlayProps` の既定値はまるごと置き換わります。それでも、Drawer・Modal は受け取った値を Overlay の部品に渡し、その部品が渡されていない値（`blur` など）を theme の DrawerOverlay・ModalOverlay の既定値から補うので、背景のぼかしは残ります。

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

画面の下に固定する操作の欄（保存の欄など）は、Affix の variant `sticky-actions` で作ります。`<Affix variant="sticky-actions" withinPortal={false} pos="sticky" position={{ bottom: 0 }}><Card>…</Card></Affix>` の形で、本文の背景色の帯、下の余白（`md`）、中の Card の padding（`md`）、中のリンクの押せる高さは theme が持ちます。Card に `padding` を渡すと、theme の余白より優先されます。重なり順は、Affix に `zIndex` を渡すとその値になり、渡さないときは、`sticky-actions` の Affix が `app` の 1 つ下、variant の無い Affix が Mantine の既定（`modal` と同じ 200）です。

Badge の既定は `variant="light"` です。`color` を指定しない Badge は shadcn/ui の secondary（muted の面に本文の色の文字）、状態色の Badge は色の 10% の面に色の文字になります。塗りつぶしにする場合は `variant="filled"` を指定します。

グラフの系列の色は、CSS 変数 `--efoo-chart-1`〜`--efoo-chart-5` を使います。`--efoo-chart-1` は primary の無彩色（shadcn/ui の dashboard-01 の chart と同じ）で、2〜5 は青の濃淡です（ライトは 500〜800 番台、ダークは 300〜600 番台。どれも背景に対して 3:1 以上）。`@mantine/charts` では `series` の `color` に `var(--efoo-chart-1)` のように渡します。grid・tooltip・曲線の形は theme が既定を持つので、chart 側で指定する必要はありません。

## 表示例

部品ごとの表示例は、[公開 Storybook](https://efoo-team.github.io/ui/) のサイドバーで「日本語名（Mantine の部品名）」から探せます。サイドバーの検索欄に Mantine の部品名（例: `Radio`）を入れても見つかります。部品とサイドバーの場所の対応表は、Storybook の「はじめに」にあります。

### 画面の例を探す

画面の型（一覧、詳細、作成と編集のフォーム、設定、最初の空の状態、権限が無いとき、ダッシュボード、サインイン）ごとの画面例を、Storybook の「画面例」に置いています。どの型にどの画面例を使うかは、索引 `SCREEN-EXAMPLES.md` に 1 型 1 行の表でまとめています。列は「画面の型」「こういう画面に使う」「story の id」「ソースのパス」「主な判断（1 行）」です。

- `@efoo/ui` を入れたリポジトリでは、`node_modules/@efoo/ui/SCREEN-EXAMPLES.md` を読みます。入っている版の画面例と一致します。ソースは `node_modules/@efoo/ui/stories/ScreenExamples/` に同梱しています。
- `@efoo/ui` をまだ入れていない段階（土台を選ぶ段階）では、`https://raw.githubusercontent.com/efoo-team/ui/main/SCREEN-EXAMPLES.md` を読みます。
- 見た目は、[公開 Storybook](https://efoo-team.github.io/ui/) の「画面例」で見られます。

各画面例の説明文（Storybook の Docs）には、その画面をそう作った理由として「目的と読み手」「情報構造」「データパターン」「情報の流れ」「主役」「抑えたもの・使わなかったもの」「目的が違えば変わるところ」の 7 項目を書いています。画面例は、見た目をそのまま写すためのものではありません。どの操作者が AI エージェントに指示しても画面が最初から質が高く、その品質が保たれるように、判断の理由を読んで、作るサービスの目的に合わせて考え方を写すためのものです。

## 開発

Node.js 22 と pnpm を使います。`pnpm install` で依存関係を入れた後、`pnpm storybook` で開発サーバーを起動します。変更を入れる前に、`pnpm typecheck`・`pnpm lint`・`pnpm format:check`・`pnpm build-storybook` が通ることを確認してください。Mantine を更新したときは、`pnpm storybook` で起動したローカルの Storybook を、撮影 tool（`shoot.mjs`）に `--storybook http://localhost:6006/` を付けて撮り、ライトとダークの表示を確認します。

`fix:` や `feat:` などのコミットを main に push すると、CI が変更内容に応じた版を決めて npm に公開します。

## ライセンス

このリポジトリは MIT License で提供します。著作権表記と許諾条件は [LICENSE](./LICENSE) を参照してください。

theme の色、CSS 変数の約束、部品ごとのスタイルの一部は、MantineHub の shadcn theme（[RubixCube-Innovations/mantine-theme-builder](https://github.com/RubixCube-Innovations/mantine-theme-builder)、MIT License）を元にしています。出典と許諾条件は [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) を参照してください。
