# 禁煙サポートアプリ 🚭

あなたの健康と未来のために作られた、禁煙継続をサポートする Web アプリケーションです。

## ✨ 新機能

### 🔐 ソーシャルログイン対応
- Google アカウントでログイン
- GitHub アカウントでログイン
- デバイス間でデータを同期

### ☁️ クラウド同期
- Firebase Firestore によるリアルタイム同期
- 複数デバイスからアクセス可能
- データの自動バックアップ

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

## 技術スタック

### フロントエンド
- **Next.js 14**: React フレームワーク（App Router）
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: ユーティリティファーストの CSS フレームワーク

### バックエンド
- **Firebase Authentication**: ソーシャルログイン
- **Firebase Firestore**: NoSQL データベース

### デプロイ
- **Vercel**: 自動デプロイとホスティング

## セットアップ

詳細なセットアップ手順は [SETUP.md](SETUP.md) をご覧ください。

### クイックスタート

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/shoooya/no-smoking.git
   cd no-smoking
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **環境変数を設定**
   ```bash
   cp .env.local.example .env.local
   # .env.local に Firebase の設定情報を入力
   ```

4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

5. http://localhost:3000 でアプリケーションが起動します

## デプロイ

### Vercel へのデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshoooya%2Fno-smoking)

1. 上のボタンをクリック
2. GitHub アカウントでログイン
3. リポジトリをフォーク
4. 環境変数を設定
5. デプロイ

## プロジェクト構造

```
no-smoking/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   └── globals.css        # グローバルスタイル
├── components/            # React コンポーネント
│   ├── AuthButton.tsx     # 認証ボタン
│   └── LoginPage.tsx      # ログインページ
├── contexts/              # React Context
│   └── AuthContext.tsx    # 認証コンテキスト
├── lib/                   # ユーティリティ
│   └── firebase.ts        # Firebase 設定
├── legacy/                # 旧バージョン（静的 HTML）
│   ├── index.html
│   ├── styles.css
│   └── js/
├── .env.local.example     # 環境変数のテンプレート
├── next.config.js         # Next.js 設定
├── tailwind.config.js     # Tailwind CSS 設定
├── tsconfig.json          # TypeScript 設定
└── package.json           # 依存関係
```

## 開発

### スクリプト

- `npm run dev`: 開発サーバーを起動
- `npm run build`: 本番ビルドを作成
- `npm run start`: 本番サーバーを起動
- `npm run lint`: コードをリント

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

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まず Issue を開いて変更内容を議論してください。

## サポート

問題や質問がある場合は、[GitHub Issues](https://github.com/shoooya/no-smoking/issues) でお問い合わせください。

---

**あなたの健康的な未来を応援しています！** 💪✨
