# セットアップガイド

このアプリケーションは Next.js + Firebase + Vercel で構築されています。以下の手順に従ってセットアップしてください。

## 前提条件

- Node.js 18.x 以上
- npm または yarn
- Firebase アカウント
- Vercel アカウント（デプロイする場合）

## 1. Firebase プロジェクトのセットアップ

### 1.1 Firebase プロジェクトを作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: no-smoking-app）
4. Google Analytics は任意で設定
5. プロジェクトを作成

### 1.2 Firebase Authentication を有効化

1. Firebase Console で「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを選択
4. 使用したいプロバイダーを有効化：
   - **Google**: 「有効にする」をクリックし、プロジェクトのサポートメールを設定
   - **GitHub**:
     - GitHub で [OAuth App を作成](https://github.com/settings/applications/new)
     - Authorization callback URL に Firebase が提供する URL を設定
     - Client ID と Client Secret を Firebase に入力

### 1.3 Firestore Database を作成

1. Firebase Console で「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. 本番環境モードで開始（後でルールを設定）
4. ロケーションを選択（例: asia-northeast1）

### 1.4 Firestore セキュリティルールを設定

Firestore の「ルール」タブで以下を設定：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // ユーザーの禁煙データ
    match /users/{userId}/smokingData/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 1.5 Firebase 設定情報を取得

1. Firebase Console で「プロジェクトの設定」（歯車アイコン）を選択
2. 「全般」タブの「マイアプリ」セクション
3. Web アプリを追加（</> アイコン）
4. アプリのニックネームを入力
5. 表示される設定情報をコピー

## 2. ローカル環境のセットアップ

### 2.1 依存関係をインストール

```bash
npm install
```

### 2.2 環境変数を設定

`.env.local.example` をコピーして `.env.local` を作成：

```bash
cp .env.local.example .env.local
```

`.env.local` に Firebase の設定情報を入力：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2.3 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 3. Vercel へのデプロイ

### 3.1 Vercel プロジェクトを作成

1. [Vercel](https://vercel.com) にログイン
2. 「New Project」をクリック
3. GitHub リポジトリを選択
4. プロジェクト設定：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 3.2 環境変数を設定

Vercel のプロジェクト設定で「Environment Variables」を選択し、`.env.local` と同じ環境変数を追加：

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 3.3 デプロイ

「Deploy」ボタンをクリックしてデプロイします。

### 3.4 Firebase の認証ドメインを更新

1. Firebase Console の「Authentication」→「Settings」→「Authorized domains」
2. Vercel のデプロイ URL（例: `your-app.vercel.app`）を追加

## 4. GitHub OAuth の設定（GitHub ログインを使用する場合）

1. [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. 「New OAuth App」をクリック
3. 以下を入力：
   - Application name: No Smoking App
   - Homepage URL: `https://your-app.vercel.app`
   - Authorization callback URL: Firebase Console の GitHub プロバイダー設定から取得した URL
4. Client ID と Client Secret を Firebase Console に入力

## トラブルシューティング

### ログインできない

- Firebase Console で Authentication が有効化されているか確認
- 環境変数が正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### Firestore にデータが保存されない

- Firestore セキュリティルールが正しく設定されているか確認
- ユーザーがログインしているか確認

### デプロイが失敗する

- `npm run build` がローカルで成功するか確認
- Vercel の環境変数が正しく設定されているか確認
- ビルドログでエラーメッセージを確認

## サポート

問題が解決しない場合は、GitHub Issues でお問い合わせください。
