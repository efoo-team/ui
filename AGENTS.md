# 目的

efoo-team/ui は、どの操作者が AI エージェントに指示しても、efoo のサービスの画面が最初から質が高く、その品質が保たれるための土台である。
コンポーネントは Mantine 9 をそのまま使い、見た目は MantineHub 由来の shadcn/ui 風の theme をこのリポジトリで持つ。各サービスはこの theme を土台として読み込み、目的に合わせて上書きする。

# 規則

以下の規則は、このリポジトリ（theme と Storybook の見本）の作り方を定める。各サービスの画面を縛る規則ではない。

- コンポーネントは自作しない。状態・フォーカス・キーボード操作・読み上げの品質を、Mantine のコンポーネントが持っているためである。
- 見た目（色・余白・線・文字・角丸・影・動き）の既定値は theme（token、cssVariablesResolver、Styles API、CSS Modules、defaultProps）にだけ置く。1 か所を直せば、その theme を使う全サービスの品質が上がるためである。
- このリポジトリの Storybook の見本に見た目の調整を書きたくなったら、それは theme の不足である。見本側で補わず、theme を直す。サービスの画面は、目的に合わせて theme を上書きしてよい。
- Storybook の見本（コンポーネントと画面例）は theme だけで描く。story 側の CSS は配置に限る。見本は「入れればこうなる」の約束であり、AI エージェントが考え方ごと真似るお手本であるためである。
- サービスが目的に合わせて変える部分は、まずサービスの createTheme の上書きにまとめる。theme で表せない表現（LP のヒーローの構図など）はサービス側に置いてよい。上書きを 1 か所にまとめると、サービスの中の統一が保たれ、theme だけに限ると目的に合った表現が作れない場面があるためである。
- shadcn/ui は見た目の基準として参照するが、構成や中身を写さない。Mantine の設計と衝突する点は無理に合わせない。
- Storybook に社内の実データ、顧客名、未発表サービスの画面、ロゴ、有料フォントを置かない。このリポジトリが公開リポジトリであるためである。フォントはファミリー名だけ指定する。
- Mantine を更新したら、Storybook でライトとダークの表示を確認する。確認には、efoo-team/skills の screen-design skill が持つ撮影 tool（`scripts/shoot.mjs`。`npx skills add` で入れた場合は `~/.agents/skills/screen-design/scripts/shoot.mjs`）の `--target 名前=story:<story の id>` を使える。公開 Storybook の story を、ライトとダークで撮影できる。
