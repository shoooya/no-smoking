# 禁煙サポートアプリ 🚭

あなたの健康と未来のために作られた、禁煙継続をサポートするWebアプリケーションです。

## 特徴

### 📊 リアルタイム統計
- **禁煙継続時間**: 日・時間・分・秒でリアルタイム表示
- **節約金額**: タバコを買わなかったことで節約できた金額を計算
- **吸わなかったタバコ数**: 禁煙で避けられたタバコの本数
- **取り戻した時間**: タバコ1本につき11分寿命が縮むという研究に基づいた計算
- **健康回復度**: 15年で100%に達する健康回復の進捗

### 🏥 健康マイルストーン
医学的根拠に基づいた健康改善のタイムライン：
- 20分後: 血圧と脈拍が正常値に
- 8時間後: 血中の一酸化炭素濃度が正常値に
- 24時間後: 心臓発作のリスクが減少開始
- 2日後: 味覚と嗅覚が回復開始
- 1週間後: 肺機能が改善
- 1ヶ月後: 循環器系が大幅改善
- 3ヶ月後: 肺がきれいに
- 1年後: 心臓病のリスクが半減
- 5年後: 肺がん等のリスクが大幅低下
- 15年後: 健康状態がほぼ非喫煙者レベルに

### 🏆 達成バッジシステム
モチベーション維持のための12種類のバッジ：
- 時間ベース: 1時間、1日、3日、1週間、2週間、1ヶ月、3ヶ月、6ヶ月、1年
- 節約金額ベース: 1万円、5万円、10万円

### 📈 進捗バー
次の目標までの進捗を視覚化：
- 1週間達成までの進捗
- 1ヶ月達成までの進捗
- 1年達成までの進捗

### 💬 モチベーションメッセージ
毎日変わる励ましのメッセージで継続をサポート

### 💾 データ永続化
LocalStorageを使用してデータを自動保存。ブラウザを閉じても記録が保持されます。

## デモ・公開方法

### GitHub Pagesで公開（推奨）

#### 方法1: ブランチから直接公開（最も簡単）

1. このブランチをmainブランチにマージ
2. GitHubのリポジトリページで **Settings** → **Pages** を開く
3. **Source** で「**Deploy from a branch**」を選択
4. **Branch** で「**main**」/「**/ (root)**」を選択して **Save**
5. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` でアクセス可能に！

例: `https://shoooya.github.io/no-smoking/`

#### 方法2: GitHub Actionsで自動デプロイ（オプション）

より高度な設定が必要な場合は、`.github/workflows/deploy.yml` を作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

その後、**Settings** → **Pages** → **Source** で「**GitHub Actions**」を選択

## 使い方

1. `index.html` をWebブラウザで開きます
2. 初回起動時に以下の情報を入力：
   - 禁煙開始日時
   - 1日あたりの喫煙本数
   - タバコ1箱の価格
   - 1箱あたりの本数
3. 「禁煙を開始する」ボタンをクリック
4. ダッシュボードが表示され、リアルタイムで統計が更新されます

## 技術スタック

- **HTML5**: セマンティックなマークアップ
- **CSS3**: グラデーション、アニメーション、レスポンシブデザイン
- **JavaScript (Vanilla)**: フレームワーク不要のピュアJS実装
- **LocalStorage API**: データ永続化

## ブラウザ互換性

モダンブラウザに対応：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## ライセンス

MIT License

## 健康に関する注意事項

このアプリケーションは禁煙のサポートツールです。重度のニコチン依存症の場合は、医療機関での専門的な治療をお勧めします。

---

**あなたの健康的な未来を応援しています！** 💪✨
