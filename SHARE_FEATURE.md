# シェア機能のセットアップガイド

## 概要
未ログインユーザーでも閲覧可能なシェアページ機能を実装しています。

## セットアップ手順

### 1. Firestore セキュリティルールのデプロイ

シェア機能を有効にするには、Firestoreのセキュリティルールをデプロイする必要があります。

```bash
firebase deploy --only firestore:rules
```

### 2. Firestore インデックスの作成

シェアIDで検索するために、複合インデックスが必要です。

#### 自動作成（推奨）
1. アプリを起動して、シェアリンクにアクセス
2. ブラウザのコンソールにインデックス作成リンクが表示される
3. リンクをクリックしてインデックスを自動作成

#### 手動作成
Firebaseコンソールで以下のインデックスを作成：

- **コレクション**: `users`
- **フィールド1**: `shareId` (Ascending)
- **フィールド2**: `sharingEnabled` (Ascending)
- **クエリスコープ**: Collection

### 3. 環境変数の確認

`.env.local`ファイルが存在し、Firebase設定が正しいことを確認してください：

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 使い方

### シェアリンクの生成
1. ログインしてダッシュボードにアクセス
2. 「禁煙記録をシェア」セクションで「シェアリンクを生成」をクリック
3. URLをコピーして共有

### シェアページの閲覧
- 未ログインでもアクセス可能
- リアルタイムで禁煙時間が更新される
- 個人情報は含まれない（禁煙統計のみ）

## トラブルシューティング

### エラー: "共有データが見つかりませんでした"

**原因1**: Firestoreインデックスが作成されていない
- **解決**: ブラウザのコンソールを確認し、インデックス作成リンクをクリック

**原因2**: シェアリングが有効化されていない
- **解決**: ダッシュボードで再度「シェアリンクを生成」をクリック

**原因3**: Firestoreセキュリティルールがデプロイされていない
- **解決**: `firebase deploy --only firestore:rules` を実行

### エラー: "データの取得中にエラーが発生しました"

**原因1**: Firebase環境変数が設定されていない
- **解決**: `.env.local`ファイルを作成し、正しいFirebase設定を追加

**原因2**: Firestoreへの接続エラー
- **解決**: Firebaseプロジェクトが正しく設定されているか確認

## デバッグ

開発モードでは、ブラウザのコンソールに詳細なログが表示されます：

```
[getSharedData] Searching for shareId: abc123
[getSharedData] Creating query...
[getSharedData] Executing query...
[getSharedData] Query completed. Documents found: 1
[getSharedData] Document data retrieved successfully
```

エラーが発生した場合は、コンソールログを確認してください。

## セキュリティ

- シェアが有効な場合のみ、未ログインユーザーが閲覧可能
- 個人を特定できる情報（メールアドレス、名前など）は含まれません
- いつでもシェアリングを無効化できます
