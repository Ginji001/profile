# 銀次 / Ginji profile

銀次 / Ginji のプロフィールサイトです。GitHub Pages で静的配信します。

このサイトは [yksr-melt/profile-page](https://github.com/yksr-melt/profile-page)（MIT）を元にしています。ライセンス表記は [LICENSE](LICENSE) を参照してください。

## 開発

Node.js 22.14.0 を使います。

```sh
npm ci
npm run dev
```

## ビルド

```sh
npm run build
```

ビルドは `/profile/` を base にし、Home / Product / Cosme / Me / Links の各URLを事前描画して `dist/` に出力します。GitHub Actions が草データを取得して Pages に公開します。
