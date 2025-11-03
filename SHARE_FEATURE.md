# シェア機能のセットアップガイド

## 概要
未ログインユーザーでも閲覧可能なシェアページ機能を実装しています。

## セットアップ手順

### 1. Firestore セキュリティルールのデプロイ **（重要！）**

シェア機能を有効にするには、Firestoreのセキュリティルールをデプロイする必要があります。

#### オプション A: CI/CD（推奨）

mainブランチにマージすると自動的にデプロイされます。

詳細は [FIREBASE_CI_SETUP.md](FIREBASE_CI_SETUP.md) を参照してください。

#### オプション B: 手動デプロイ

```bash
firebase deploy --only firestore:rules
```

**注意**: このステップを実行しないと `Missing or insufficient permissions` エラーが発生します。

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

### ❌ エラー: "Missing or insufficient permissions"

**これが最も一般的なエラーです！**

**原因**: Firestoreセキュリティルールがデプロイされていない

**解決方法**:
```bash
firebase deploy --only firestore:rules
```

デプロイ後、数秒待ってからページをリロードしてください。

---

### エラー: "共有データが見つかりませんでした"

**原因1**: Firestoreインデックスが作成されていない
- **解決**: ブラウザのコンソールを確認し、インデックス作成リンクをクリック

**原因2**: シェアリングが有効化されていない
- **解決**: ダッシュボードで再度「シェアリンクを生成」をクリック

**原因3**: URLが間違っている
- **解決**: シェアリンクをコピーし直してアクセスしてください

---

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

### セキュリティルールの説明

更新されたFirestoreセキュリティルールは以下のように動作します：

1. **書き込み**: 認証済みユーザーが自分のドキュメントのみ更新可能
2. **読み取り（get / list）**:
   - 認証済みユーザーは自分のドキュメントを読み取り可能
   - 誰でも `sharingEnabled == true` のドキュメントを読み取り可能（未ログインユーザーを含む）

### データプライバシー

- シェアが有効な場合のみ、未ログインユーザーが閲覧可能
- 個人を特定できる情報（メールアドレス、名前など）は含まれません
- 共有されるデータ：禁煙開始日、統計情報（節約金額、吸わなかったタバコ数など）
- いつでもシェアリングを無効化できます

### セキュリティ上の注意

`allow read` により未ログインユーザーも `sharingEnabled == true` のドキュメントを読み取れますが：
- クエリ結果には `sharingEnabled == true` のドキュメントのみが含まれます
- 書き込み操作は認証済みユーザーのみに厳密に制限されています
- ユーザーIDやメールアドレスなどの個人情報は共有されません
