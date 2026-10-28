# 目的

efoo-team/ui は、AI が次々に作る efoo の社内サービスを、誰が作っても最初から洗練された同じ見た目と操作感にするための基盤である。
コンポーネントは Mantine 9 をそのまま使い、見た目は MantineHub 由来の shadcn/ui 風の theme をこのリポジトリで持つ。各サービスはこの theme を読み込み、Mantine のコンポーネントを既定のまま使う。

# 規則

- コンポーネントは自作しない。見た目（色・余白・線・文字・角丸・影・動き）は theme（token、cssVariablesResolver、Styles API、CSS Modules、defaultProps）にだけ置く。
- 画面や story に見た目の調整を書きたくなったら、それは theme の不足である。画面側で補わず、theme を直す。
- Storybook の見本（コンポーネントと画面例）は theme だけで描く。story 側の CSS は配置に限る。見本は「入れればこうなる」の約束であり、AI が真似るお手本である。
- サービス固有の違いは、各サービスの createTheme の上書きで表す。
- shadcn/ui は見た目の基準として参照するが、構成や中身を写さない。Mantine の設計と衝突する点は無理に合わせない。
- Storybook に社内の実データ、顧客名、未発表サービスの画面、ロゴ、有料フォントを置かない。フォントはファミリー名だけ指定する。
- Mantine を更新したら、Storybook でライトとダークの表示を確認する。
