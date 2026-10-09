# profile

銀次 / Ginji のプロフィールページ。https://ginji001.github.io/profile/

- `site/index.html` … ページ本体（1ファイル。表示内容もここで編集）
- `site/contributions.json` … GitHubの草のデータ。GitHub Actionsが毎日作り直す
- `scripts/contributions.mjs` … 公開プロフィールから草を取得するスクリプト（トークン不要）
- `.github/workflows/deploy.yml` … 草の更新と GitHub Pages への公開（毎日 0:17 JST、push 時、手動実行）

サーバーは使わず、公開リポジトリの標準ランナーで動くため無料。
